import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SkillSearch } from "./profile/SkillSearch";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

// Form schema validation
const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Job title must be at least 5 characters" }),
  description: z
    .string()
    .min(50, { message: "Description must be at least 50 characters" }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters" }),
  experience_required: z
    .string()
    .min(1, { message: "Experience required is required" }),
  status: z.string().default("open"),
});

interface JobSkill {
  skill_id: number;
  proficiency_level: number;
  name: string;
}

export function PostJobForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [requiredSkills, setRequiredSkills] = React.useState<JobSkill[]>([]);
  const [showSkillSearch, setShowSkillSearch] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      experience_required: "",
      status: "open",
    },
  });

  const handleSkillSelect = (
    skillId: number,
    proficiencyLevel: number,
    skillName: string
  ) => {
    setRequiredSkills((prev) => {
      // Check if skill already exists
      if (prev.some((skill) => skill.skill_id === skillId)) {
        return prev;
      }
      return [
        ...prev,
        {
          skill_id: skillId,
          proficiency_level: proficiencyLevel,
          name: skillName,
        },
      ];
    });
    setShowSkillSearch(false);
  };

  const removeSkill = (skillId: number) => {
    setRequiredSkills((prev) =>
      prev.filter((skill) => skill.skill_id !== skillId)
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Step 1: Create the job
      const jobData = {
        ...values,
        experience_required: parseInt(values.experience_required),
        status: "open",
      };

      const jobResponse = await fetch(`${import.meta.env.VITE_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      console.log("Job response status:", jobResponse.status); // Debug log
      const responseData = await jobResponse.json();
      console.log("Raw job creation response:", responseData); // Debug log
      console.log("Response data type:", typeof responseData); // Debug log
      console.log("Response data keys:", Object.keys(responseData)); // Debug log

      if (!jobResponse.ok) {
        throw new Error(responseData.message || "Failed to create job");
      }

      // Extract jobId from response
      const jobId = responseData.jobId;
      console.log("Extracted jobId:", jobId); // Debug log
      console.log("jobId type:", typeof jobId); // Debug log

      if (!jobId) {
        console.error("Response data missing jobId:", responseData);
        throw new Error("Job ID not received from server");
      }

      // Step 2: Add required skills to the job
      if (requiredSkills.length > 0) {
        const skillsData = {
          skills: requiredSkills.map((skill) => ({
            skill_id: skill.skill_id,
            required_level: skill.proficiency_level,
          })),
        };

        console.log("Sending skills data for job ID:", jobId); // Debug log
        console.log("Skills data:", skillsData); // Debug log

        const skillsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/jobs/${jobId}/skills`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(skillsData),
          }
        );

        if (!skillsResponse.ok) {
          const errorData = await skillsResponse.json();
          throw new Error(errorData.message || "Failed to add required skills");
        }
      }

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and is now live.",
      });

      form.reset();
      setRequiredSkills([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to post job. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Senior Frontend Developer"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. San Francisco, CA or Remote"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience_required"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience Required</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="e.g. 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Required Skills</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSkillSearch(true)}
            >
              Add Skill
            </Button>
          </div>

          {showSkillSearch && (
            <div className="mt-4">
              <SkillSearch
                onSkillSelect={handleSkillSelect}
                selectedSkills={requiredSkills}
              />
            </div>
          )}

          <div className="space-y-2">
            {requiredSkills.map((skill) => (
              <div
                key={skill.skill_id}
                className="flex items-center justify-between p-3 bg-white/50 dark:bg-brand-purple/10 rounded-lg border border-gray-300 dark:border-gray-600"
              >
                <span className="font-medium">{skill.name}</span>
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

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setRequiredSkills([]);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-red hover:bg-brand-red/90">
            Post Job
          </Button>
        </div>
      </form>
    </Form>
  );
}
