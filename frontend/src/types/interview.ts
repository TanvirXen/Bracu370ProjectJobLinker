export interface Interview {
  id: number;
  application_id: number;
  interview_datetime: string;
  mode: 'online' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  job_title: string;
  candidate_name?: string;  // Only for employer view
  employer_name?: string;   // Only for candidate view
}

export interface CreateInterviewDto {
  application_id: number;
  interview_datetime: string;
  mode: 'online' | 'in-person';
}
