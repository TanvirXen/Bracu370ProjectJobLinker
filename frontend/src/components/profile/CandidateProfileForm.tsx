import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CandidateProfile } from "@/types/profile";
import { SkillSearch } from "./SkillSearch";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

interface CandidateProfileFormProps {
  formData: Partial<CandidateProfile>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<CandidateProfile>>>;
  onSubmit: (data: Partial<CandidateProfile>) => Promise<void>;
}

export const CandidateProfileForm = ({
  formData,
  setFormData,
  onSubmit,
}: CandidateProfileFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showSkillSearch, setShowSkillSearch] = React.useState(false);

  const handleSkillSelect = async (
    skillId: number,
    proficiencyLevel: number,
    skillName: string
  ) => {
    try {
      // Add the skill to the candidate_skills table using the existing skill ID
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidate-skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            skill_id: skillId,
            proficiency_level: proficiencyLevel,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add skill");
      }

      // Then update the form data
      setFormData((prev) => {
        const skills = [...(prev.skills || [])];
        const existingSkillIndex = skills.findIndex(
          (skill) => skill.skill_id === skillId
        );

        if (existingSkillIndex !== -1) {
          skills[existingSkillIndex] = {
            ...skills[existingSkillIndex],
            proficiency_level: proficiencyLevel,
          };
        } else {
          skills.push({
            skill_id: skillId,
            proficiency_level: proficiencyLevel,
            name: skillName,
          });
        }

        return { ...prev, skills };
      });

      toast({
        title: "Skill added successfully",
        description: "Your skill has been added to your profile.",
      });
    } catch (error) {
      console.error("Error adding skill:", error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeSkill = async (skillId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidate-skills/${skillId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove skill");
      }

      setFormData((prev) => {
        const skills = [...(prev.skills || [])];
        const updatedSkills = skills.filter(
          (skill) => skill.skill_id !== skillId
        );
        return { ...prev, skills: updatedSkills };
      });

      toast({
        title: "Skill removed successfully",
        description: "The skill has been removed from your profile.",
      });
    } catch (error) {
      console.error("Error removing skill:", error);
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSkill = () => {
    console.log("Add Skill button clicked");
    setShowSkillSearch(true);
  };

  const handleSkillSearchComplete = () => {
    setShowSkillSearch(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bio: e.target.value }))
          }
          className="mt-1 bg-white/80 dark:bg-brand-purple/20 border border-gray-300 dark:border-gray-600 focus:border-brand-red dark:focus:border-brand-tangerine"
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          type="text"
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          className="mt-1 bg-white/80 dark:bg-brand-purple/20 border border-gray-300 dark:border-gray-600 focus:border-brand-red dark:focus:border-brand-tangerine"
          placeholder="Enter your location"
        />
      </div>

      <div>
        <Label htmlFor="experience_years">Years of Experience</Label>
        <Input
          type="number"
          id="experience_years"
          name="experience_years"
          value={formData.experience_years || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              experience_years: parseInt(e.target.value),
            }))
          }
          className="mt-1 bg-white/80 dark:bg-brand-purple/20 border border-gray-300 dark:border-gray-600 focus:border-brand-red dark:focus:border-brand-tangerine"
        />
      </div>

      <div>
        <Label htmlFor="education">Education</Label>
        <Textarea
          id="education"
          name="education"
          value={formData.education || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, education: e.target.value }))
          }
          className="mt-1 bg-white/80 dark:bg-brand-purple/20 border border-gray-300 dark:border-gray-600 focus:border-brand-red dark:focus:border-brand-tangerine"
          rows={4}
          placeholder="Enter your education details"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-brand-charcoal dark:text-white">
            Skills
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSkill}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>

        {showSkillSearch && (
          <div className="mt-4">
            <SkillSearch
              onSkillSelect={(skillId, proficiencyLevel, skillName) => {
                handleSkillSelect(skillId, proficiencyLevel, skillName);
                handleSkillSearchComplete();
              }}
              selectedSkills={formData.skills || []}
            />
          </div>
        )}

        <div className="space-y-2">
          {(formData.skills || []).map((skill) => (
            <div
              key={skill.skill_id}
              className="flex items-center justify-between p-3 bg-white/50 dark:bg-brand-purple/10 rounded-lg border border-gray-300 dark:border-gray-600"
            >
              <div>
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  (Level {skill.proficiency_level})
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkill(skill.skill_id)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileForm;
