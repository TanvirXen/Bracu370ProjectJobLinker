import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { AnimatedElement } from '@/components/AnimatedElement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EyeIcon, EyeOffIcon, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../providers/AuthProvider';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setcompanyName] = useState('');
  const [companyWebsite, setcompanyWebsite] = useState('');
  const [jobTitle, setjobTitle] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password, role,companyName,companyWebsite,jobTitle);
      toast({
        title: "Registration successful!",
        description: "Please login to continue.",
      });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check password strength
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '' };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    let label = '';
    if (strength <= 1) label = 'Weak';
    else if (strength <= 2) label = 'Fair';
    else if (strength <= 3) label = 'Good';
    else label = 'Strong';

    return { strength, label };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20 flex items-center justify-center p-4">
        <AnimatedElement>
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Join JobLinker to find your dream job or hire top talent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Password strength: <span className={
                          passwordStrength.label === 'Weak' ? 'text-red-500' :
                            passwordStrength.label === 'Fair' ? 'text-orange-500' :
                              passwordStrength.label === 'Good' ? 'text-yellow-500' :
                                'text-green-500'
                        }>{passwordStrength.label}</span></div>
                      </div>
                      <div className="w-full h-1 bg-muted overflow-hidden rounded-full">
                        <div className={`h-full ${passwordStrength.label === 'Weak' ? 'bg-red-500' :
                          passwordStrength.label === 'Fair' ? 'bg-orange-500' :
                            passwordStrength.label === 'Good' ? 'bg-yellow-500' :
                              'bg-green-500'
                          }`} style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full mr-1 ${password.length >= 8 ? 'bg-green-500' : 'bg-muted'}`}></div>
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full mr-1 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-muted'}`}></div>
                      <span>One uppercase letter</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full mr-1 ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-muted'}`}></div>
                      <span>One number</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full mr-1 ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-muted'}`}></div>
                      <span>One special character</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Create account as</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as 'candidate' | 'employer')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Create account as" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidate">Job Seeker</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {role == "employer" ? <div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Company Name</Label>
                    <Input
                      id="Company Name"
                      type="text"
                      placeholder="Your Company Name"
                      value={companyName}
                      onChange={(e) => setcompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Company Website</Label>
                    <Input
                      id="Company Website"
                      type="text"
                      placeholder="https://yourcompanywebsite.com/"
                      value={companyWebsite}
                      onChange={(e) => setcompanyWebsite(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Job Title</Label>
                    <Input
                      id="Job Title"
                      type="text"
                      placeholder="Your Designation"
                      value={jobTitle}
                      onChange={(e) => setjobTitle(e.target.value)}
                      required
                    />
                  </div>
                </div> : ""}


                <Button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-red/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-red hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </AnimatedElement>
      </main>

      <footer className="bg-brand-charcoal dark:bg-brand-purple text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70">© {new Date().getFullYear()} JobLinker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
