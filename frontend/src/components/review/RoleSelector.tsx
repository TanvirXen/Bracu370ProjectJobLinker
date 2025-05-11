import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleSelectorProps {
  onRoleSelect: (role: 'employer' | 'candidate') => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="cursor-pointer hover:border-brand-red transition-colors" 
            onClick={() => onRoleSelect('employer')}>
        <CardHeader>
          <CardTitle className="text-center">Review as Employer</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Review candidates you've worked with
          </p>
          <Button onClick={() => onRoleSelect('employer')}>
            Continue as Employer
          </Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:border-brand-red transition-colors"
            onClick={() => onRoleSelect('candidate')}>
        <CardHeader>
          <CardTitle className="text-center">Review as Candidate</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Review employers you've worked with
          </p>
          <Button onClick={() => onRoleSelect('candidate')}>
            Continue as Candidate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
