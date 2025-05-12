import React from "react";
import ProfileForm from "../components/profile/ProfileForm";
import { useAuth } from "../providers/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { AnimatedElement } from "@/components/AnimatedElement";

const ProfileUpdate: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-sand to-white dark:from-brand-purple dark:to-brand-purple/60">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-brand-charcoal dark:text-white">
            Please log in to update your profile
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You need to be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-sand to-white dark:from-brand-purple dark:to-brand-purple/60">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-20">
        <AnimatedElement animation="slide-in">
          <div className="max-w-4xl mx-auto">
            <div className="glass dark:glass-dark p-8 rounded-xl">
              <h1 className="text-3xl font-bold text-brand-charcoal dark:text-white mb-8">
                Update Your Profile
              </h1>
              <ProfileForm />
            </div>
          </div>
        </AnimatedElement>
      </div>
    </div>
  );
};

export default ProfileUpdate;
