import React from "react";
import { Profile } from "../../types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RecruiterProfile } from "../../types/profile";

interface RecruiterProfileFormProps {
  formData: Partial<RecruiterProfile>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Profile>>>;
}

const RecruiterProfileForm: React.FC<RecruiterProfileFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          type="text"
          name="company_name"
          value={formData.company_name || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, company_name: e.target.value }))
          }
          className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
          required
        />
      </div>

      <div>
        <Label htmlFor="company_website">Company Website</Label>
        <Input
          id="company_website"
          type="url"
          name="company_website"
          value={formData.company_website || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              company_website: e.target.value,
            }))
          }
          className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
        />
      </div>

      <div>
        <Label htmlFor="job_title">Job Title</Label>
        <Input
          id="job_title"
          type="text"
          name="job_title"
          value={formData.job_title || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, job_title: e.target.value }))
          }
          className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
          required
        />
      </div>
    </div>
  );
};

export default RecruiterProfileForm;
