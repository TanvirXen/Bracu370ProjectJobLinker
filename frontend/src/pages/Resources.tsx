
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { AnimatedElement } from '@/components/AnimatedElement';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, FileText, Video, Lightbulb, Download, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

const resourceCategories = [
  {
    title: 'Resume Building',
    icon: <FileText className="h-6 w-6 text-brand-red" />,
    resources: [
      { title: 'Resume Templates for Tech Jobs', type: 'Template', link: '#' },
      { title: 'How to Highlight Your Technical Skills', type: 'Guide', link: '#' },
      { title: 'Resume Do\'s and Don\'ts', type: 'Checklist', link: '#' },
    ]
  },
  {
    title: 'Interview Preparation',
    icon: <Lightbulb className="h-6 w-6 text-brand-red" />,
    resources: [
      { title: 'Common Technical Interview Questions', type: 'Guide', link: '#' },
      { title: 'Interview Mock Practice Videos', type: 'Video', link: '#' },
      { title: 'Behavioral Interview Techniques', type: 'Tutorial', link: '#' },
    ]
  },
  {
    title: 'Career Development',
    icon: <Book className="h-6 w-6 text-brand-red" />,
    resources: [
      { title: 'Career Path Guide for Developers', type: 'E-Book', link: '#' },
      { title: 'Negotiating Your Tech Salary', type: 'Webinar', link: '#' },
      { title: 'Upskilling for Career Growth', type: 'Course', link: '#' },
    ]
  },
  {
    title: 'Job Search Strategies',
    icon: <Download className="h-6 w-6 text-brand-red" />,
    resources: [
      { title: 'Effective Job Search Methods', type: 'Guide', link: '#' },
      { title: 'Utilizing LinkedIn for Job Search', type: 'Tutorial', link: '#' },
      { title: 'Networking in the Tech Industry', type: 'Webinar', link: '#' },
    ]
  }
];

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-red to-brand-tangerine py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <AnimatedElement>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Resources</h1>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                Access our collection of guides, templates, and tools to help you advance your career
              </p>
            </AnimatedElement>
          </div>
        </section>
        
        {/* Resource Categories */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedElement>
              <h2 className="text-3xl font-bold text-center mb-12">Browse Resources by Category</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {resourceCategories.map((category, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        {category.icon}
                        <CardTitle>{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.resources.map((resource, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <span className="font-medium">{resource.title}</span>
                            <span className="text-xs px-2 py-1 bg-muted rounded-full">{resource.type}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full hover:text-brand-red">
                        View All Resources
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </AnimatedElement>
          </div>
        </section>
        
        {/* Featured Resource */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <AnimatedElement>
              <div className="bg-card shadow-lg rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="inline-block px-4 py-1 bg-brand-red/10 text-brand-red rounded-full text-sm font-medium mb-4">
                      Featured Resource
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Ultimate Job Search Playbook</h3>
                    <p className="text-muted-foreground mb-6">
                      A comprehensive guide to navigating your job search from start to finish. Learn how to build your personal brand, optimize your resume, nail interviews, and negotiate your ideal offer.
                    </p>
                    <div className="flex space-x-4">
                      <Button className="bg-brand-red hover:bg-brand-red/90">
                        Download Free
                      </Button>
                      <Button variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-brand-red to-brand-tangerine p-12 hidden lg:flex items-center justify-center">
                    <Book className="h-32 w-32 text-white/90" />
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </section>
      </main>
      
      <footer className="bg-brand-charcoal dark:bg-brand-purple text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70">© {new Date().getFullYear()} JobLinker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Resources;
