import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from "@/components/ui/separator";
import { Calendar as DatePicker } from '@/components/ui/calendar';
import {

  Phone,
  Linkedin,
  Github,
  Globe,

  GraduationCap,
  Award,
  DollarSign,
  Clock,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { AnimatedElement } from "./AnimatedElement";
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
import { Calendar, MapPin, Briefcase, Mail } from 'lucide-react';

type Application = {
  id: string;
  job_id: number;
  candidate_id: number;
  status: string;
  applied_at: string;
  score: number | null;
  title: string;
  candidate_name: string;
  email: string;
  candidate_location: string;
  experience_years: number;
};

type Props = {
  application: Application;
};
const Dashboard = () => {
  const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setjobs] = useState<any>(null);
    const [applications, setapplications] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role')
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile`,
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
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchApplications = async () => {
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
        setapplications(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    fetchApplications();
  }, []);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/jobs/emp`,
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
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }
console.log(jobs)
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-brand-charcoal dark:text-white">
                Profile Not Found
              </h2>
              <p className="text-muted-foreground">
                Please complete your profile setup to view your dashboard.
              </p>
              <Button
                onClick={() => navigate("/profile/update")}
                className="bg-brand-red hover:bg-brand-red/90"
              >
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Overview Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-brand-charcoal dark:text-white">
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-xl font-semibold">{profile.name}</h3>
                      <p className="text-muted-foreground">{profile.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role === "candidate" ? (
                        <Badge variant="secondary" className="text-sm">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {String(profile.experience_years)} Years Experience
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-sm">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {profile.job_title}
                        </Badge>
                      )}
                      {role == "candidate" ? <Badge variant="secondary" className="text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.location}
                      </Badge> : ""}
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />

                <div className="space-y-4">
                  {profile.role === "candidate" && (
                    <div>
                      <h4 className="font-medium mb-2">Bio</h4>
                      <p className="text-muted-foreground">{profile.bio}</p>
                    </div>
                  )}
                  {profile.role === "candidate" && (
                    <div>
                      <h4 className="font-medium mb-2">Education</h4>
                      <p className="text-muted-foreground">{profile.education}</p>
                    </div>
                  )}
                  {profile.role === "recruiter" && (
                    <div>
                      <h4 className="font-medium mb-2">Company</h4>
                      <p className="text-muted-foreground">
                        {profile.company_name}
                      </p>
                      <a
                        href={profile.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-red hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}


            {/* Skills Card (for candidates) */}
            {role === "candidate" && profile.skills && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-brand-charcoal dark:text-white">
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.skills.map((skill) => (
                      <div
                        key={skill.skill_id}
                        className="flex items-center justify-between p-3 bg-white/50 dark:bg-brand-purple/10 rounded-lg border border-gray-300 dark:border-gray-600"
                      >
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-brand-red" />
                          <span className="font-medium">{skill.skill_name}</span>
                        </div>
                        <Badge variant="secondary">
                          Level {skill.proficiency_level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-brand-charcoal dark:text-white">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate("/profile/update")}
                    className="w-full bg-brand-red hover:bg-brand-red/90"
                  >
                    Edit Profile
                  </Button>
                  {role === "candidate" ? (
                    <Button
                      onClick={() => navigate("/jobs")}
                      variant="outline"
                      className="w-full"
                    >
                      Browse Jobs
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate("/employers")}
                      variant="outline"
                      className="w-full"
                    >
                      Post a Job
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
    <div className="container mx-auto px-4 py-8">
      {role === 'employer' && (
        <div>
          {/* Tab Header */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'jobs'
                  ? 'bg-brand-red/90 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'applications'
                  ? 'bg-brand-red/90 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Applications
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              {jobs?.jobs?.map((job, index) => (
                <AnimatedElement key={job.id} delay={index * 100}>
                  <div className="w-full">
                    <JobCard job={job} />
                  </div>
                </AnimatedElement>
              ))}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              {applications?.map((app, idx) => (
                <AnimatedElement key={app.id} delay={idx * 100}>
    <ApplicationCard application={app} />
                </AnimatedElement>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
      </main>
    </div>

  );
};

const ApplicationCard: React.FC<Props> = ({ application }) => {
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(undefined);

  const handleSchedule = () => {
    if (!interviewDate) return alert("Please pick a date first.");
    console.log(`📅 Scheduled interview with ${application.candidate_name} on ${interviewDate}`);
    // TODO: Replace with actual API call
  };

  return (
    <div className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-blue-700 mb-1">{application.title}</h3>
      <p className="text-sm text-gray-600 mb-2">Application ID: #{application.id}</p>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Briefcase size={16} />
          <span className="font-medium">{application.candidate_name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span>{application.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{application.candidate_location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            Applied on: {new Date(application.applied_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Experience:</span>
          <span>{application.experience_years} years</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
            {application.status}
          </span>
        </div>
      </div>

      {/* Schedule Interview Button + Modal */}
      <div className="mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline"   className="bg-brand-red/90 hover:bg-brand-red transition text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>

            <DatePicker
              mode="single"
              selected={interviewDate}
              onSelect={setInterviewDate}
              className="rounded-md border mt-4"
            />

            <DialogFooter className="mt-4">
<Button
  onClick={handleSchedule}
  disabled={!interviewDate}
  className="bg-brand-red/90 hover:bg-brand-red transition text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
>
  Schedule
</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};


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

export default Dashboard;
