
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DashboardCard from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookText, 
  BarChart3, 
  CalendarCheck, 
  PenSquare,
  LineChart,
  Clock,
  Star
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

// Mock data - would come from a real API in production
const mockStats = {
  wordsRecognized: 2478,
  sessionsCompleted: 42,
  accuracyRate: 87,
  lastSession: "2025-04-11",
  minutesSpent: 756,
  streakDays: 12
};

const mockRecentSessions = [
  { id: 1, date: "April 11, 2025", accuracy: 92, words: 320 },
  { id: 2, date: "April 10, 2025", accuracy: 86, words: 410 },
  { id: 3, date: "April 9, 2025", accuracy: 90, words: 285 }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login", { state: { from: "/dashboard" } });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-accent">Loading your dashboard...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/write-speak")}>New Session</Button>
            <Button variant="outline" onClick={() => navigate("/resources")}>Dyslexia Resources</Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Words Recognized" 
            icon={<BookText className="h-5 w-5" />}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{mockStats.wordsRecognized}</span>
              <span className="text-sm text-muted-foreground">Total words processed</span>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Accuracy Rate" 
            icon={<LineChart className="h-5 w-5" />}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-3xl font-bold">{mockStats.accuracyRate}%</span>
                <span className="text-sm text-muted-foreground">Recognition accuracy</span>
              </div>
              <Progress value={mockStats.accuracyRate} className="h-2" />
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Current Streak" 
            icon={<CalendarCheck className="h-5 w-5" />}
          >
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold mr-2">{mockStats.streakDays}</span>
                <span className="text-base">days</span>
              </div>
              <span className="text-sm text-muted-foreground">Keep it going!</span>
            </div>
          </DashboardCard>
        </div>
        
        {/* Recent Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DashboardCard 
            title="Recent Sessions" 
            description="Your last 3 practice sessions" 
            icon={<PenSquare className="h-5 w-5" />}
          >
            <div className="space-y-4">
              {mockRecentSessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <div>
                    <p className="font-medium">{session.date}</p>
                    <p className="text-sm text-muted-foreground">{session.words} words processed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{session.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Learning Statistics" 
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Time Spent</span>
                </div>
                <span className="font-medium">{Math.floor(mockStats.minutesSpent / 60)} hours {mockStats.minutesSpent % 60} min</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sessions Completed</span>
                </div>
                <span className="font-medium">{mockStats.sessionsCompleted}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BookText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Avg Words per Session</span>
                </div>
                <span className="font-medium">{Math.round(mockStats.wordsRecognized / mockStats.sessionsCompleted)}</span>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => navigate("/resources")}>View Dyslexia Resources</Button>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        {/* Progress Over Time - Placeholder for chart */}
        <DashboardCard
          title="Progress Over Time"
          description="Your learning journey"
          icon={<LineChart className="h-5 w-5" />}
          className="mb-8"
        >
          <div className="h-64 flex items-center justify-center bg-muted/40 rounded">
            <p className="text-muted-foreground">Progress chart will appear here</p>
          </div>
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Dashboard;
