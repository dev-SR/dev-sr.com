---
title: "Project Setup and Organization"
date: '2026-09-21'
excerpt: 'Learn how to setup and organize minimal api project in .NET.'
---

## Building Project Skeleton

This section reproduces every step needed to recreate the project from an empty folder.
Follow it in order — each step builds on the previous one and produces a runnable checkpoint.


<Guide numbered stepHeadingLevel={3}>
  <GuideStep title="Prerequisites">

You need the .NET 10 SDK, the EF Core CLI tools, and optionally Docker.

```bash
# Verify the SDK is installed (10.0.200 or later)
dotnet --version

# Install EF Core CLI tools (one-time, global)
dotnet tool install --global dotnet-ef
dotnet ef --version
```

If `dotnet --version` returns anything older than `10.0.200`, download the SDK from
[https://dotnet.microsoft.com/download/dotnet/10.0](https://dotnet.microsoft.com/download/dotnet/10.0) before continuing. The `global.json`
file we will create in Step 2 enforces this version, so the build will refuse to start
on an older SDK — that is by design.

  </GuideStep>
  <GuideStep title="Create the solution folder and the `.slnx` file">

The new XML solution format (`.slnx`) was shipped in .NET 10 and is dramatically
smaller and merge-friendlier than the legacy `.sln` format. We will create it
manually because the CLI still defaults to `.sln` for `dotnet new sln`.

The repo keeps the .NET solution under `backend/` so that repo-wide files
(`global.json`, `.editorconfig`, `docker-compose.yml`, `Dockerfile`, `README.md`)
stay separate from the .NET build graph. Create that structure now:

```bash
# 1. Create the repo root
mkdir MyApp
cd MyApp

# 2. Create the backend/ folder that will hold the .NET solution
mkdir backend
cd backend

# 3. Create the .slnx inside backend/
dotnet new sln -n MyApp --format slnx
```

After the command runs, you should have `MyApp/backend/MyApp.slnx` containing:

```xml
<Solution>
  <!-- Projects will be added here as we create them -->
</Solution>
```

> **Why `backend/`?** The repo will eventually hold `frontend/` (Next.js),
> `mobile/` (React Native), `backend/src/Services/ml-diagnosis-service/` (Python),
> and repo-wide files (`docker-compose.yml`, `global.json`, `.editorconfig`).
> Keeping the .NET solution under `backend/` means `dotnet build` from `backend/`
> builds only .NET code, and a future `pnpm install` from `frontend/client/` won't
> accidentally pick up `Directory.Packages.props`.

  </GuideStep>
    
<GuideStep title="Create the API project">

Now that the solution-level files exist, create the API project. We use the
`Microsoft.NET.Sdk.Web` SDK because it pulls in ASP.NET Core, configuration,
logging, and Kestrel automatically.

The API project lives under `backend/src/Services/MyApp.Api/` — it is a
*deployable service*, so it goes in `Services/` rather than `BuildingBlocks/`
or `Modules/`. Future siblings (`NotificationService/`, `ReportingService/`,
`ml-diagnosis-service/`) will land alongside it.

```bash
# from MyApp/backend/  (the solution root)

# Create the folder structure for Services/
mkdir -p src/Services

# Create the API project under src/Services/
dotnet new web -n MyApp.Api -o src/Services/MyApp.Api --framework net10.0

# Add it to the solution
dotnet sln MyApp.slnx add src/Services/MyApp.Api/MyApp.Api.csproj
```

The default `Program.cs` from `dotnet new web` is a Hello-World stub. Replace its
contents later in Step 14.

</GuideStep>


<GuideStep title="Pin the SDK with `global.json`">

Without `global.json`, `dotnet` uses whatever SDK is newest on the machine. That breaks
the build the moment a teammate installs a preview build or your CI agent silently
upgrades. Pinning the SDK + roll-forward policy eliminates an entire class of "works
on my machine" bugs.

`global.json` lives at the **repo root** (one level above `backend/`), not inside
`backend/`. That way the SDK pin applies to every `dotnet` invocation in the repo —
including future .NET tools that might live under `frontend/` or `mobile/`, and
including the AppHost project (which needs the SDK to start the orchestration).

```json title="MyApp/global.json"
{
  "sdk": {
    "version": "10.0.200",
    "rollForward": "latestFeature",
    "allowPrerelease": false
  }
}
```

What each field does:

- `version` — the minimum SDK required. `dotnet` walks up the directory tree until
  it finds a `global.json` and uses the matching SDK.
- `rollForward: latestFeature` — allow newer patch/feature builds of the same
  `10.0.2xx` band, but never jump to `10.1` or `11.0`. Use `latestPatch` if you
  want even stricter control.
- `allowPrerelease: false` — refuse RC/preview SDKs in production builds.

Verify it works:

```bash
dotnet --version   # → should print 10.0.2xx
```

</GuideStep>

<GuideStep title="Code style as law with `.editorconfig`">

`.editorconfig` is no longer just about tabs vs. spaces — in modern .NET it is a
Roslyn configuration file that controls analyzer severity, naming conventions, and
formatting rules. Combined with <Mark type="circle">`EnforceCodeStyleInBuild`</Mark>, violations fail CI.

`.editorconfig` lives at the **repo root** (one level above `backend/`), NOT inside
`backend/`. The rules apply to every language in the repo — C# under `backend/`,
TypeScript under `frontend/client/`, Python under `backend/src/Services/ml-diagnosis-service/`,
YAML in `docker-compose.yml` and `backend/k8s/`. One file at the root covers them all.

```ini title=".editorconfig"
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.cs]
indent_size = 4
indent_style = space

# Constants must be PascalCase
dotnet_naming_symbols.constants.applicable_kinds = field, local
dotnet_naming_symbols.constants.applicable_accessibilities = *
dotnet_naming_symbols.constants.required_modifiers = const
dotnet_naming_style.constant_style.capitalization = pascal_case
dotnet_naming_rule.constants_should_be_pascal_case.severity = warning
dotnet_naming_rule.constants_should_be_pascal_case.symbols = constants
dotnet_naming_rule.constants_should_be_pascal_case.style = constant_style

# Async methods should end in Async (suggestion — handlers often skip this)
dotnet_naming_symbols.async_methods.applicable_kinds = method
dotnet_naming_symbols.async_methods.applicable_accessibilities = *
dotnet_naming_symbols.async_methods.required_modifiers = async
dotnet_naming_style.end_in_async.required_suffix = Async
dotnet_naming_style.end_in_async.capitalization = pascal_case
dotnet_naming_rule.async_methods_end_in_async.severity = suggestion
dotnet_naming_rule.async_methods_end_in_async.symbols = async_methods
dotnet_naming_rule.async_methods_end_in_async.style = end_in_async

# Analyzer severity overrides (also silenced via NoWarn in Directory.Build.props)
# CA1303: do not pass literals as localized parameters
dotnet_diagnostic.CA1303.severity = none
# CA1822: mark members as static
dotnet_diagnostic.CA1822.severity = none
# CA2007: ConfigureAwait
dotnet_diagnostic.CA2007.severity = none

# Style preferences
dotnet_style_object_initializer = true:suggestion
dotnet_style_collection_initializer = true:suggestion
csharp_style_implicit_object_creation_when_type_is_apparent = true:suggestion
csharp_style_prefer_primary_constructors = true:suggestion
```

Why `severity = warning` and not `error` for naming rules: `error` blocks the build,
which is overkill for style nits. `warning` shows in CI but does not break it.
Promote specific rules to `error` once the team agrees they are non-negotiable.

#### Testing analyzer rules

1. Create a file:

```csharp title="MyApp/backend/src/Services/MyApp.Api/EditorConfigTest.cs"
public class EditorConfigTest
{
    private const string badConstant = "hello";

    public async Task DoSomething()
    {
        await Task.Delay(10);
    }
}
```

2. Update the following to the `.editorconfig` file:

```ini title="MyApp/.editorconfig"
dotnet_naming_rule.constants_should_be_pascal_case.severity = error
# Required for CLI / EnforceCodeStyleInBuild — naming-rule .severity is IDE-only
dotnet_diagnostic.IDE1006.severity = error
```


3. Add `EnforceCodeStyleInBuild` in <Mark type="circle">`MyApp.Api.csproj`</Mark>

```xml title="MyApp/backend/src/Services/MyApp.Api/MyApp.Api.csproj" sshowLineNumbers {4}
<Project Sdk="Microsoft.NET.Sdk.Web">
  ...
  <PropertyGroup>
    <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  </PropertyGroup>
  ...
</Project>
```

4. Run the build:

```bash
dotnet build
```

output:

```bash
Restore complete (0.9s)
  MyApp.Api net10.0 failed with 2 error(s) (0.6s)
    ~project/arch/MyApp/backend/src/Services/MyApp.Api/EditorConfigTest.cs(8,23): error IDE1006: Naming rule violation: Missing suffix: 'Async' (https://learn.microsoft.com/dotnet/fundamentals/code-analysis/style-rules/ide1006)
    ~project/arch/MyApp/backend/src/Services/MyApp.Api/EditorConfigTest.cs(6,26): error IDE1006: Naming rule violation: These words must begin with upper case characters: badConstant (https://learn.microsoft.com/dotnet/fundamentals/code-analysis/style-rules/ide1006)

Build failed with 2 error(s) in 1.9s
```

</GuideStep>


<GuideStep title="Enable Central Package Management with `Directory.Packages.props`">

Central Package Management (CPM) is the single biggest quality-of-life upgrade you can
make to a multi-project .NET solution. Instead of scattering version numbers across
every `.csproj`, you declare each NuGet version once at the solution root. Projects
then list packages without versions.

`Directory.Packages.props` lives at the <Mark type="box" color="info">**solution root** (`backend/`)</Mark>, alongside
`MyApp.slnx`. 

> MSBuild walks UP the directory tree from each `.csproj` to find it,<br/>so every project under `backend/src/` inherits the same package versions. So you don't have to repeat the version number in every `.csproj` file.

Cli commands:

```bash
cd backend
dotnet new packagesprops
```

And add:

 
```xml title="MyApp/backend/Directory.Packages.props"
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    <CentralPackageTransitiveReplacingEnabled>false</CentralPackageTransitiveReplacingEnabled>
  </PropertyGroup>
  <ItemGroup>
    <!-- ASP.NET Core / .NET 10 -->
    <PackageVersion Include="Microsoft.AspNetCore.OpenApi" Version="10.0.12" />
    <!-- EF Core 10 -->
    <PackageVersion Include="Microsoft.EntityFrameworkCore" Version="10.0.12" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore.Sqlite" Version="10.0.12" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.12" />
    <!-- Validation -->
    <PackageVersion Include="FluentValidation.AspNetCore" Version="11.3.1" />
    <!-- API Versioning + Scalar -->
    <PackageVersion Include="Asp.Versioning.Mvc" Version="10.2.1" />
    <PackageVersion Include="Asp.Versioning.Mvc.ApiExplorer" Version="10.2.1" />
    <PackageVersion Include="Scalar.AspNetCore" Version="2.17.7" />
    <!-- Carter (Minimal API module routing) -->
    <PackageVersion Include="Carter" Version="10.0.0" />
    <!-- Dynamic Linq for sorting -->
    <PackageVersion Include="System.Linq.Dynamic.Core" Version="1.7.4" />
    <!-- Testing -->
    <PackageVersion Include="xunit" Version="2.9.3" />
    <PackageVersion Include="xunit.runner.visualstudio" Version="3.0.2" />
    <PackageVersion Include="Microsoft.NET.Test.Sdk" Version="17.14.0" />
    <PackageVersion Include="FluentAssertions" Version="8.2.0" />
    <PackageVersion Include="NSubstitute" Version="5.3.0" />
    <PackageVersion Include="Microsoft.AspNetCore.Mvc.Testing" Version="10.0.0" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore.InMemory" Version="10.0.0" />
    <!-- Analyzers (applied to ALL projects automatically) -->
    <GlobalPackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="10.0.0" />
  </ItemGroup>
</Project>
```

Key things to notice:

- `<ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>` is the on
  switch. After this, any `PackageReference` in a `.csproj` that includes a `Version`
  attribute will fail the build with `NU1008`.
- `<PackageVersion Include="..." Version="..." />` declares each version exactly once.
- `<GlobalPackageReference>` injects analyzers into every project without touching
  individual `.csproj` files — perfect for `Microsoft.CodeAnalysis.NetAnalyzers`.

</GuideStep>

<GuideStep title="Enforce solution-wide standards with `Directory.Build.props`">

`Directory.Packages.props` controls *what* you depend on. `Directory.Build.props`
controls *how* you build. MSBuild auto-imports this file into every project in the
directory tree, so it is the right place to enforce `Nullable`, `ImplicitUsings`,
analyzer levels, and assembly metadata.

`Directory.Build.props` lives at the <Mark type="box" color="info">**solution root** (`backend/`)</Mark>, alongside `Directory.Packages.props`. Every `.csproj` under `backend/src/` and `backend/tests/` inherits these settings automatically.

Cli commands:

```bash
cd backend
dotnet new buildprops
```

```xml title="MyApp/backend/Directory.Build.props"
<Project>
    <PropertyGroup>
        <!-- Language & Runtime -->
        <TargetFramework>net10.0</TargetFramework>
        <LangVersion>preview</LangVersion>
        <ImplicitUsings>enable</ImplicitUsings>
        <Nullable>enable</Nullable>

        <!-- Compiler Strictness -->
        <TreatWarningsAsErrors>false</TreatWarningsAsErrors>
        <WarningLevel>4</WarningLevel>

        <!-- Code Analysis -->
        <EnableNETAnalyzers>true</EnableNETAnalyzers>
        <AnalysisLevel>latest</AnalysisLevel>
        <AnalysisMode>Default</AnalysisMode>
        <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
        <RunAnalyzersDuringBuild>true</RunAnalyzersDuringBuild>
        <RunAnalyzersDuringLiveAnalysis>true</RunAnalyzersDuringLiveAnalysis>

        <!-- Assembly Info -->
        <Company>MyApp</Company>
        <Authors>Senior Dev Setup</Authors>
        <Copyright>Copyright © $(Company) $([System.DateTime]::Now.Year)</Copyright>

        <!-- Solution-wide build settings -->
        <NeutralLanguage>en</NeutralLanguage>
        <GenerateDocumentationFile>false</GenerateDocumentationFile>
        <NoWarn>$(NoWarn);CA1822;CA1862;CA1303;CA2007;CA1051;CA1716</NoWarn>
    </PropertyGroup>
</Project>
```

A few decisions worth calling out:

- `<TreatWarningsAsErrors>false</TreatWarningsAsErrors>` — flipped on later, once the
  codebase is stable. Starting with `true` from day one is a common mistake that
  frustrates the team before they have written any business logic.
- `<LangVersion>preview</LangVersion>` — gives you the latest C# features (primary
  constructors, collection expressions, etc.) even before they ship as stable.
- `<NoWarn>` — silences a handful of analyzers that are noisy for CRUD APIs
  (`CA1822` is "mark members as static" which fires on every extension method).

</GuideStep>



<GuideStep title="Add package references to the API project">

With CPM enabled, the `.csproj` only declares *which* packages to use — versions
live in `Directory.Packages.props`. Edit `src/Services/MyApp.Api/MyApp.Api.csproj`
to look like this:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

    <PropertyGroup>
        <TargetFramework>net10.0</TargetFramework>
        <RootNamespace>MyApp</RootNamespace>
        <AssemblyName>MyApp.Api</AssemblyName>
        <IsPackable>false</IsPackable>
        <UserSecretsId>ecomapi-local-dev</UserSecretsId>
    </PropertyGroup>

    <ItemGroup>
        <!-- OpenAPI + Scalar -->
        <PackageReference Include="Microsoft.AspNetCore.OpenApi" />
        <PackageReference Include="Scalar.AspNetCore" />

        <!-- EF Core 10 + SQLite -->
        <PackageReference Include="Microsoft.EntityFrameworkCore" />
        <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" />
        <PackageReference Include="Microsoft.EntityFrameworkCore.Design">
            <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
            <PrivateAssets>all</PrivateAssets>
        </PackageReference>

        <!-- Validation -->
        <PackageReference Include="FluentValidation.AspNetCore" />

        <!-- API Versioning -->
        <PackageReference Include="Asp.Versioning.Mvc" />
        <PackageReference Include="Asp.Versioning.Mvc.ApiExplorer" />

        <!-- Carter (module-based endpoint registration) -->
        <PackageReference Include="Carter" />

        <!-- Dynamic Linq for sorting -->
        <PackageReference Include="System.Linq.Dynamic.Core" />
    </ItemGroup>

</Project>
```

Notice that **no `Version` attributes are present** — they are forbidden under CPM.
If you accidentally add one, the build fails with `NU1008`.

If you prefer CLI one-liners instead of editing XML, the equivalent commands are:

```bash
cd src/Services/MyApp.Api

dotnet add package Microsoft.AspNetCore.OpenApi
dotnet add package Scalar.AspNetCore
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package FluentValidation.AspNetCore
dotnet add package Asp.Versioning.Mvc
dotnet add package Asp.Versioning.Mvc.ApiExplorer
dotnet add package Carter
dotnet add package System.Linq.Dynamic.Core
```

The CLI honors CPM and writes versionless `PackageReference` entries for you.

</GuideStep>

<GuideStep title="Create the test project">

A separate test project keeps test-only dependencies (`xunit`, `FluentAssertions`,
`Microsoft.AspNetCore.Mvc.Testing`) out of the production binary.

The repo splits tests into three projects by intent:
`MyApp.Tests.Unit` (pure-logic), `MyApp.Tests.Integration` (HTTP pipeline + DB),
and `MyApp.Tests.Architecture` (NetArchTest boundary rules). For now we create only
the Integration project — the other two are stubs.

```bash
# from MyApp/backend/  (the solution root)
dotnet new xunit -n MyApp.Tests.Integration -o tests/MyApp.Tests.Integration --framework net10.0
dotnet sln MyApp.slnx add tests/MyApp.Tests.Integration/MyApp.Tests.Integration.csproj

# Reference the API project (transitively pulls in BuildingBlocks + Modules)
dotnet add tests/MyApp.Tests.Integration/MyApp.Tests.Integration.csproj \
    reference src/Services/MyApp.Api/MyApp.Api.csproj
```

In <Mark type="box" color="info">`Directory.Packages.props`</Mark>, we already have added packages for the test project:

So you don't have to repeat the package versions in the test project. we can resuse in the `MyApp.Tests.Integration.csproj` file:

```xml title="MyApp/tests/MyApp.Tests.Integration/MyApp.Tests.Integration.csproj" showLineNumbers {8,12-20}
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFramework>net10.0</TargetFramework>
        <ImplicitUsings>enable</ImplicitUsings>
        <Nullable>enable</Nullable>
        <IsPackable>false</IsPackable>
        <IsTestProject>true</IsTestProject>
        <RootNamespace>EcomApi.Tests.Integration</RootNamespace>
        <AssemblyName>EcomApi.Tests.Integration</AssemblyName>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Microsoft.NET.Test.Sdk"/>
        <PackageReference Include="xunit"/>
        <PackageReference Include="xunit.runner.visualstudio"/>
        <PackageReference Include="FluentAssertions"/>
        <PackageReference Include="NSubstitute"/>
        <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing"/>
        <PackageReference Include="Microsoft.EntityFrameworkCore.InMemory"/>
    </ItemGroup>

    <ItemGroup>
        <Using Include="Xunit"/>
    </ItemGroup>

    <ItemGroup>
        <ProjectReference Include="..\..\src\Services\MyApp.Api\MyApp.Api.csproj"/>
    </ItemGroup>
</Project>

```

The `Directory.Build.props` file recognizes test projects automatically through the <Mark type="underline" color="tip">`<IsTestProject>true</IsTestProject>`</Mark> property that `dotnet new xunit` sets, so test projects inherit the same compiler settings as the API project. So you don't have to repeat the package versions in the test project.

</GuideStep>

<GuideStep title="Verify the skeleton builds">

Before writing any feature code, confirm the skeleton compiles. This catches
problems with CPM versions, target frameworks, and project references early.

```bash
dotnet restore
dotnet build
``` 

If you see `NU1008` errors, you have a `Version` attribute somewhere — remove it.
If you see `MSB4019` about missing imports, your `Directory.Build.props` is in the
wrong folder.

</GuideStep>
</Guide>


Now that we have the skeleton setup, we can start building minimal api.
