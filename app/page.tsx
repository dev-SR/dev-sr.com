import LetterGlitchLeftSide from '@/components/showcase/LetterGlitchLeftSide';
import LetterGlitchRightSide from '@/components/showcase/LetterGlitchRightSide';
import Header from '@/components/Header';
import ParallaxWaves from '@/components/showcase/ParallaxWaveBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, BookOpen, User } from 'lucide-react';
import Link from 'next/link';

export default function App() {
  return (
    // changed: remove overflow-hidden (it breaks position:sticky). Keep background token.
    <div className="bg-background">
      <Header />
      <ParallaxWaves />
      <div className={'grid grid-cols-12 w-full min-h-screen'}>
        <LetterGlitchLeftSide />
        {/* moved: pull this central column up into the ParallaxWaves visual area */}
        <div className={'col-span-8 w-full min-h-svh relative -mt-[60vh] z-30'}>
          {/* Hero Section */}
          <section className=" py-20 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
                Welcome to My
                <span className="text-accent block">Digital Space</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                A modern portfolio and blog showcasing advanced web development, mathematical
                concepts, and technical insights through interactive content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group">
                  <Link href="/portfolio">
                    View Portfolio
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog">Read Blog</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 bg-card/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                What You&apos;ll Find Here
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <Code className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Advanced Development</CardTitle>
                    <CardDescription>
                      Modern web development techniques, frameworks, and best practices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Explore cutting-edge technologies and development patterns through interactive
                      code examples and detailed explanations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Technical Writing</CardTitle>
                    <CardDescription>
                      In-depth articles with LaTeX math rendering and syntax highlighting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Mathematical concepts, algorithms, and technical topics explained with
                      beautiful typography and interactive elements.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <User className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Personal Projects</CardTitle>
                    <CardDescription>
                      A curated collection of projects and experiments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      From web applications to data visualizations, discover the projects that
                      showcase creativity and technical expertise.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
        {/* end changed code */}
        <LetterGlitchRightSide />
      </div>
    </div>
  );
}
