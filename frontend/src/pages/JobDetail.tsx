import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { AnimatedElement } from '@/components/AnimatedElement';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, DollarSign, Clock, Briefcase, Building, Users, Calendar, Globe, ChevronLeft, Star, Check, X } from 'lucide-react';
import { ArrowUpRight } from "lucide-react"; // make sure you have lucide-react installed

export function getTimeAgo(postedAt: string | Date): string {
  const postedDate = new Date(postedAt);
  if (isNaN(postedDate.getTime())) return "Invalid date";

  const now = new Date();
  const diffMs = now.getTime() - postedDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
const JobDetail = () => {
  const hasAppliedToJob = (id: number | string, appliedJobs: any[]): boolean => {
    return appliedJobs?.some(job => job?.job_id == id); // loose equality to handle string/number mismatch
  };
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('description');
  const [job, setjobs] = useState<any>(null);
  const [applied, setjapplied] = useState<any>(null);
  const [appliedJobs, setappliedJobs] = useState<any>(null);
  const role = localStorage.getItem("role")
  // In a real app, we would fetch job details based on the ID
  const fetchAppliedJobs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/getapplications`,
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

      setappliedJobs(data);

    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {

    }
  };
  const navigate = useNavigate();
  const createAppliedJobs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/apply/${id}`,
        {
          method: "POST", // ✅ explicitly set method
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ job_id: id }) // ✅ include an empty body if needed
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      fetchAppliedJobs()
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/jobs/${id}`,
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

        setjobs(data);

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {

      }
    };

    fetchJobs();
    fetchAppliedJobs()
  }, []);
  useEffect(() => {
    setjapplied(hasAppliedToJob(id, appliedJobs))
  }, [appliedJobs]);

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
                        {/* <div className="w-16 h-16 flex items-center justify-center bg-white text-4xl rounded-lg shadow-lg mr-4">
                          {job.logo}
                        </div> */}
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold mb-1">{job?.title}</h1>
                          <div className="text-white/90">{job?.company_name}</div>
                        </div>
                      </div>
                    </div>
                    {role == "employer" ? "" :
                      <div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-medium">
                          Match: {job?.match?.overallMatchPercentage}%
                        </div>
                      </div>
                    }

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center text-sm mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-white/80">Location</span>
                        </div>
                        <div className="font-medium">{job?.location}</div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center text-sm mb-1">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="text-white/80">Salary</span>
                        </div>
                        <div className="font-medium">{job?.salary}</div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center text-sm mb-1">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span className="text-white/80">Job Type</span>
                        </div>
                        <div className="font-medium">
                          <a
                            href={job?.company_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white-600 hover:underline hover:text-blue-800 transition"
                          >
                            Website
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center text-sm mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-white/80">Posted</span>
                        </div>
                        <div className="font-medium">{getTimeAgo(job?.posted_at)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Tab navigation */}
                  <div className="border-b">
                    <div className="flex overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('description')}
                        className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'description'
                          ? 'border-b-2 border-brand-red text-brand-red'
                          : 'text-muted-foreground'
                          }`}
                      >
                        Job Description
                      </button>

                      {/* <button
                        onClick={() => setActiveTab('company')}
                        className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'company'
                            ? 'border-b-2 border-brand-red text-brand-red'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Company
                      </button> */}

                      {/* <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'reviews'
                            ? 'border-b-2 border-brand-red text-brand-red'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Reviews
                      </button> */}
                    </div>
                  </div>

                  {/* Tab content */}
                  <div className="p-6">
                    {activeTab === 'description' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job?.description }} />
                        </div>




                        <div>
                          <h3 className="text-xl font-semibold mb-4">Required Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {job?.jobSkills?.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="px-3 py-1">
                                {skill.skillName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </AnimatedElement>

              {/* Similar jobs section */}
              {/* <AnimatedElement delay={200}>
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
              </AnimatedElement> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AnimatedElement delay={100}>
                <div className="sticky top-24 space-y-6">
                  {/* Apply button */}
                  {role == "employer" ? "" : <div className="bg-card dark:bg-card shadow-md rounded-xl p-6 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-medium h-12 text-lg mb-4" disabled={applied} onClick={() => createAppliedJobs()}>
                          {applied ? "Applied" : "Easy Apply"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Apply for {job?.title}</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 text-center">
                          <p className="mb-4">Thanks for Applying</p>
                          <p className="mb-6 text-muted-foreground">The Employer will get back to you soon.</p>
                          <Button className="bg-brand-red hover:bg-brand-red/90" onClick={() => navigate("/dashboard")}>Continue To Dashboard</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* <Button variant="outline" className="w-full">
                      Save Job
                    </Button> */}
                  </div>}

                  {/* Job match */}
                  {role == "employer" ? "" : <div className="bg-card dark:bg-card shadow-md rounded-xl p-6">
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
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - job?.match?.overallMatchPercentage / 100)}`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute text-2xl font-bold">
                          {job?.match?.overallMatchPercentage}%
                        </div>
                      </div>
                    </div>

                    <p className="text-center text-sm mb-4">
                      Based on your skills and experience, your match for this position.
                    </p>

                    <div className="space-y-3">
                      {job?.match?.skills?.map((r) => {
                        return <div className="flex items-center justify-between">
                          <span className="text-sm">{r?.skillName}</span>
                          <Badge
                            variant="outline"
                            className={`${r?.matchPercentage > 50
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"
                              }`}
                          >
                            {r?.matchPercentage > 50 ? "Strong Match" : "Partial Match"}
                          </Badge>
                        </div>
                      })}


                    </div>
                  </div>}
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
