
import React from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { BookOpen, PenTool, BarChart3, MicCheck } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            AI-Powered Learning Aid for 
            <span className="text-accent"> Dyslexia</span> & Learning Disabilities
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform helps improve literacy, comprehension, and communication 
            through AI handwriting recognition and natural text-to-speech.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link to="/write-speak">
                Try It Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-muted/40 rounded-3xl my-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div className="bg-card rounded-xl p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <PenTool className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Write</h3>
              <p className="text-muted-foreground">
                Use our digital canvas to write text, or upload images of your handwriting.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Recognize</h3>
              <p className="text-muted-foreground">
                Our AI recognizes your handwriting and suggests corrections, improving clarity.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <MicCheck className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-medium mb-2">Listen</h3>
              <p className="text-muted-foreground">
                Hear your text read aloud with natural-sounding speech in multiple languages.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold">Built for All Learning Styles</h2>
              <div className="space-y-4 dyslexia-friendly">
                <p>
                  Our application is designed to help students, educators, and individuals 
                  with dyslexia and other learning disabilities overcome barriers to literacy 
                  and comprehension.
                </p>
                <p>
                  The platform adapts to your unique learning needs, providing real-time 
                  feedback, correction suggestions, and multiple ways to engage with text.
                </p>
              </div>
              <Button asChild>
                <Link to="/register">
                  Start Learning Today
                </Link>
              </Button>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-secondary/10 rounded-2xl p-6 md:p-8 aspect-square md:aspect-auto flex items-center justify-center">
                <div className="animate-float">
                  <BarChart3 className="h-48 w-48 text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
