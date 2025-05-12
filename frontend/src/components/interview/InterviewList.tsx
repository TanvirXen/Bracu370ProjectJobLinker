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
function convertToLocalDateTimeString(isoString: string): string {
  const date = new Date(isoString);

  // Convert to UTC+6 (Bangladesh Time)
  const utcOffset = 6 * 60; // in minutes
  const localDate = new Date(date.getTime() + utcOffset * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(localDate.getUTCDate());
  const month = pad(localDate.getUTCMonth() + 1);
  const year = localDate.getUTCFullYear();
  const hours = pad(localDate.getUTCHours());
  const minutes = pad(localDate.getUTCMinutes());
  const seconds = pad(localDate.getUTCSeconds());

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}
interface InterviewListProps {
  interviews: any;
  userRole: string;
}

export function InterviewList({ interviews, userRole }: InterviewListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {interviews?.interviews?.map((interview) => (
        <Card key={interview?.interview_id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">{interview?.job_title}</span>
              <Badge variant={
                interview.status === 'scheduled' ? 'default' :
                interview.status === 'completed' ? 'secondary' : 'destructive'
              }>
                {interview.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {userRole === 'employer' ? (
                <>With: {interview?.candidate_name}</>
              ) : (
               ""
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {convertToLocalDateTimeString(interview?.interview_datetime)}
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
