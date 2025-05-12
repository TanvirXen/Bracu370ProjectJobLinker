export interface Interview {
  [key: string]: any;
}

export interface CreateInterviewDto {
  application_id: number;
  interview_datetime: string;
  mode: 'online' | 'in-person';
}
