
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the page that redirected to login, if any
  const from = location.state?.from || "/";
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would connect to an authentication service
    toast.success("Login successful!");
    
    // Redirect user back to the page they came from
    navigate(from);
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
              
              <div className="space-y-4">
                <Button type="submit" className="w-full">Sign In</Button>
                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-accent font-medium hover:underline">
                    Sign up
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

export default Login;
