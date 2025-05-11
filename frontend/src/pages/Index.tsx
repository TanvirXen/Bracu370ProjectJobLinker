import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { AnimatedElement } from "@/components/AnimatedElement";
import { Search, Briefcase, Check, Star, Building, Users } from "lucide-react";

// Mock data for featured companies
const featuredCompanies = [
  { id: 1, name: "Acme Inc", logo: "🏢", jobs: 24 },
  { id: 2, name: "Globex", logo: "🌐", jobs: 18 },
  { id: 3, name: "Initech", logo: "💻", jobs: 32 },
  { id: 4, name: "Umbrella", logo: "☂️", jobs: 12 },
  { id: 5, name: "Stark Industries", logo: "⚡", jobs: 42 },
  { id: 6, name: "Wayne Enterprises", logo: "🦇", jobs: 27 },
];

// Mock data for job stats
const jobStats = [
  { id: 1, value: "5,200+", label: "Jobs Posted", icon: Briefcase },
  { id: 2, value: "10k+", label: "Candidates Matched", icon: Users },
  { id: 3, value: "98%", label: "Client Satisfaction", icon: Star },
  { id: 4, value: "1,200+", label: "Companies", icon: Building },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-sand to-white dark:from-brand-purple dark:to-brand-purple/60 z-[-1]"></div>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <AnimatedElement animation="fade-in">
              <span className="inline-block bg-brand-red/10 text-brand-red font-semibold px-4 py-1 rounded-full mb-4">
                Connecting Talent with Opportunity
              </span>
            </AnimatedElement>

            <AnimatedElement animation="slide-in" delay={200}>
              <h1 className="font-bold mb-6 leading-tight">
                Find Your Dream Job or{" "}
                <span className="text-brand-red">Hire Top Talent</span>
              </h1>
            </AnimatedElement>

            <AnimatedElement animation="slide-in" delay={400}>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                JobLinker empowers professionals to advance their careers and
                helps companies discover perfect talent matches through our
                AI-powered platform.
              </p>
            </AnimatedElement>

            {/* Search Bar */}
            <AnimatedElement animation="slide-in" delay={600}>
              <div className="relative max-w-xl mb-8">
                <div className="flex items-center p-1 pl-4 rounded-full bg-background border shadow-lg">
                  <Search className="h-5 w-5 text-muted-foreground mr-2" />
                  <Input
                    type="text"
                    placeholder="Job title, skill, or company"
                    className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                  />
                  <Button className="rounded-full bg-brand-red hover:bg-brand-red/90">
                    Search Jobs
                  </Button>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-in" delay={800}>
              <div className="flex flex-wrap gap-4">
                <Link to="/jobs">
                  <Button className="btn-primary">Find Jobs</Button>
                </Link>
                <Link to="/employers">
                  <Button className="btn-secondary">Post a Job</Button>
                </Link>
              </div>
            </AnimatedElement>
          </div>

          <div className="w-full lg:w-1/2 lg:pl-12 relative">
            <AnimatedElement animation="scale-in" delay={600}>
              <div className="w-full h-96 sm:h-[450px] rounded-2xl bg-gradient-to-br from-brand-red to-brand-tangerine shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Job Search"
                    className="w-full h-full object-cover rounded-xl absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-red/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="text-white text-2xl font-bold">
                      Ready to take the next step?
                    </div>
                    <p className="text-white/90 mt-2">
                      Thousands of opportunities await.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <h2 className="text-center mb-12">
              Trusted by Professionals & Businesses
            </h2>
          </AnimatedElement>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {jobStats.map((stat, index) => (
              <AnimatedElement
                key={stat.id}
                delay={index * 100}
                animation="scale-in"
              >
                <div className="glass dark:glass-dark p-6 rounded-xl text-center hover-scale">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-brand-red/10 text-brand-red rounded-lg">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="text-center mb-12">
              <h2 className="mb-4">Featured Companies</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Top employers across industries trust JobLinker to find their
                perfect talent match
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredCompanies.map((company, index) => (
              <AnimatedElement
                key={company.id}
                delay={index * 100}
                animation="fade-in"
              >
                <div className="card-neo dark:bg-brand-purple/20 dark:border-brand-purple/20 dark:hover:border-brand-purple/40 p-6 rounded-xl text-center">
                  <div className="text-4xl mb-3">{company.logo}</div>
                  <h3 className="text-lg font-semibold mb-1">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {company.jobs} open positions
                  </p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-brand-sand to-white dark:from-brand-purple/40 dark:to-brand-purple/20">
        <div className="container mx-auto px-4">
          <AnimatedElement>
            <div className="text-center mb-12">
              <h2 className="mb-4">How JobLinker Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered platform makes finding the right job or candidate
                simpler than ever
              </p>
            </div>
          </AnimatedElement>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Create Your Profile",
                description:
                  "Sign up and build your professional profile with skills, experience, and preferences.",
                icon: "👤",
              },
              {
                title: "Get Matched",
                description:
                  "Our AI analyzes your profile to recommend the most suitable job opportunities.",
                icon: "🔄",
              },
              {
                title: "Apply & Connect",
                description:
                  "Apply to jobs with a single click and communicate directly with employers.",
                icon: "✅",
              },
            ].map((step, index) => (
              <AnimatedElement
                key={index}
                delay={index * 200}
                animation="slide-in"
              >
                <div className="glass dark:glass-dark p-8 rounded-xl text-center">
                  <div className="text-5xl mb-6">{step.icon}</div>
                  <h3 className="mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-red">
        <div className="container mx-auto px-4 text-center text-white">
          <AnimatedElement>
            <h2 className="mb-6">Ready to Advance Your Career?</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of professionals who have found their dream job
              through JobLinker. It only takes a few minutes to get started.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link to="/profile/update">
                <Button className="bg-white text-brand-red hover:bg-white/90 text-lg px-8 py-6">
                  Create Your Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                Browse Open Jobs
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-charcoal dark:bg-brand-purple text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 text-xl font-bold mb-4">
                <Briefcase className="h-6 w-6" />
                <span>JobLinker</span>
              </div>
              <p className="text-white/70 mb-4">
                Connecting the right talent with the right opportunities. The
                future of job searching is here.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/jobs" className="text-white/70 hover:text-white">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/career-resources"
                    className="text-white/70 hover:text-white"
                  >
                    Career Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume-builder"
                    className="text-white/70 hover:text-white"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link
                    to="/salary-insights"
                    className="text-white/70 hover:text-white"
                  >
                    Salary Insights
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/post-job"
                    className="text-white/70 hover:text-white"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    to="/talent-search"
                    className="text-white/70 hover:text-white"
                  >
                    Talent Search
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employer-branding"
                    className="text-white/70 hover:text-white"
                  >
                    Employer Branding
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-white/70 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white/70 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-white/70 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-white/70 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
            <p>© {new Date().getFullYear()} JobLinker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
