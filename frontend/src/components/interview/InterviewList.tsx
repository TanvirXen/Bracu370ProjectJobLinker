import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Interview } from '@/types/interview';
import { CalendarIcon, VideoCameraIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface InterviewListProps {
  interviews: Interview[];
  userRole: 'employer' | 'candidate';
}

export function InterviewList({ interviews, userRole }: InterviewListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => (
        <Card key={interview.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">{interview.job_title}</span>
              <Badge variant={
                interview.status === 'scheduled' ? 'default' :
                interview.status === 'completed' ? 'secondary' : 'destructive'
              }>
                {interview.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {userRole === 'employer' ? (
                <>With: {interview.candidate_name}</>
              ) : (
                <>With: {interview.employer_name}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {new Date(interview.interview_datetime).toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {interview.mode === 'online' ? (
                <VideoCameraIcon className="mr-2 h-4 w-4" />
              ) : (
                <BuildingOfficeIcon className="mr-2 h-4 w-4" />
              )}
              {interview.mode === 'online' ? 'Online Interview' : 'In-Person Interview'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
