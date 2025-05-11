export type UserRole = "candidate" | "recruiter";

export interface BaseProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  profilePicture?: string;
  contactInfo: {
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface CandidateProfile extends BaseProfile {
  role: "candidate";
  bio: string;
  location: string;
  experience_years: number;
  education: string; // Stored as TEXT in database
  skills?: {
    skill_id: number;
    proficiency_level: number;
    name?: string; // Optional name for display purposes
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface RecruiterProfile extends BaseProfile {
  role: "recruiter";
  company_name: string;
  company_website: string;
  job_title: string;
}

export type Profile = CandidateProfile | RecruiterProfile;
