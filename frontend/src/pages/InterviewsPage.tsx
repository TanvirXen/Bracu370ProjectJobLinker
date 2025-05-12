import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/providers/AuthProvider';
import { InterviewForm } from '@/components/interview/InterviewForm';
import { InterviewList } from '@/components/interview/InterviewList';
import { CreateInterviewDto, Interview } from '@/types/interview';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Mock data for demonstration
const mockInterviews: Interview[] = [
  {
    id: 1,
    application_id: 1,
    interview_datetime: '2025-05-15T10:00:00',
    mode: 'online',
    status: 'scheduled',
    job_title: 'Senior React Developer',
    candidate_name: 'John Doe',
    employer_name: 'Tech Corp'
  },
  {
    id: 2,
    application_id: 2,
    interview_datetime: '2025-05-16T14:30:00',
    mode: 'in-person',
    status: 'scheduled',
    job_title: 'Full Stack Developer',
    candidate_name: 'Jane Smith',
    employer_name: 'Web Solutions Inc'
  },
];

const mockApplications = [
  {
    id: 3,
    job_title: 'UI/UX Designer',
    candidate_name: 'Alice Johnson'
  },
  {
    id: 4,
    job_title: 'DevOps Engineer',
    candidate_name: 'Bob Wilson'
  },
];

export default function InterviewsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applications, setapplications] = useState<any>(null);
  const role=localStorage.getItem("role")
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/interviews`,
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

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-6 space-y-6 mt-20">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Interviews</h1>
          {/* {user?.role === 'employer' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Schedule Interview</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Interview</DialogTitle>
              </DialogHeader>
              <InterviewForm
                onSubmit={handleScheduleInterview}
                applications={mockApplications}
              />
            </DialogContent>
          </Dialog>
        )} */}
        </div>

        {interviews.length > 0 ? (
          <InterviewList interviews={applications} userRole={role} />
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No interviews scheduled yet.
          </div>
        )}
      </div>
    </>
  );
}
