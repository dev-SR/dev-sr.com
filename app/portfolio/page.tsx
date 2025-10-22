import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPosts } from '@/lib/mdx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Github,
  ExternalLink,
  Mail,
  MapPin,
  Calendar,
  Code,
  Database,
  Globe,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';

// Mock data - in a real app this would come from a CMS or database
const projects = [
  {
    id: 1,
    title: 'Advanced MDX Blog Platform',
    description:
      'A modern blog platform with advanced MDX features, syntax highlighting, and interactive components.',
    image: '/placeholder.svg?height=300&width=500',
    technologies: ['Next.js', 'TypeScript', 'MDX', 'Tailwind CSS'],
    githubUrl: 'https://github.com/example/mdx-blog',
    liveUrl: 'https://blog-demo.example.com',
    featured: true,
  },
  {
    id: 2,
    title: 'E-commerce Dashboard',
    description:
      'A comprehensive dashboard for managing e-commerce operations with real-time analytics.',
    image: '/placeholder.svg?height=300&width=500',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Chart.js'],
    githubUrl: 'https://github.com/example/ecommerce-dashboard',
    liveUrl: 'https://dashboard-demo.example.com',
    featured: true,
  },
  {
    id: 3,
    title: 'AI-Powered Code Assistant',
    description: 'An intelligent code completion and suggestion tool powered by machine learning.',
    image: '/placeholder.svg?height=300&width=500',
    technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    githubUrl: 'https://github.com/example/ai-code-assistant',
    featured: false,
  },
  {
    id: 4,
    title: 'Real-time Chat Application',
    description:
      'A scalable chat application with real-time messaging and file sharing capabilities.',
    image: '/placeholder.svg?height=300&width=500',
    technologies: ['Socket.io', 'Express', 'MongoDB', 'Vue.js'],
    githubUrl: 'https://github.com/example/realtime-chat',
    liveUrl: 'https://chat-demo.example.com',
    featured: false,
  },
  {
    id: 5,
    title: 'Mobile Fitness Tracker',
    description: 'A cross-platform mobile app for tracking workouts and health metrics.',
    image: '/placeholder.svg?height=300&width=500',
    technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
    githubUrl: 'https://github.com/example/fitness-tracker',
    featured: false,
  },
  {
    id: 6,
    title: 'Data Visualization Platform',
    description:
      'An interactive platform for creating and sharing data visualizations and reports.',
    image: '/placeholder.svg?height=300&width=500',
    technologies: ['D3.js', 'Python', 'Flask', 'PostgreSQL'],
    githubUrl: 'https://github.com/example/data-viz-platform',
    liveUrl: 'https://dataviz-demo.example.com',
    featured: false,
  },
];

const skills = [
  {
    category: 'Frontend',
    icon: <Globe className="h-5 w-5" />,
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Svelte'],
  },
  {
    category: 'Backend',
    icon: <Database className="h-5 w-5" />,
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL'],
  },
  {
    category: 'Mobile',
    icon: <Smartphone className="h-5 w-5" />,
    technologies: ['React Native', 'Flutter', 'iOS', 'Android', 'Expo'],
  },
  {
    category: 'Tools & DevOps',
    icon: <Code className="h-5 w-5" />,
    technologies: ['Docker', 'AWS', 'Vercel', 'Git', 'CI/CD', 'Kubernetes'],
  },
];

export default async function PortfolioPage() {
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <div className="bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/placeholder.svg?height=150&width=150"
              alt="Profile"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-6 border-4 border-accent/20"
            />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Hi, I&apos;m <span className="text-accent">Alex Johnson</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              Full-stack developer passionate about creating exceptional digital experiences through
              clean code, innovative solutions, and cutting-edge technologies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg">
              <Link href="#contact">Get In Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="#projects">View Projects</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              San Francisco, CA
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              5+ years experience
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Available for work
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Skills & Technologies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive toolkit built through years of experience in modern web development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <Card key={skill.category} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-accent/10 rounded-lg text-accent">{skill.icon}</div>
                    <CardTitle className="text-lg">{skill.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my most impactful work showcasing different aspects of modern
              development
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || '/placeholder.svg'}
                    alt={project.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="group-hover:text-accent transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{project.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button asChild variant="outline" size="sm" className="bg-transparent">
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Link>
                    </Button>
                    {project.liveUrl && (
                      <Button asChild size="sm">
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Other Projects Grid */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">More Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || '/placeholder.svg'}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base group-hover:text-accent transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </Link>
                      </Button>
                      {project.liveUrl && (
                        <Button asChild size="sm" className="flex-1">
                          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Demo
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Let&apos;s Work Together</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind or want to discuss opportunities? I&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Get in touch</h3>
                <p className="text-muted-foreground mb-6">
                  I&apos;m always interested in new opportunities and exciting projects. Whether you have
                  a question or just want to say hi, feel free to reach out!
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <span className="text-foreground">alex.johnson@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="text-foreground">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-accent" />
                  <Link
                    href="https://github.com/alexjohnson"
                    className="text-foreground hover:text-accent transition-colors">
                    github.com/alexjohnson
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I&apos;ll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-foreground mb-2 block">
                        First Name
                      </label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-foreground mb-2 block">
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground mb-2 block">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground mb-2 block">
                      Subject
                    </label>
                    <Input id="subject" placeholder="Project inquiry" />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground mb-2 block">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Tell me about your project..." rows={4} />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
