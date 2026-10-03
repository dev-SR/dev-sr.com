


### Level 3: Resource-Based Authorization

The real power of custom handlers is making decisions based on the resource being accessed. Can this user edit _this specific post_? Not just "can they edit posts in general?"

### Resource Requirement

```
public sealed class ResourceOperationRequirement : IAuthorizationRequirement
{
    public string ResourceType { get; }
    public ResourceOperation Operation { get; }
public ResourceOperationRequirement(string resourceType, ResourceOperation operation)
    {
        ResourceType = resourceType;
        Operation = operation;
    }
}
public enum ResourceOperation
{
    Create,
    Read,
    Update,
    Delete,
    List,
    Approve,
    Reject
}
```

```
public sealed class ResourceOperationRequirement : IAuthorizationRequirement
{
    public string ResourceType { get; }
    public ResourceOperation Operation { get; }
public ResourceOperationRequirement(string resourceType, ResourceOperation operation)
    {
        ResourceType = resourceType;
        Operation = operation;
    }
}
public enum ResourceOperation
{
    Create,
    Read,
    Update,
    Delete,
    List,
    Approve,
    Reject
}
```

### Resource-Based Handler

```
public sealed class ResourceAuthorizationHandler : AuthorizationHandler<ResourceOperationRequirement, IResource>
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ResourceAuthorizationHandler> _logger;
public ResourceAuthorizationHandler(
        IServiceProvider serviceProvider,
        ILogger<ResourceAuthorizationHandler> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOperationRequirement requirement,
        IResource resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            return;
        await using var scope = _serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // Load user's effective permissions
        var user = await db.Users
            .AsNoTracking()
            .Include(u => u.Roles)
            .ThenInclude(r => r.Permissions)
            .Include(u => u.DirectPermissions)
            .FirstOrDefaultAsync(u => u.Id == userGuid);
        if (user is null) return;
        var effectivePermissions = user.Roles
            .SelectMany(r => r.Permissions)
            .Union(user.DirectPermissions)
            .Select(p => new { p.ResourceType, p.Action })
            .Distinct()
            .ToList();
        // Check if user has wildcard permission (e.g., "posts:*")
        var hasWildcard = effectivePermissions.Any(p =>
            p.ResourceType == requirement.ResourceType && p.Action == "*");
        // Check specific permission
        var hasSpecific = effectivePermissions.Any(p =>
            p.ResourceType == requirement.ResourceType &&
            p.Action == requirement.Operation.ToString().ToLowerInvariant());
        if (!hasWildcard && !hasSpecific)
        {
            _logger.LogWarning(
                "User {UserId} lacks permission {ResourceType}:{Operation}",
                userGuid, requirement.ResourceType, requirement.Operation);
            return;
        }
        // Ownership check for Update/Delete operations
        if (requirement.Operation is ResourceOperation.Update or ResourceOperation.Delete)
        {
            var isOwner = resource.OwnerId == userGuid;
            var isSuperAdmin = context.User.IsInRole("SuperAdmin");
            if (!isOwner && !isSuperAdmin)
            {
                _logger.LogWarning(
                    "User {UserId} denied {Operation} on {ResourceType} {ResourceId} - not owner",
                    userGuid, requirement.Operation, requirement.ResourceType, resource.Id);
                return;
            }
        }
        _logger.LogInformation(
            "User {UserId} authorized for {Operation} on {ResourceType} {ResourceId}",
            userGuid, requirement.Operation, requirement.ResourceType, resource.Id);

        context.Succeed(requirement);
    }
}
// Marker interface for resources that support authorization
public interface IResource
{
    Guid Id { get; }
    Guid OwnerId { get; }
}
```

```
public sealed class ResourceAuthorizationHandler : AuthorizationHandler<ResourceOperationRequirement, IResource>
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ResourceAuthorizationHandler> _logger;
public ResourceAuthorizationHandler(
        IServiceProvider serviceProvider,
        ILogger<ResourceAuthorizationHandler> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOperationRequirement requirement,
        IResource resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            return;
        await using var scope = _serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // Load user's effective permissions
        var user = await db.Users
            .AsNoTracking()
            .Include(u => u.Roles)
            .ThenInclude(r => r.Permissions)
            .Include(u => u.DirectPermissions)
            .FirstOrDefaultAsync(u => u.Id == userGuid);
        if (user is null) return;
        var effectivePermissions = user.Roles
            .SelectMany(r => r.Permissions)
            .Union(user.DirectPermissions)
            .Select(p => new { p.ResourceType, p.Action })
            .Distinct()
            .ToList();
        // Check if user has wildcard permission (e.g., "posts:*")
        var hasWildcard = effectivePermissions.Any(p =>
            p.ResourceType == requirement.ResourceType && p.Action == "*");
        // Check specific permission
        var hasSpecific = effectivePermissions.Any(p =>
            p.ResourceType == requirement.ResourceType &&
            p.Action == requirement.Operation.ToString().ToLowerInvariant());
        if (!hasWildcard && !hasSpecific)
        {
            _logger.LogWarning(
                "User {UserId} lacks permission {ResourceType}:{Operation}",
                userGuid, requirement.ResourceType, requirement.Operation);
            return;
        }
        // Ownership check for Update/Delete operations
        if (requirement.Operation is ResourceOperation.Update or ResourceOperation.Delete)
        {
            var isOwner = resource.OwnerId == userGuid;
            var isSuperAdmin = context.User.IsInRole("SuperAdmin");
            if (!isOwner && !isSuperAdmin)
            {
                _logger.LogWarning(
                    "User {UserId} denied {Operation} on {ResourceType} {ResourceId} - not owner",
                    userGuid, requirement.Operation, requirement.ResourceType, resource.Id);
                return;
            }
        }
        _logger.LogInformation(
            "User {UserId} authorized for {Operation} on {ResourceType} {ResourceId}",
            userGuid, requirement.Operation, requirement.ResourceType, resource.Id);

        context.Succeed(requirement);
    }
}
// Marker interface for resources that support authorization
public interface IResource
{
    Guid Id { get; }
    Guid OwnerId { get; }
}
```

### Resource Implementation

```
public sealed class BlogPost : IResource
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public PostStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsProtected { get; set; }
}
public enum PostStatus { Draft, Published, Flagged, Archived }
```

```
public sealed class BlogPost : IResource
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public PostStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsProtected { get; set; }
}
public enum PostStatus { Draft, Published, Flagged, Archived }
```

### Using Resource-Based Authorization

```
app.MapPut("/api/posts/{id:guid}", async (
    Guid id,
    UpdatePostRequest request,
    IPostService posts,
    IAuthorizationService auth,
    ClaimsPrincipal user) =>
{
    var post = await posts.GetByIdAsync(id);
    if (post is null) return Results.NotFound();
// Authorize against the specific resource
    var result = await auth.AuthorizeAsync(
        user,
        post,
        new ResourceOperationRequirement("posts", ResourceOperation.Update));
    if (!result.Succeeded)
        return Results.Forbid();
    var updated = await posts.UpdateAsync(id, request);
    return Results.Ok(updated);
});
app.MapDelete("/api/posts/{id:guid}", async (
    Guid id,
    IPostService posts,
    IAuthorizationService auth,
    ClaimsPrincipal user) =>
{
    var post = await posts.GetByIdAsync(id);
    if (post is null) return Results.NotFound();
    var result = await auth.AuthorizeAsync(
        user,
        post,
        new ResourceOperationRequirement("posts", ResourceOperation.Delete));
    if (!result.Succeeded)
        return Results.Forbid();
    await posts.DeleteAsync(id);
    return Results.NoContent();
});
```

```
app.MapPut("/api/posts/{id:guid}", async (
    Guid id,
    UpdatePostRequest request,
    IPostService posts,
    IAuthorizationService auth,
    ClaimsPrincipal user) =>
{
    var post = await posts.GetByIdAsync(id);
    if (post is null) return Results.NotFound();
// Authorize against the specific resource
    var result = await auth.AuthorizeAsync(
        user,
        post,
        new ResourceOperationRequirement("posts", ResourceOperation.Update));
    if (!result.Succeeded)
        return Results.Forbid();
    var updated = await posts.UpdateAsync(id, request);
    return Results.Ok(updated);
});
app.MapDelete("/api/posts/{id:guid}", async (
    Guid id,
    IPostService posts,
    IAuthorizationService auth,
    ClaimsPrincipal user) =>
{
    var post = await posts.GetByIdAsync(id);
    if (post is null) return Results.NotFound();
    var result = await auth.AuthorizeAsync(
        user,
        post,
        new ResourceOperationRequirement("posts", ResourceOperation.Delete));
    if (!result.Succeeded)
        return Results.Forbid();
    await posts.DeleteAsync(id);
    return Results.NoContent();
});
```

### Level 4: Permission Authorization Attributes

Manually calling `IAuthorizationService` in every endpoint gets verbose. Create a custom authorization attribute that handles the boilerplate.

### Custom Authorize Attribute

```
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public sealed class RequirePermissionAttribute : AuthorizeAttribute
{
    public string ResourceType { get; }
    public string Operation { get; }
public RequirePermissionAttribute(string resourceType, string operation)
    {
        ResourceType = resourceType;
        Operation = operation;
        // This triggers policy evaluation with the requirement
        Policy = $"Permission:{resourceType}:{operation}";
    }
}
// Extension to register all permission policies dynamically
public static class PermissionAuthorizationExtensions
{
    public static IServiceCollection AddPermissionAuthorization(
        this IServiceCollection services,
        IEnumerable<Permission> permissions)
    {
        services.AddAuthorization(options =>
        {
            foreach (var permission in permissions)
            {
                var policyName = $"Permission:{permission.ResourceType}:{permission.Action}";
                options.AddPolicy(policyName, policy =>
                    policy.Requirements.Add(
                        new ResourceOperationRequirement(
                            permission.ResourceType,
                            Enum.Parse<ResourceOperation>(permission.Action, true))));
            }
        });
        services.AddSingleton<IAuthorizationHandler, ResourceAuthorizationHandler>();
        return services;
    }
}
```

```
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public sealed class RequirePermissionAttribute : AuthorizeAttribute
{
    public string ResourceType { get; }
    public string Operation { get; }
public RequirePermissionAttribute(string resourceType, string operation)
    {
        ResourceType = resourceType;
        Operation = operation;
        // This triggers policy evaluation with the requirement
        Policy = $"Permission:{resourceType}:{operation}";
    }
}
// Extension to register all permission policies dynamically
public static class PermissionAuthorizationExtensions
{
    public static IServiceCollection AddPermissionAuthorization(
        this IServiceCollection services,
        IEnumerable<Permission> permissions)
    {
        services.AddAuthorization(options =>
        {
            foreach (var permission in permissions)
            {
                var policyName = $"Permission:{permission.ResourceType}:{permission.Action}";
                options.AddPolicy(policyName, policy =>
                    policy.Requirements.Add(
                        new ResourceOperationRequirement(
                            permission.ResourceType,
                            Enum.Parse<ResourceOperation>(permission.Action, true))));
            }
        });
        services.AddSingleton<IAuthorizationHandler, ResourceAuthorizationHandler>();
        return services;
    }
}
```

### Cleaner Endpoint Usage

```
// With custom attribute (Controllers)
[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    [HttpGet]
    [RequirePermission("posts", "list")]
    public async Task<IActionResult> GetAll() { /* ... */ }
[HttpGet("{id:guid}")]
    [RequirePermission("posts", "read")]
    public async Task<IActionResult> GetById(Guid id) { /* ... */ }
    [HttpPut("{id:guid}")]
    [RequirePermission("posts", "update")]
    public async Task<IActionResult> Update(Guid id, UpdatePostRequest request) { /* ... */ }
    [HttpDelete("{id:guid}")]
    [RequirePermission("posts", "delete")]
    public async Task<IActionResult> Delete(Guid id) { /* ... */ }
}
// With Minimal API helper
public static class PermissionEndpointExtensions
{
    public static IEndpointConventionBuilder RequirePermission(
        this IEndpointConventionBuilder builder,
        string resourceType,
        string operation)
    {
        return builder.RequireAuthorization($"Permission:{resourceType}:{operation}");
    }
}
// Usage
app.MapGet("/api/posts", async (IPostService posts) => await posts.GetAllAsync())
   .RequirePermission("posts", "list");
app.MapPut("/api/posts/{id:guid}", async (Guid id, UpdatePostRequest request, IPostService posts) =>
    await posts.UpdateAsync(id, request))
   .RequirePermission("posts", "update");
```

```
// With custom attribute (Controllers)
[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    [HttpGet]
    [RequirePermission("posts", "list")]
    public async Task<IActionResult> GetAll() { /* ... */ }
[HttpGet("{id:guid}")]
    [RequirePermission("posts", "read")]
    public async Task<IActionResult> GetById(Guid id) { /* ... */ }
    [HttpPut("{id:guid}")]
    [RequirePermission("posts", "update")]
    public async Task<IActionResult> Update(Guid id, UpdatePostRequest request) { /* ... */ }
    [HttpDelete("{id:guid}")]
    [RequirePermission("posts", "delete")]
    public async Task<IActionResult> Delete(Guid id) { /* ... */ }
}
// With Minimal API helper
public static class PermissionEndpointExtensions
{
    public static IEndpointConventionBuilder RequirePermission(
        this IEndpointConventionBuilder builder,
        string resourceType,
        string operation)
    {
        return builder.RequireAuthorization($"Permission:{resourceType}:{operation}");
    }
}
// Usage
app.MapGet("/api/posts", async (IPostService posts) => await posts.GetAllAsync())
   .RequirePermission("posts", "list");
app.MapPut("/api/posts/{id:guid}", async (Guid id, UpdatePostRequest request, IPostService posts) =>
    await posts.UpdateAsync(id, request))
   .RequirePermission("posts", "update");
```

### Level 5: Testing Authorization Handlers

Authorization handlers are pure logic — perfect for unit testing.

```
public class ResourceAuthorizationHandlerTests
{
    private readonly Mock<IServiceProvider> _serviceProviderMock = new();
    private readonly Mock<ILogger<ResourceAuthorizationHandler>> _loggerMock = new();
    private readonly Mock<AppDbContext> _dbMock;
    private readonly ResourceAuthorizationHandler _handler;
public ResourceAuthorizationHandlerTests()
    {
        _dbMock = new Mock<AppDbContext>();

        var scopeMock = new Mock<IServiceScope>();
        scopeMock.Setup(s => s.ServiceProvider.GetService(typeof(AppDbContext)))
            .Returns(_dbMock.Object);

        var scopeFactoryMock = new Mock<IServiceScopeFactory>();
        scopeFactoryMock.Setup(f => f.CreateScope()).Returns(scopeMock.Object);

        _serviceProviderMock.Setup(sp => sp.GetService(typeof(IServiceScopeFactory)))
            .Returns(scopeFactoryMock.Object);
        _handler = new ResourceAuthorizationHandler(
            _serviceProviderMock.Object,
            _loggerMock.Object);
    }
    [Fact]
    public async Task HandleRequirementAsync_OwnResourceWithPermission_Succeeds()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var resource = new TestResource { Id = Guid.NewGuid(), OwnerId = userId };
        var requirement = new ResourceOperationRequirement("posts", ResourceOperation.Update);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }));
        var context = new AuthorizationHandlerContext(
            new[] { requirement },
            user,
            resource);
        SetupUserWithPermission(userId, "posts", "update");
        // Act
        await _handler.HandleAsync(context);
        // Assert
        context.HasSucceeded.Should().BeTrue();
    }
    [Fact]
    public async Task HandleRequirementAsync_NonOwnerWithoutSuperAdmin_Fails()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var ownerId = Guid.NewGuid();
        var resource = new TestResource { Id = Guid.NewGuid(), OwnerId = ownerId };
        var requirement = new ResourceOperationRequirement("posts", ResourceOperation.Delete);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }));
        var context = new AuthorizationHandlerContext(
            new[] { requirement },
            user,
            resource);
        SetupUserWithPermission(userId, "posts", "delete");
        // Act
        await _handler.HandleAsync(context);
        // Assert
        context.HasSucceeded.Should().BeFalse();
    }
    private void SetupUserWithPermission(Guid userId, string resourceType, string action)
    {
        var permission = new Permission
        {
            Name = $"{resourceType}:{action}",
            ResourceType = resourceType,
            Action = action
        };

        var user = new User
        {
            Id = userId,
            Roles = new List<Role>
            {
                new Role
                {
                    Permissions = new List<Permission> { permission }
                }
            }
        };
        _dbMock.Setup(db => db.Users).ReturnsDbSet(new[] { user });
    }
    private class TestResource : IResource
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
    }
}
```

```
public class ResourceAuthorizationHandlerTests
{
    private readonly Mock<IServiceProvider> _serviceProviderMock = new();
    private readonly Mock<ILogger<ResourceAuthorizationHandler>> _loggerMock = new();
    private readonly Mock<AppDbContext> _dbMock;
    private readonly ResourceAuthorizationHandler _handler;
public ResourceAuthorizationHandlerTests()
    {
        _dbMock = new Mock<AppDbContext>();

        var scopeMock = new Mock<IServiceScope>();
        scopeMock.Setup(s => s.ServiceProvider.GetService(typeof(AppDbContext)))
            .Returns(_dbMock.Object);

        var scopeFactoryMock = new Mock<IServiceScopeFactory>();
        scopeFactoryMock.Setup(f => f.CreateScope()).Returns(scopeMock.Object);

        _serviceProviderMock.Setup(sp => sp.GetService(typeof(IServiceScopeFactory)))
            .Returns(scopeFactoryMock.Object);
        _handler = new ResourceAuthorizationHandler(
            _serviceProviderMock.Object,
            _loggerMock.Object);
    }
    [Fact]
    public async Task HandleRequirementAsync_OwnResourceWithPermission_Succeeds()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var resource = new TestResource { Id = Guid.NewGuid(), OwnerId = userId };
        var requirement = new ResourceOperationRequirement("posts", ResourceOperation.Update);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }));
        var context = new AuthorizationHandlerContext(
            new[] { requirement },
            user,
            resource);
        SetupUserWithPermission(userId, "posts", "update");
        // Act
        await _handler.HandleAsync(context);
        // Assert
        context.HasSucceeded.Should().BeTrue();
    }
    [Fact]
    public async Task HandleRequirementAsync_NonOwnerWithoutSuperAdmin_Fails()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var ownerId = Guid.NewGuid();
        var resource = new TestResource { Id = Guid.NewGuid(), OwnerId = ownerId };
        var requirement = new ResourceOperationRequirement("posts", ResourceOperation.Delete);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }));
        var context = new AuthorizationHandlerContext(
            new[] { requirement },
            user,
            resource);
        SetupUserWithPermission(userId, "posts", "delete");
        // Act
        await _handler.HandleAsync(context);
        // Assert
        context.HasSucceeded.Should().BeFalse();
    }
    private void SetupUserWithPermission(Guid userId, string resourceType, string action)
    {
        var permission = new Permission
        {
            Name = $"{resourceType}:{action}",
            ResourceType = resourceType,
            Action = action
        };

        var user = new User
        {
            Id = userId,
            Roles = new List<Role>
            {
                new Role
                {
                    Permissions = new List<Permission> { permission }
                }
            }
        };
        _dbMock.Setup(db => db.Users).ReturnsDbSet(new[] { user });
    }
    private class TestResource : IResource
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
    }
}
```

### Level 6: Advanced Patterns

### Multi-Handler OR Logic

Sometimes any one of several conditions should grant access. Register multiple handlers for the same requirement.

```
// Handler 1: Check ownership
public class OwnerAuthorizationHandler : AuthorizationHandler<ResourceOperationRequirement, IResource>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOperationRequirement requirement,
        IResource resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is not null && Guid.Parse(userId) == resource.OwnerId)
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
// Handler 2: Check admin role
public class AdminAuthorizationHandler : AuthorizationHandler<ResourceOperationRequirement, IResource>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOperationRequirement requirement,
        IResource resource)
    {
        if (context.User.IsInRole("SuperAdmin"))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
// Both registered - either one succeeding grants access
builder.Services.AddSingleton<IAuthorizationHandler, OwnerAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, AdminAuthorizationHandler>();
```

```
// Handler 1: Check ownership
public class OwnerAuthorizationHandler : AuthorizationHandler<ResourceOperationRequirement, IResource>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOperationRequirement requirement,
        IResource resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is not null && Guid.Parse(userId) == resource.OwnerId)
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
// Handler 2: Check admin role
public class AdminAuthorizationHandler : AuthorizationHandler<ResourceOperationRequirement, IResource>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOperationRequirement requirement,
        IResource resource)
    {
        if (context.User.IsInRole("SuperAdmin"))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
// Both registered - either one succeeding grants access
builder.Services.AddSingleton<IAuthorizationHandler, OwnerAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, AdminAuthorizationHandler>();
```

### Time-Based Authorization

```
public sealed class BusinessHoursRequirement : IAuthorizationRequirement { }
public sealed class BusinessHoursHandler : AuthorizationHandler<BusinessHoursRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        BusinessHoursRequirement requirement)
    {
        var now = DateTime.UtcNow;
        var isBusinessHours = now.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday
            && now.Hour is >= 9 and < 17;
        if (isBusinessHours || context.User.IsInRole("EmergencyAccess"))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
```

```
public sealed class BusinessHoursRequirement : IAuthorizationRequirement { }
public sealed class BusinessHoursHandler : AuthorizationHandler<BusinessHoursRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        BusinessHoursRequirement requirement)
    {
        var now = DateTime.UtcNow;
        var isBusinessHours = now.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday
            && now.Hour is >= 9 and < 17;
        if (isBusinessHours || context.User.IsInRole("EmergencyAccess"))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
```

### IP-Based Authorization

```
public sealed class IpWhitelistRequirement : IAuthorizationRequirement
{
    public List<string> AllowedIPs { get; }
public IpWhitelistRequirement(params string[] allowedIPs)
    {
        AllowedIPs = allowedIPs.ToList();
    }
}
public sealed class IpWhitelistHandler : AuthorizationHandler<IpWhitelistRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public IpWhitelistHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IpWhitelistRequirement requirement)
    {
        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();

        if (ip is not null && requirement.AllowedIPs.Contains(ip))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
```

```
public sealed class IpWhitelistRequirement : IAuthorizationRequirement
{
    public List<string> AllowedIPs { get; }
public IpWhitelistRequirement(params string[] allowedIPs)
    {
        AllowedIPs = allowedIPs.ToList();
    }
}
public sealed class IpWhitelistHandler : AuthorizationHandler<IpWhitelistRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public IpWhitelistHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IpWhitelistRequirement requirement)
    {
        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();

        if (ip is not null && requirement.AllowedIPs.Contains(ip))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
```

### The Complete Program.cs

```
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
var builder = WebApplication.CreateBuilder(args);
// ── Authentication ──
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Jwt:Authority"];
        options.Audience = builder.Configuration["Jwt:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            RoleClaimType = ClaimTypes.Role
        };
    });
// ── Authorization with Custom Handlers ──
builder.Services.AddAuthorization(options =>
{
    // Simple permission policies
    options.AddPolicy("CanReadPosts", policy =>
        policy.Requirements.Add(new PermissionRequirement("posts:read")));

    // Resource-based policies (registered dynamically)
    options.AddPolicy("Permission:posts:update", policy =>
        policy.Requirements.Add(new ResourceOperationRequirement("posts", ResourceOperation.Update)));

    options.AddPolicy("Permission:posts:delete", policy =>
        policy.Requirements.Add(new ResourceOperationRequirement("posts", ResourceOperation.Delete)));

    // Composite policies
    options.AddPolicy("CanManageContent", policy =>
    {
        policy.Requirements.Add(new PermissionRequirement("posts:create"));
        policy.Requirements.Add(new PermissionRequirement("posts:update"));
        policy.Requirements.Add(new PermissionRequirement("posts:delete"));
    });
});
// Register all handlers
builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, ResourceAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, BusinessHoursHandler>();
// Required for IP-based handlers
builder.Services.AddHttpContextAccessor();
// ── Swagger with Auth ──
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
});
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
// ── Endpoints ──
app.MapGet("/api/posts", async (IPostService posts) => await posts.GetAllAsync())
   .RequirePermission("posts", "list");
app.MapGet("/api/posts/{id:guid}", async (Guid id, IPostService posts) =>
    await posts.GetByIdAsync(id))
   .RequirePermission("posts", "read");
app.MapPut("/api/posts/{id:guid}", async (Guid id, UpdatePostRequest req, IPostService posts) =>
    await posts.UpdateAsync(id, req))
   .RequirePermission("posts", "update");
app.MapDelete("/api/posts/{id:guid}", async (Guid id, IPostService posts) =>
    await posts.DeleteAsync(id))
   .RequirePermission("posts", "delete");
app.MapPost("/api/posts/{id:guid}/publish", async (Guid id, IPostService posts) =>
    await posts.PublishAsync(id))
   .RequireAuthorization("CanManageContent") // Composite policy
   .RequireAuthorization("BusinessHours");   // Time-based policy
app.Run();
```

```
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
var builder = WebApplication.CreateBuilder(args);
// ── Authentication ──
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Jwt:Authority"];
        options.Audience = builder.Configuration["Jwt:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            RoleClaimType = ClaimTypes.Role
        };
    });
// ── Authorization with Custom Handlers ──
builder.Services.AddAuthorization(options =>
{
    // Simple permission policies
    options.AddPolicy("CanReadPosts", policy =>
        policy.Requirements.Add(new PermissionRequirement("posts:read")));

    // Resource-based policies (registered dynamically)
    options.AddPolicy("Permission:posts:update", policy =>
        policy.Requirements.Add(new ResourceOperationRequirement("posts", ResourceOperation.Update)));

    options.AddPolicy("Permission:posts:delete", policy =>
        policy.Requirements.Add(new ResourceOperationRequirement("posts", ResourceOperation.Delete)));

    // Composite policies
    options.AddPolicy("CanManageContent", policy =>
    {
        policy.Requirements.Add(new PermissionRequirement("posts:create"));
        policy.Requirements.Add(new PermissionRequirement("posts:update"));
        policy.Requirements.Add(new PermissionRequirement("posts:delete"));
    });
});
// Register all handlers
builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, ResourceAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, BusinessHoursHandler>();
// Required for IP-based handlers
builder.Services.AddHttpContextAccessor();
// ── Swagger with Auth ──
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
});
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
// ── Endpoints ──
app.MapGet("/api/posts", async (IPostService posts) => await posts.GetAllAsync())
   .RequirePermission("posts", "list");
app.MapGet("/api/posts/{id:guid}", async (Guid id, IPostService posts) =>
    await posts.GetByIdAsync(id))
   .RequirePermission("posts", "read");
app.MapPut("/api/posts/{id:guid}", async (Guid id, UpdatePostRequest req, IPostService posts) =>
    await posts.UpdateAsync(id, req))
   .RequirePermission("posts", "update");
app.MapDelete("/api/posts/{id:guid}", async (Guid id, IPostService posts) =>
    await posts.DeleteAsync(id))
   .RequirePermission("posts", "delete");
app.MapPost("/api/posts/{id:guid}/publish", async (Guid id, IPostService posts) =>
    await posts.PublishAsync(id))
   .RequireAuthorization("CanManageContent") // Composite policy
   .RequireAuthorization("BusinessHours");   // Time-based policy
app.Run();
```

### Key Takeaways

   ![None](/img/medium/700/1*rYJUd2mtTH9CLF0Aaw8mFg.png)  ![None](/img/medium/700/1*8WjKzwUuIvKhy0ZznH00Kw.png)

### The Bottom Line

Role-based authorization is a starting point, not a destination. The moment your authorization logic includes "unless," "only if," or "except when," you need custom handlers.

ASP.NET Core's policy-based authorization framework gives you the building blocks. Requirements define _what_ must be true. Handlers define _how_ to check it. Policies combine them into reusable, testable, composable security rules.

Stop writing authorization logic in your controllers. Move it into handlers. Your endpoints become cleaner. Your security becomes auditable. Your tests become trivial.

References:

-   [Microsoft: Policy-based Authorization in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-10.0)
-   [Microsoft (Traditional Chinese): ASP.NET Core 中的基於政策的授權](https://learn.microsoft.com/zh-tw/aspnet/core/security/authorization/policies?view=aspnetcore-10.0)
-   [Tim Deschryver: Nice to Knows When Implementing Policy-Based Authorization in .NET](https://timdeschryver.dev/blog/nice-to-knows-when-implementing-policy-based-authorization-in-net)
-   [Rahul Nath: Policy-Based Authorization — Building Blocks](https://www.rahulpnath.com/blog/policy-based-authorization-building-blocks-aspnet-core)
-   [Empty Chair: Authentication and Authorization Best Practices in .NET](https://empty-chair.medium.com/authentication-and-authorization-best-practices-in-net-442b986bbfe1)

#### _What's the most complex authorization rule you've had to implement? Did you solve it with roles, claims, or custom handlers? Share your war stories below._