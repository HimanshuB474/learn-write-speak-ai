
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Process the authentication callback from Supabase
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check if there's an error in the URL
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
        
        if (errorDescription) {
          toast.error(`Authentication error: ${errorDescription}`);
          navigate('/login');
          return;
        }
        
        // Process the session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Authentication error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }
        
        if (data?.session) {
          toast.success('Authentication successful!');
          navigate('/dashboard');
        } else {
          // If no session but also no error, the page might have been accessed directly
          toast.error('No authentication session found');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error during authentication callback:', err);
        toast.error('An unexpected error occurred');
        navigate('/login');
      }
    };

    handleAuthCallback();
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
