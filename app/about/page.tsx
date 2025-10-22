import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPosts } from '@/lib/mdx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Briefcase, GraduationCap, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const experience = [
  {
    company: 'TechCorp Inc.',
    position: 'Senior Full Stack Developer',
    period: '2022 - Present',
    description:
      'Leading development of scalable web applications and mentoring junior developers.',
    achievements: [
      'Increased app performance by 40%',
      'Led team of 5 developers',
      'Implemented CI/CD pipeline',
    ],
  },
  {
    company: 'StartupXYZ',
    position: 'Frontend Developer',
    period: '2020 - 2022',
    description: 'Built responsive web applications using React and modern JavaScript frameworks.',
    achievements: [
      'Delivered 15+ projects',
      'Improved user engagement by 60%',
      'Established design system',
    ],
  },
  {
    company: 'Digital Agency',
    position: 'Web Developer',
    period: '2019 - 2020',
    description: 'Developed custom websites and web applications for various clients.',
    achievements: [
      'Completed 30+ client projects',
      'Maintained 99% client satisfaction',
      'Reduced load times by 50%',
    ],
  },
];

const education = [
  {
    institution: 'University of California, Berkeley',
    degree: 'Bachelor of Science in Computer Science',
    period: '2015 - 2019',
    description: 'Focused on software engineering, algorithms, and data structures.',
  },
  {
    institution: 'FreeCodeCamp',
    degree: 'Full Stack Web Development Certification',
    period: '2018',
    description: 'Comprehensive program covering modern web development technologies.',
  },
];

const interests = [
  'Open Source Contributions',
  'Machine Learning',
  'Photography',
  'Rock Climbing',
  'Travel',
  'Cooking',
];

export default async function AboutPage() {
  const posts = await getAllPosts();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="About me"
                width={300}
                height={400}
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-foreground mb-6">About Me</h1>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  I'm a passionate full-stack developer with over 5 years of experience creating
                  digital solutions that make a difference. My journey in tech started with a
                  curiosity about how things work and evolved into a career dedicated to building
                  exceptional user experiences.
                </p>
                <p>
                  I specialize in modern web technologies including React, Next.js, Node.js, and
                  TypeScript. I believe in writing clean, maintainable code and following best
                  practices to deliver robust applications that scale.
                </p>
                <p>
                  When I'm not coding, you'll find me contributing to open source projects,
                  exploring new technologies, or enjoying the great outdoors. I'm always eager to
                  learn and take on new challenges that push the boundaries of what's possible.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/resume.pdf" target="_blank">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Professional Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A timeline of my professional journey and key achievements
            </p>
          </div>

          <div className="space-y-8">
            {experience.map((job, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-accent" />
                        {job.position}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-foreground mt-1">
                        {job.company}
                      </CardDescription>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {job.period}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Key Achievements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {job.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Education</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Academic background and continuous learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    {edu.degree}
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-foreground">
                    {edu.institution}
                  </CardDescription>
                  <Badge variant="outline" className="w-fit text-xs">
                    {edu.period}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{edu.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Beyond Code</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            When I'm not building applications, I enjoy exploring various interests that keep me
            inspired and balanced.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {interests.map((interest) => (
              <Badge
                key={interest}
                variant="outline"
                className="text-sm py-2 px-4 hover:bg-accent/10 transition-colors">
                <Heart className="h-3 w-3 mr-2" />
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
