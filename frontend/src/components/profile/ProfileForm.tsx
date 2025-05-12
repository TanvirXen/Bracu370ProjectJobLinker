import React, { useState, useEffect } from "react";
import { UserRole, Profile } from "../../types/profile";
import CandidateProfileForm from "./CandidateProfileForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProfileForm: React.FC = () => {
  const role = localStorage.getItem("role")
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [allSkills, setallSkills] = useState<any>(null);
  const [formData, setFormData] = useState<Profile>({
    name: "",
    email: "",
    bio: "",
    location: "",
    experience_years: 0,
    company_name: "",
    company_website: "",
    job_title: "",
    education: "",
    role:""
  });

  const handleCommonFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

try {
  const token = localStorage.getItem("token");

  // Remove 'skills' and 'role' from formData before sending
  const { skills, role, ...sanitizedData } = formData;

  const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sanitizedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error updating profile:", errorData);
    alert("Failed to update profile");
    return;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  console.log("Profile updated:", data);
  alert("Profile updated successfully!");
} catch (error) {
  console.error("Update error:", error);
  alert("Something went wrong!");
}
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // ✅ Use correct key
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data: any = await response.json();
        setProfile(data);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/candidate-skills`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }

          const data: any = await response.json();
          setallSkills(data.skills);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  useEffect(() => {
    if (!profile) return;

    setFormData((prev) => ({
      ...prev,
      name: profile.name || "",
      email: profile.email || "",
      bio: profile.bio || "",
      education: profile.education || "",
      location: profile.location || "",
      experience_years: profile.experience_years ?? 0,
      company_name: profile.company_name || "",
      company_website: profile.company_website || "",
      job_title: profile.job_title || "",
      skills: allSkills
    }));
  }, [profile, allSkills]);
  return (
    <div className="space-y-8">

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleCommonFieldChange}
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleCommonFieldChange}
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              required
              readOnly
            />
          </div>

          {role == "candidate" ? <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleCommonFieldChange}
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              rows={3}
              required
            />
          </div> : ""}

          {role == "candidate" ? <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleCommonFieldChange}
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              required
            />
          </div> : ""}
          {role == "candidate" ? <div>
            <Label htmlFor="experience_years">Experience Year</Label>
            <Input
              id="experience_years"
              name="experience_years"
        value={formData.experience_years?.toString() || ""}
              onChange={handleCommonFieldChange}
              type="Number"
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              required
            />
          </div> : ""}
          {role == "candidate" ? <div>
            <Label htmlFor="location">Education</Label>
            <Input
              id="education"
              name="education"
              value={formData.education}
              onChange={handleCommonFieldChange}
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              required
            />
          </div> : ""}
          {role == "employer" ? <div>
            <Label htmlFor="location">Company Name</Label>
            <Input
              id="location"
              name="location"
              value={formData.company_name}
              onChange={handleCommonFieldChange}
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              required
            />
          </div> : ""}
          {role == "employer" ? <div>
            <Label htmlFor="location">Company Website</Label>
            <Input
              id="location"
              name="location"
              value={formData.company_website}
              onChange={handleCommonFieldChange}
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              required
            />
          </div> : ""}
          {role == "employer" ? <div>
            <Label htmlFor="location">Job Title</Label>
            <Input
              id="location"
              name="location"
              value={formData.job_title}
              onChange={handleCommonFieldChange}
              className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
              required
            />
          </div> : ""}
        </div>

        {role === "candidate" ? (
          <CandidateProfileForm
            formData={formData}
            setFormData={setFormData}
          />
        ) : ""}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            className="border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal/10 dark:border-white dark:text-white dark:hover:bg-white/10"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-brand-red hover:bg-brand-red/90"
          >
            Save Profile
          </Button>
        </div>
      </form>

    </div>
  );
};

export default ProfileForm;
