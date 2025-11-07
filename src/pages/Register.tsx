
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { AlertCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("learner");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Create user account with metadata for profile creation
      const { error } = await signUp(email, password);
      
      if (error) {
        setErrorMessage(error.message);
        toast.error("Registration failed. Please try again.");
      } else {
        toast.success("Registration successful! Please check your email to verify your account.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account and get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {errorMessage}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                </div>
                
                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup 
                    defaultValue="learner"
                    value={userRole}
                    onValueChange={setUserRole}
                  >
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="learner" id="learner" />
                        <Label htmlFor="learner" className="cursor-pointer">Learner</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="educator" id="educator" />
                        <Label htmlFor="educator" className="cursor-pointer">Educator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="therapist" id="therapist" />
                        <Label htmlFor="therapist" className="cursor-pointer">Therapist</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-accent font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
