import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-brand-charcoal dark:text-white">
                Profile Not Found
              </h2>
              <p className="text-muted-foreground">
                Please complete your profile setup to view your dashboard.
              </p>
              <Button
                onClick={() => navigate("/profile/update")}
                className="bg-brand-red hover:bg-brand-red/90"
              >
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-brand-charcoal dark:text-white">
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profilePicture} />
                <AvatarFallback className="text-2xl">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.role === "candidate" ? (
                    <Badge variant="secondary" className="text-sm">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {profile.experience_years} Years Experience
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-sm">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {profile.job_title}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.location}
                  </Badge>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
              {profile.role === "candidate" && (
                <div>
                  <h4 className="font-medium mb-2">Education</h4>
                  <p className="text-muted-foreground">{profile.education}</p>
                </div>
              )}
              {profile.role === "recruiter" && (
                <div>
                  <h4 className="font-medium mb-2">Company</h4>
                  <p className="text-muted-foreground">
                    {profile.company_name}
                  </p>
                  <a
                    href={profile.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-red hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-brand-charcoal dark:text-white">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.contactInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.contactInfo.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              {profile.contactInfo.linkedin && (
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={profile.contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-red hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {profile.contactInfo.github && (
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={profile.contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-red hover:underline"
                  >
                    GitHub Profile
                  </a>
                </div>
              )}
              {profile.contactInfo.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={profile.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-red hover:underline"
                  >
                    Personal Website
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills Card (for candidates) */}
        {profile.role === "candidate" && profile.skills && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-brand-charcoal dark:text-white">
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.skills.map((skill) => (
                  <div
                    key={skill.skill_id}
                    className="flex items-center justify-between p-3 bg-white/50 dark:bg-brand-purple/10 rounded-lg border border-gray-300 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-brand-red" />
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <Badge variant="secondary">
                      Level {skill.proficiency_level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-brand-charcoal dark:text-white">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => navigate("/profile/update")}
                className="w-full bg-brand-red hover:bg-brand-red/90"
              >
                Edit Profile
              </Button>
              {profile.role === "candidate" ? (
                <Button
                  onClick={() => navigate("/jobs")}
                  variant="outline"
                  className="w-full"
                >
                  Browse Jobs
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/employers")}
                  variant="outline"
                  className="w-full"
                >
                  Post a Job
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
