
import React, { useState ,useEffect} from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimatedElement } from '@/components/AnimatedElement';
import { Search, MapPin, DollarSign, Briefcase, Clock, X, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for job listings
const mockJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    posted: '2 days ago',
    description: 'We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern web technologies.',
    skills: ['React', 'TypeScript', 'CSS', 'UI/UX'],
    logo: '🌐',
    featured: true,
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'Remote',
    type: 'Full-time',
    salary: '$110,000 - $130,000',
    posted: '3 days ago',
    description: 'Lead product strategy and roadmap for our SaaS platform, working closely with engineering and design teams.',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics'],
    logo: '📱',
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    company: 'CloudSys Solutions',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$115,000 - $140,000',
    posted: '1 day ago',
    description: 'Build and maintain CI/CD pipelines, manage cloud infrastructure, and optimize system performance.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    logo: '☁️',
    featured: true,
  },
  {
    id: 4,
    title: 'UX/UI Designer',
    company: 'DesignWave',
    location: 'New York, NY',
    type: 'Contract',
    salary: '$80 - $100 /hour',
    posted: '5 days ago',
    description: 'Create intuitive and visually appealing user interfaces for web and mobile applications.',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
    logo: '🎨',
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'DataViz Analytics',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$125,000 - $160,000',
    posted: '1 week ago',
    description: 'Analyze large datasets, build predictive models, and communicate insights to stakeholders.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    logo: '📊',
  },
  {
    id: 6,
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Remote',
    type: 'Part-time',
    salary: '$70 - $90 /hour',
    posted: '3 days ago',
    description: 'Develop and maintain web applications, working on both frontend and backend technologies.',
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
    logo: '💻',
  },
  {
    id: 7,
    title: 'Marketing Manager',
    company: 'GrowthHackers',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    salary: '$90,000 - $110,000',
    posted: '4 days ago',
    description: 'Lead marketing initiatives across digital channels to drive user acquisition and engagement.',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
    logo: '📢',
  },
  {
    id: 8,
    title: 'Backend Engineer',
    company: 'ServerLogic',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$130,000 - $155,000',
    posted: '2 days ago',
    description: 'Design and build scalable APIs and microservices, optimize database performance.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices'],
    logo: '⚙️',
  },
];
const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className={`bg-card dark:bg-card rounded-xl overflow-hidden transition-all hover:shadow-lg border-2`}>
      <div className="p-6">
        <div className="flex">
          <div className="flex-grow">
            <Link to={`/job/${job.id}`}>
              <h3 className="text-xl font-semibold mb-1 hover:text-brand-red transition-colors">
                {job.title}
              </h3>
            </Link>
            
            <div className="flex flex-wrap gap-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center mr-4">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{job.company}</span>
              </div>
              
              <div className="flex items-center mr-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              
              <div className="flex items-center mr-4">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{job.salary}</span>
              </div>
              
              <div className="flex items-center mr-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{job.posted_at}</span>
              </div>
            </div>
            
  <p className="text-sm mb-4 line-clamp-3 w-3/5">{job.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-muted px-3 py-1 rounded-full"
                >
                  {skill?.name}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              
              <Link to={`/job/${job.id}`}>
                <Button variant="outline" className="text-sm h-9">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Jobs = () => {
      const [applications, setapplications] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: {
      fullTime: false,
      partTime: false,
      contract: false,
      remote: false,
    },
    salaryRange: [50000, 150000],
    experienceLevel: {
      entry: false,
      mid: false,
      senior: false,
      executive: false,
    },
  });
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const formatSalary = (salary: number) => {
    return `$${salary.toLocaleString()}`;
  };
  
  const handleFilterChange = (category: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  
  const handleJobTypeChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      jobType: {
        ...prev.jobType,
        [type]: !prev.jobType[type as keyof typeof prev.jobType],
      },
    }));
  };
  
  const handleExperienceChange = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      experienceLevel: {
        ...prev.experienceLevel,
        [level]: !prev.experienceLevel[level as keyof typeof prev.experienceLevel],
      },
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: {
        fullTime: false,
        partTime: false,
        contract: false,
        remote: false,
      },
      salaryRange: [50000, 150000],
      experienceLevel: {
        entry: false,
        mid: false,
        senior: false,
        executive: false,
      },
    });
  };
     const fetchApplications = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/jobs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setapplications(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {

      }
    };
      useEffect(() => {

        fetchApplications();
      }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="pt-20 flex-grow">
        {/* Search Bar Section */}
        <section className="bg-gradient-to-r from-brand-red to-brand-tangerine py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
                Find Your Perfect Job Match
              </h1>
              
              {/* <div className="bg-white dark:bg-brand-purple/40 shadow-xl rounded-xl p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                      type="text" 
                      placeholder="Job title, keywords, or company" 
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10 bg-transparent"
                    />
                  </div>
                  
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                      type="text" 
                      placeholder="Location or remote" 
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="pl-10 bg-transparent"
                    />
                  </div>
                  
                  <Button className="bg-brand-red hover:bg-brand-red/90">
                    Search Jobs
                  </Button>
                </div>
              </div> */}
            </div>
          </div>
        </section>
        
        {/* Job Listings Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* <div className="hidden lg:block w-80 shrink-0">
                <FilterSidebar 
                  filters={filters} 
                  handleFilterChange={handleFilterChange}
                  handleJobTypeChange={handleJobTypeChange}
                  handleExperienceChange={handleExperienceChange}
                  formatSalary={formatSalary}
                  resetFilters={resetFilters}
                />
              </div> */}

              {/* <div className="lg:hidden mb-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </div> */}
              
              {/* Mobile Filter Sidebar */}
              {/* {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                  <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-lg animate-slide-in">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h2 className="font-semibold">Filters</h2>
                      <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                      <FilterSidebar 
                        filters={filters} 
                        handleFilterChange={handleFilterChange}
                        handleJobTypeChange={handleJobTypeChange}
                        handleExperienceChange={handleExperienceChange}
                        formatSalary={formatSalary}
                        resetFilters={resetFilters}
                      />
                    </div>
                  </div>
                </div>
              )} */}
              
              {/* Job Listings */}
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Available Jobs</h2>
                  
                  {/* <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <select className="p-2 rounded-md border bg-transparent text-sm">
                      <option>Most Relevant</option>
                      <option>Newest</option>
                      <option>Highest Salary</option>
                    </select>
                  </div> */}
                </div>
                
                <div className="space-y-6">
                  {applications?.jobs?.map((job, index) => (
                    <AnimatedElement key={job.id} delay={index * 100}>
                      <JobCard job={job} />
                    </AnimatedElement>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-10 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" disabled>
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button variant="outline" className="h-9 w-9 p-0">1</Button>
                    <Button variant="ghost" className="h-9 w-9 p-0">2</Button>
                    <Button variant="ghost" className="h-9 w-9 p-0">3</Button>
                    <span className="mx-2">...</span>
                    <Button variant="ghost" className="h-9 w-9 p-0">10</Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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

interface FilterSidebarProps {
  filters: any;
  handleFilterChange: (category: string, value: any) => void;
  handleJobTypeChange: (type: string) => void;
  handleExperienceChange: (level: string) => void;
  formatSalary: (salary: number) => string;
  resetFilters: () => void;
}

const FilterSidebar = ({
  filters,
  handleFilterChange,
  handleJobTypeChange,
  handleExperienceChange,
  formatSalary,
  resetFilters,
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary: true,
    experience: true,
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  return (
    <div className="bg-card dark:bg-card shadow-md rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button 
          variant="ghost" 
          className="text-sm h-8 text-muted-foreground"
          onClick={resetFilters}
        >
          Reset All
        </Button>
      </div>
      
      {/* Job Type Filter */}
      <div className="mb-6 border-b pb-6">
        <button 
          className="flex items-center justify-between w-full text-left font-medium mb-4"
          onClick={() => toggleSection('jobType')}
        >
          <span>Job Type</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${expandedSections.jobType ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.jobType && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="full-time" 
                checked={filters.jobType.fullTime}
                onCheckedChange={() => handleJobTypeChange('fullTime')}
              />
              <label htmlFor="full-time" className="text-sm font-medium leading-none cursor-pointer">
                Full-time
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="part-time" 
                checked={filters.jobType.partTime}
                onCheckedChange={() => handleJobTypeChange('partTime')}
              />
              <label htmlFor="part-time" className="text-sm font-medium leading-none cursor-pointer">
                Part-time
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="contract" 
                checked={filters.jobType.contract}
                onCheckedChange={() => handleJobTypeChange('contract')}
              />
              <label htmlFor="contract" className="text-sm font-medium leading-none cursor-pointer">
                Contract
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remote" 
                checked={filters.jobType.remote}
                onCheckedChange={() => handleJobTypeChange('remote')}
              />
              <label htmlFor="remote" className="text-sm font-medium leading-none cursor-pointer">
                Remote
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Salary Range Filter */}
      <div className="mb-6 border-b pb-6">
        <button 
          className="flex items-center justify-between w-full text-left font-medium mb-4"
          onClick={() => toggleSection('salary')}
        >
          <span>Salary Range</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${expandedSections.salary ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.salary && (
          <div>
            <div className="flex justify-between mb-4">
              <span className="text-sm">{formatSalary(filters.salaryRange[0])}</span>
              <span className="text-sm">{formatSalary(filters.salaryRange[1])}</span>
            </div>
            
            <Slider
              defaultValue={filters.salaryRange}
              min={30000}
              max={200000}
              step={5000}
              onValueChange={(value) => handleFilterChange('salaryRange', value)}
              className="mb-6"
            />
          </div>
        )}
      </div>
      
      {/* Experience Level Filter */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-left font-medium mb-4"
          onClick={() => toggleSection('experience')}
        >
          <span>Experience Level</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${expandedSections.experience ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.experience && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="entry-level" 
                checked={filters.experienceLevel.entry}
                onCheckedChange={() => handleExperienceChange('entry')}
              />
              <label htmlFor="entry-level" className="text-sm font-medium leading-none cursor-pointer">
                Entry Level
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mid-level" 
                checked={filters.experienceLevel.mid}
                onCheckedChange={() => handleExperienceChange('mid')}
              />
              <label htmlFor="mid-level" className="text-sm font-medium leading-none cursor-pointer">
                Mid Level
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="senior-level" 
                checked={filters.experienceLevel.senior}
                onCheckedChange={() => handleExperienceChange('senior')}
              />
              <label htmlFor="senior-level" className="text-sm font-medium leading-none cursor-pointer">
                Senior Level
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="executive" 
                checked={filters.experienceLevel.executive}
                onCheckedChange={() => handleExperienceChange('executive')}
              />
              <label htmlFor="executive" className="text-sm font-medium leading-none cursor-pointer">
                Executive
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    posted_at: string;
    description: string;
    skills: any;
    logo: string;
    featured?: boolean;
  };
}


export default Jobs;
