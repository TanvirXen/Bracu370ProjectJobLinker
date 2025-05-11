import React, { useState } from "react";
import { UserRole, Profile } from "../../types/profile";
import CandidateProfileForm from "./CandidateProfileForm";
import RecruiterProfileForm from "./RecruiterProfileForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProfileForm: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: "",
    email: "",
    bio: "",
    location: "",
    profilePicture: "",
    contactInfo: {
      phone: "",
      linkedin: "",
      github: "",
      website: "",
    },
  });

  const handleCommonFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("contactInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // or use a context/store

      const response = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          role: role,
        }),
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

  return (
    <div className="space-y-8">
      {!role ? (
        <div className="space-y-6 text-center">
          <h3 className="text-2xl font-semibold text-brand-charcoal dark:text-white">
            Select Your Role
          </h3>
          <div className="flex gap-6 justify-center">
            <Button
              onClick={() => setRole("candidate")}
              className="bg-brand-red hover:bg-brand-red/90 text-lg px-8 py-6"
            >
              I'm a Candidate
            </Button>
            <Button
              onClick={() => setRole("recruiter")}
              className="bg-brand-tangerine hover:bg-brand-tangerine/90 text-lg px-8 py-6"
            >
              I'm a Recruiter
            </Button>
          </div>
        </div>
      ) : (
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
              />
            </div>

            <div>
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
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleCommonFieldChange}
                className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
                required
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-medium text-brand-charcoal dark:text-white">
                Contact Information
              </h4>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo?.phone}
                  onChange={handleCommonFieldChange}
                  className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  name="contactInfo.linkedin"
                  value={formData.contactInfo?.linkedin}
                  onChange={handleCommonFieldChange}
                  className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  type="url"
                  name="contactInfo.github"
                  value={formData.contactInfo?.github}
                  onChange={handleCommonFieldChange}
                  className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  name="contactInfo.website"
                  value={formData.contactInfo?.website}
                  onChange={handleCommonFieldChange}
                  className="mt-1 bg-white/80 dark:bg-brand-purple/20 border-brand-charcoal/20 dark:border-white/20 focus:border-brand-red dark:focus:border-brand-tangerine"
                />
              </div>
            </div>
          </div>

          {role === "candidate" ? (
            <CandidateProfileForm
              formData={formData}
              setFormData={setFormData}
            />
          ) : (
            <RecruiterProfileForm
              formData={formData}
              setFormData={setFormData}
            />
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => setRole(null)}
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
      )}
    </div>
  );
};

export default ProfileForm;
