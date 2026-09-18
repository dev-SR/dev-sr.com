import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Briefcase,
  Code,
  Database,
  GraduationCap,
  Mail,
  MapPin,
  BrainCircuit,
  Server,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { JsonLd } from '@/components/seo/json-ld';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import {
  certifications,
  education,
  experience,
  profile,
  projects,
  publications,
  skillGroups,
} from '@/lib/profile';
import { constructMetadata, getProfilePageSchema } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Portfolio & Systems',
  description:
    'Experience, skills, publications, and GitHub-linked projects from Sharukh Rahman — applied ML, RAG systems, and production .NET backends.',
  path: '/portfolio',
  type: 'profile',
});

const skillIcons = {
  Programming: Code,
  'ML / Data': BrainCircuit,
  'Web / Backend': Database,
  'MLOps / DevOps': Server,
} as const;

export default async function PortfolioPage() {
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <div className="bg-background">
      <JsonLd data={getProfilePageSchema()} />
      <Header />

      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-accent">
              {profile.roleLine}
            </p>
            <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
              Hi, I&apos;m <span className="text-accent">{profile.name}</span>
            </h1>
            <p className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {profile.headline}
            </p>
            <p className="mx-auto mb-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
          </div>

          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#contact">Get In Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="#projects">View Projects</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              MSc Data Science, Óbuda
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {profile.availability}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Skills & Technologies</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Stack drawn from production .NET work, applied ML projects, and current Data Science
              coursework.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((skill) => {
              const Icon = skillIcons[skill.category];
              return (
                <Card key={skill.category} className="group transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="rounded-lg bg-accent/10 p-2 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
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
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Experience</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Enterprise product modules across ERP, trade, and hospital systems.
            </p>
          </div>

          <div className="space-y-6">
            {experience.map((job) => (
              <Card key={job.company}>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-accent/10 p-2 text-accent">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="mt-1 text-base text-foreground/80">
                          {job.company} · {job.place}
                        </CardDescription>
                        <p className="mt-1 text-sm text-muted-foreground">{job.note}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit shrink-0">
                      {job.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {education.map((item) => (
              <Card key={item.institution}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-accent/10 p-2 text-accent">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.degree}</CardTitle>
                      <CardDescription className="mt-1">
                        {item.institution} · {item.place}
                      </CardDescription>
                      <p className="mt-2 text-sm text-muted-foreground">{item.period}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="bg-card/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Featured Projects</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Applied ML and full-stack systems with public source on GitHub.
            </p>
          </div>

          <div className="mb-16 grid gap-8 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="group transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="transition-colors group-hover:text-accent">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="mt-2 leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="bg-transparent">
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <FaGithub className="mr-2 h-4 w-4" />
                      Code
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {otherProjects.length > 0 && (
            <div>
              <h3 className="mb-8 text-center text-2xl font-bold text-foreground">More Projects</h3>
              <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-1">
                {otherProjects.map((project) => (
                  <Card key={project.id} className="group transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base transition-colors group-hover:text-accent">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3 flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild variant="outline" size="sm" className="bg-transparent">
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <FaGithub className="mr-1 h-3 w-3" />
                          Code
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {publications.map((pub) => (
                  <div key={pub.href}>
                    <Link
                      href={pub.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-foreground hover:text-accent">
                      {pub.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{pub.venue}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.href}>
                    <Link
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-foreground hover:text-accent">
                      {cert.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{cert.issuer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Let&apos;s Work Together</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Interested in ML, data science, or software engineering collaboration? Reach out.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">Get in touch</h3>
                <p className="mb-6 text-muted-foreground">
                  Prefer email or LinkedIn for role and project conversations. GitHub has the
                  public source for the work above.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <Link
                    href={`mailto:${profile.email}`}
                    className="text-foreground transition-colors hover:text-accent">
                    {profile.email}
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="text-foreground">{profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaGithub className="h-5 w-5 text-accent" />
                  <Link
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground transition-colors hover:text-accent">
                    {profile.githubLabel}
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <FaLinkedin className="h-5 w-5 text-accent" />
                  <Link
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground transition-colors hover:text-accent">
                    {profile.linkedinLabel}
                  </Link>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Form UI only for now — email is the reliable path.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  action={`mailto:${profile.email}`}
                  method="get"
                  encType="text/plain">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-sm font-medium text-foreground">
                        First Name
                      </label>
                      <Input id="firstName" name="firstName" placeholder="Alex" />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-sm font-medium text-foreground">
                        Last Name
                      </label>
                      <Input id="lastName" name="lastName" placeholder="Lee" />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-foreground">
                      Subject
                    </label>
                    <Input id="subject" name="subject" placeholder="Role or project inquiry" />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-foreground">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="body"
                      placeholder="Tell me about the role or project..."
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Open Email Draft
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
