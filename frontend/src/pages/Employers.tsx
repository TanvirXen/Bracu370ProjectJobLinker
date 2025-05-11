
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AnimatedElement } from '@/components/AnimatedElement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Users, Search, Zap, Award, Rocket, ChevronRight, BarChart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PostJobForm } from '@/components/PostJobForm';

const Employers = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openJobPostingDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-red to-brand-tangerine py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedElement>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Find the perfect talent for your team</h1>
                <p className="text-xl opacity-90 mb-8">
                  Connect with qualified candidates, streamline your hiring process, and build your dream team with JobLinker's powerful recruitment tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-white hover:bg-white/90 text-brand-red h-12 px-6 text-lg"
                    onClick={openJobPostingDialog}
                  >
                    Post a Job
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-6 text-lg">
                    Request Demo
                  </Button>
                </div>
              </AnimatedElement>
              
              {/* Job posting dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Post a New Job</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to create a new job listing. Fields marked with * are required.
                    </DialogDescription>
                  </DialogHeader>
                  <PostJobForm onSuccess={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
              
              <AnimatedElement delay={200}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 lg:p-8">
                  <div className="mb-6">
                    <div className="text-4xl font-bold">5,000+</div>
                    <div className="text-white/80">Companies trust JobLinker</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-3xl font-bold">93%</div>
                      <div className="text-white/80 text-sm">Hiring success rate</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-3xl font-bold">14 days</div>
                      <div className="text-white/80 text-sm">Average time-to-hire</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-3xl font-bold">75%</div>
                      <div className="text-white/80 text-sm">Cost reduction</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-3xl font-bold">1M+</div>
                      <div className="text-white/80 text-sm">Active candidates</div>
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </section>
        
        {/* Key Features */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedElement>
              <h2 className="text-3xl font-bold text-center mb-12">Powerful tools to transform your hiring</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Smart Candidate Matching',
                    description: 'Our AI algorithms match your job to the most qualified candidates, saving you time and resources.',
                    icon: <Search className="h-10 w-10 text-brand-red" />
                  },
                  {
                    title: 'Streamlined Recruitment',
                    description: 'Manage your entire hiring pipeline in one place with our intuitive ATS and collaboration tools.',
                    icon: <Zap className="h-10 w-10 text-brand-red" />
                  },
                  {
                    title: 'Employer Branding',
                    description: 'Showcase your company culture and benefits to attract top talent to your organization.',
                    icon: <Award className="h-10 w-10 text-brand-red" />
                  },
                ].map((feature, index) => (
                  <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="mb-4">{feature.icon}</div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimatedElement>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <AnimatedElement>
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              
              <div className="max-w-4xl mx-auto">
                {[
                  {
                    step: 1,
                    title: 'Create your employer account',
                    description: 'Set up your company profile with key information about your organization and culture.'
                  },
                  {
                    step: 2,
                    title: 'Post your job openings',
                    description: 'Create detailed job listings that highlight the role, requirements, and benefits.'
                  },
                  {
                    step: 3,
                    title: 'Review matched candidates',
                    description: 'Our AI algorithm will match your job with qualified candidates from our talent pool.'
                  },
                  {
                    step: 4,
                    title: 'Interview and hire',
                    description: 'Schedule interviews, collaborate with your team, and make offers—all within the platform.'
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start mb-8">
                    <div className="w-14 h-14 flex-shrink-0 rounded-full bg-gradient-to-r from-brand-red to-brand-tangerine text-white flex items-center justify-center text-xl font-bold mr-6">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedElement>
          </div>
        </section>
        
        {/* Dummy Testimonials */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedElement>
              <h2 className="text-3xl font-bold text-center mb-12">What employers say about us</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "JobLinker has revolutionized our hiring process. We've reduced our time-to-hire by 40% and found exceptional talent.",
                    author: "Sarah Johnson",
                    position: "HR Director, TechCorp Inc."
                  },
                  {
                    quote: "The quality of candidates we get through JobLinker is consistently high. The matching algorithm really works!",
                    author: "Michael Chen",
                    position: "CTO, Innovate Solutions"
                  },
                  {
                    quote: "We've tried several recruitment platforms, but JobLinker offers the best balance of quality, efficiency, and cost.",
                    author: "Emma Rodriguez",
                    position: "Talent Acquisition Manager, Growth Ventures"
                  }
                ].map((testimonial, index) => (
                  <Card key={index} className="bg-gradient-to-b from-card to-muted/50 border-none">
                    <CardContent className="pt-6">
                      <div className="text-4xl text-brand-red mb-4">"</div>
                      <p className="mb-6 italic">{testimonial.quote}</p>
                      <div>
                        <div className="font-medium">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimatedElement>
          </div>
        </section>
        
        
        
        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-brand-red to-brand-tangerine text-white">
          <div className="container mx-auto px-4 text-center">
            <AnimatedElement>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your hiring process?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Join thousands of companies that trust JobLinker to find their ideal candidates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-white hover:bg-white/90 text-brand-red h-12 px-8 text-lg"
                  onClick={openJobPostingDialog}
                >
                  Post a Job
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8 text-lg">
                  Schedule Demo
                </Button>
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

export default Employers;
