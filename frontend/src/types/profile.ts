export type UserRole = "candidate" | "recruiter";

export interface BaseProfile {
  name: string;
  email: string;
    role: string;
  bio: string;
  education: string;
  location: string;
    experience_years:Number;
    company_name:string,
    company_website:string,
    job_title:string,
  skills?: {
    skill_id: number;
    proficiency_level: number;
    skill_name?: string; // Optional name for display purposes
  }[];
  created_at?: string;
  updated_at?: string;
}




export type Profile = BaseProfile;
