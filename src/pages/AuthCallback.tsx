
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Process the authentication callback
    // This will be replaced with actual Supabase logic after integration
    
    // Show success message
    toast.success('Authentication successful!');
    
    // Redirect to dashboard
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing authentication...</h2>
        <div className="animate-pulse text-accent">Please wait</div>
      </div>
    </div>
  );
};

export default AuthCallback;
