import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: number;
  name: string;
}

interface SkillSearchProps {
  onSkillSelect: (
    skillId: number,
    proficiencyLevel: number,
    skillName: string
  ) => void;
  selectedSkills: {
    skill_id: number;
    proficiency_level: number;
    name?: string;
  }[];
}

export function SkillSearch({
  onSkillSelect,
  selectedSkills,
}: SkillSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/skills`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.status}`);
        }

        const data = await response.json();

        // Handle different response formats
        let skillsData: Skill[] = [];
        if (Array.isArray(data)) {
          skillsData = data;
        } else if (data.skills && Array.isArray(data.skills)) {
          skillsData = data.skills;
        } else if (typeof data === "object") {
          skillsData = Object.entries(data).map(([id, name]) => ({
            id: parseInt(id),
            name: name as string,
          }));
        }

        setSkills(skillsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError(
          "Failed to load skills. Please make sure the backend server is running."
        );
        setSkills([]);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSkills = React.useMemo(() => {
    if (!searchValue.trim()) {
      return skills;
    }

    const searchTerm = searchValue.toLowerCase().trim();
    return skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm)
    );
  }, [searchValue, skills]);

  const handleSkillSelect = (skill: Skill) => {
    onSkillSelect(skill.id, proficiencyLevel, skill.name);
    setSearchValue("");
    setIsOpen(false);
  };

  const isSkillSelected = (skillId: number) =>
    selectedSkills.some((skill) => skill.skill_id === skillId);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded">
          {error}
        </div>
      )}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search for a skill..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-white dark:bg-brand-purple/20"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-0"
            type="button"
          >
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-brand-purple/20 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
            {filteredSkills.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">No skills found</div>
            ) : (
              filteredSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill)}
                  disabled={isSkillSelected(skill.id)}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm flex items-center hover:bg-gray-100 dark:hover:bg-brand-purple/30",
                    isSkillSelected(skill.id) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSkillSelected(skill.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {skill.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Proficiency Level:</label>
        <Input
          type="number"
          min="1"
          max="10"
          value={proficiencyLevel}
          onChange={(e) => setProficiencyLevel(Number(e.target.value))}
          className="w-20 bg-white dark:bg-brand-purple/20"
        />
      </div>
    </div>
  );
}
