import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { AnimatedElement } from '@/components/AnimatedElement';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, DollarSign, Clock, Briefcase, Building, Users, Calendar, Globe, ChevronLeft, Star, Check, X } from 'lucide-react';

// Mock job data (in a real app, this would come from an API)
const mockJob = {
  id: 3,
  title: 'Senior Frontend Developer',
  company: 'TechCorp Inc.',
  about: 'TechCorp is a leading technology company specializing in software solutions for enterprise clients. With over 10 years in the industry, we have built a reputation for innovative products and excellent service.',
  location: 'San Francisco, CA',
  type: 'Full-time',
  salary: '$120,000 - $150,000',
  posted: '2 days ago',
  description: `
    <p>We're looking for an experienced Frontend Developer to join our growing team. In this role, you'll work closely with designers, product managers, and backend engineers to build responsive and intuitive user interfaces for our enterprise clients.</p>
    
    <p>As a Senior Frontend Developer, you'll tackle complex problems, mentor junior developers, and contribute to the architecture and technical direction of our frontend applications.</p>
    
    <h4>Responsibilities:</h4>
    <ul>
      <li>Develop high-quality, responsive user interfaces using React, TypeScript, and modern frontend technologies</li>
      <li>Collaborate with UX/UI designers to implement visually appealing and user-friendly designs</li>
      <li>Write clean, maintainable, and well-tested code</li>
      <li>Optimize applications for maximum speed and scalability</li>
      <li>Participate in code reviews and provide constructive feedback to team members</li>
      <li>Stay up-to-date with emerging trends and best practices in frontend development</li>
    </ul>`,
  requirements: [
    "Bachelor's degree in Computer Science or related field (or equivalent experience)",
    "5+ years of experience in frontend development",
    "Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model",
    "Experience with React.js and its core principles",
    "Experience with popular React workflows (Redux, Hooks, etc)",
    "Familiarity with newer specifications of ECMAScript",
    "Experience with data structure libraries (e.g., Immutable.js)",
    "Knowledge of isomorphic React is a plus",
    "Understanding of REST APIs and asynchronous request handling",
  ],
  benefits: [
    "Competitive salary with annual bonuses",
    "Comprehensive health, dental, and vision insurance",
    "Flexible work arrangements, including remote options",
    "401(k) with company match",
    "Generous PTO policy and paid holidays",
    "Professional development budget",
    "Modern office with catered lunches and snacks",
  ],
  skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux', 'REST APIs', 'Git'],
  logo: '🌐',
  employees: '500-1000',
  founded: '2010',
  website: 'https://techcorp-example.com',
  matchPercentage: 87,
  similarJobs: [
    {
      id: 7,
      title: 'Frontend Developer',
      company: 'WebSolutions Ltd.',
      location: 'Remote',
      salary: '$100,000 - $125,000',
      logo: '💻',
    },
    {
      id: 12,
      title: 'Full Stack Engineer',
      company: 'InnovateTech',
      location: 'Austin, TX',
      salary: '$115,000 - $140,000',
      logo: '🚀',
    },
    {
      id: 18,
      title: 'React Developer',
      company: 'AppWorks',
      location: 'Seattle, WA',
      salary: '$110,000 - $135,000',
      logo: '📱',
    },
  ],
  companyReviews: [
    {
      id: 1,
      author: 'Former Employee',
      position: 'Software Engineer',
      rating: 4.5,
      pros: 'Great work-life balance, competitive pay, excellent benefits',
      cons: 'Large company bureaucracy can slow down decision making',
      date: '3 months ago',
    },
    {
      id: 2,
      author: 'Current Employee',
      position: 'Product Manager',
      rating: 4.0,
      pros: 'Innovative projects, talented colleagues, opportunities for growth',
      cons: 'Sometimes tight deadlines can lead to pressure',
      date: '6 months ago',
    },
  ],
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('description');
  
  // In a real app, we would fetch job details based on the ID
  const job = mockJob;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Link to="/jobs" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Jobs</span>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main job details section */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedElement>
                <div className="bg-card dark:bg-card shadow-md rounded-xl overflow-hidden">
                  {/* Job header */}
                  <div className="bg-gradient-to-r from-brand-red to-brand-tangerine p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex items-center justify-center bg-white text-4xl rounded-lg shadow-lg mr-4">
                          {job.logo}
                        </div>
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold mb-1">{job.title}</h1>
                          <div className="text-white/90">{job.company}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-medium">
                          Match: {job.matchPercentage}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center text-sm mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-white/80">Location</span>
                        </div>
                        <div className="font-medium">{job.location}</div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center text-sm mb-1">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="text-white/80">Salary</span>
                        </div>
                        <div className="font-medium">{job.salary}</div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center text-sm mb-1">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span className="text-white/80">Job Type</span>
                        </div>
                        <div className="font-medium">{job.type}</div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center text-sm mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-white/80">Posted</span>
                        </div>
                        <div className="font-medium">{job.posted}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tab navigation */}
                  <div className="border-b">
                    <div className="flex overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('description')}
                        className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'description'
                            ? 'border-b-2 border-brand-red text-brand-red'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Job Description
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('company')}
                        className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'company'
                            ? 'border-b-2 border-brand-red text-brand-red'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Company
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'reviews'
                            ? 'border-b-2 border-brand-red text-brand-red'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Reviews
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab content */}
                  <div className="p-6">
                    {activeTab === 'description' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                          <ul className="space-y-3">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Benefits</h3>
                          <ul className="space-y-3">
                            {job.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Required Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="px-3 py-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'company' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">About {job.company}</h3>
                          <p className="text-muted-foreground mb-6">{job.about}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                              <Users className="h-5 w-5 text-muted-foreground mr-2" />
                              <div>
                                <div className="text-sm text-muted-foreground">Employees</div>
                                <div className="font-medium">{job.employees}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                              <div>
                                <div className="text-sm text-muted-foreground">Founded</div>
                                <div className="font-medium">{job.founded}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Globe className="h-5 w-5 text-muted-foreground mr-2" />
                              <div>
                                <div className="text-sm text-muted-foreground">Website</div>
                                <a href={job.website} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-red hover:underline">
                                  Visit
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold">Employee Reviews</h3>
                          <Button variant="outline" size="sm">
                            Write a Review
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {job.companyReviews.map((review) => (
                            <div key={review.id} className="bg-muted/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">{review.author} • {review.position}</div>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="ml-1 font-medium">{review.rating}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div className="bg-green-500/10 rounded-md p-3">
                                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Pros</div>
                                  <div className="text-sm">{review.pros}</div>
                                </div>
                                
                                <div className="bg-red-500/10 rounded-md p-3">
                                  <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Cons</div>
                                  <div className="text-sm">{review.cons}</div>
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                Posted {review.date}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedElement>
              
              {/* Similar jobs section */}
              <AnimatedElement delay={200}>
                <div className="bg-card dark:bg-card shadow-md rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Similar Jobs</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {job.similarJobs.map((similarJob) => (
                      <Link 
                        key={similarJob.id} 
                        to={`/job/${similarJob.id}`}
                        className="block hover:shadow-md transition-shadow rounded-lg border p-4 hover:border-brand-red/20"
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md text-xl mr-3">
                            {similarJob.logo}
                          </div>
                          <div className="truncate">
                            <div className="font-medium truncate">{similarJob.title}</div>
                            <div className="text-sm text-muted-foreground truncate">{similarJob.company}</div>
                          </div>
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate">{similarJob.location}</span>
                          </div>
                          
                          <div className="flex items-center text-muted-foreground">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span className="truncate">{similarJob.salary}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedElement>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <AnimatedElement delay={100}>
                <div className="sticky top-24 space-y-6">
                  {/* Apply button */}
                  <div className="bg-card dark:bg-card shadow-md rounded-xl p-6 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-medium h-12 text-lg mb-4">
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Apply for {job.title}</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 text-center">
                          <p className="mb-4">In a full application, this would connect to your profile and resume.</p>
                          <p className="mb-6 text-muted-foreground">This is just a demo, so we're showing this dialog instead.</p>
                          <Button className="bg-brand-red hover:bg-brand-red/90">Continue Application</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" className="w-full">
                      Save Job
                    </Button>
                  </div>
                  
                  {/* Job match */}
                  <div className="bg-card dark:bg-card shadow-md rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Job Match</h3>
                    
                    <div className="mb-4 flex items-center justify-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted/30 stroke-current"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-brand-red stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - job.matchPercentage / 100)}`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute text-2xl font-bold">
                          {job.matchPercentage}%
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-center text-sm mb-4">
                      Based on your skills and experience, you're a strong match for this position.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">React</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                          Strong Match
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">TypeScript</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                          Strong Match
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Redux</span>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                          Partial Match
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">REST APIs</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                          Strong Match
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-brand-charcoal dark:bg-brand-purple text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70">© {new Date().getFullYear()} JobLinker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default JobDetail;
