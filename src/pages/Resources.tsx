
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExternalLink, PhoneCall, FilePlus, Globe, BookOpen, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth";

const Resources = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login", { state: { from: "/resources" } });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-accent">Loading resources...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const organizations = [
    {
      name: "International Dyslexia Association",
      description: "Provides resources, advocacy, and support for individuals with dyslexia.",
      website: "https://dyslexiaida.org/",
      phone: "+1-410-296-0232"
    },
    {
      name: "National Center for Learning Disabilities",
      description: "Advocates for equal access to educational and work opportunities for those with learning disabilities.",
      website: "https://www.ncld.org/",
      phone: "+1-888-575-7373"
    },
    {
      name: "Dyslexia Action",
      description: "Provides support and services for people with literacy and learning difficulties.",
      website: "https://www.dyslexiaaction.org.uk/",
      phone: "+44-1784-222300"
    }
  ];

  const tips = [
    {
      title: "Use Multi-sensory Learning",
      description: "Engage multiple senses—seeing, hearing, touching—when learning to read or write new material."
    },
    {
      title: "Break Tasks Into Chunks",
      description: "Divide reading or writing assignments into smaller, more manageable parts."
    },
    {
      title: "Use Assistive Technology",
      description: "Text-to-speech and speech-to-text tools can help overcome reading and writing challenges."
    },
    {
      title: "Create a Structured Environment",
      description: "Establish routines, organize materials, and create a quiet study space to minimize distractions."
    },
    {
      title: "Practice Regularly",
      description: "Consistent practice with reading and writing skills is essential for improvement."
    },
    {
      title: "Embrace Strengths",
      description: "Focus on strengths and interests, which can build confidence and motivation."
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dyslexia Resources</h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tips">Tips & Strategies</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="professionals">Find Help</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Dyslexia</CardTitle>
                <CardDescription>What dyslexia is and how it affects learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-lg">What is Dyslexia?</h3>
                  <p>
                    Dyslexia is a learning disorder that involves difficulty reading due to problems identifying 
                    speech sounds and learning how they relate to letters and words. Also called reading disability, 
                    dyslexia is a result of individual differences in areas of the brain that process language.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Common Signs of Dyslexia</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Difficulty reading fluently</li>
                    <li>Slow reading and writing</li>
                    <li>Problems spelling</li>
                    <li>Avoiding activities that involve reading</li>
                    <li>Mispronouncing names or words</li>
                    <li>Trouble understanding jokes or expressions that have meanings not easily understood from the specific words</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Important to Remember</h3>
                  <p>
                    Dyslexia is not related to intelligence. Most people with dyslexia have normal intelligence, 
                    and many have above-average intelligence. With the right support and evidence-based teaching methods, 
                    almost all people with dyslexia can learn to read.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="flex items-center gap-2" variant="outline" asChild>
                  <a href="https://www.mayoclinic.org/diseases-conditions/dyslexia/symptoms-causes/syc-20353552" target="_blank" rel="noreferrer">
                    <BookOpen className="h-4 w-4" />
                    <span>Learn more</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Events & Workshops
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Join upcoming events and workshops focused on dyslexia awareness, support, and education.</p>
                  <ul className="space-y-3">
                    <li className="border-b pb-2">
                      <p className="font-medium">Dyslexia Awareness Month</p>
                      <p className="text-sm text-muted-foreground">October 2025</p>
                    </li>
                    <li className="border-b pb-2">
                      <p className="font-medium">Parent Support Group Meetings</p>
                      <p className="text-sm text-muted-foreground">First Tuesday of each month</p>
                    </li>
                    <li>
                      <p className="font-medium">Teacher Training Workshops</p>
                      <p className="text-sm text-muted-foreground">Quarterly sessions</p>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">View All Events</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FilePlus className="h-5 w-5" />
                    Helpful Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Access guides, articles, and resources to support individuals with dyslexia.</p>
                  <ul className="space-y-3">
                    <li className="border-b pb-2">
                      <p className="font-medium">Dyslexia Fact Sheet</p>
                      <p className="text-sm text-muted-foreground">Basic information and statistics</p>
                    </li>
                    <li className="border-b pb-2">
                      <p className="font-medium">Teacher's Guide to Dyslexia</p>
                      <p className="text-sm text-muted-foreground">Classroom strategies and accommodations</p>
                    </li>
                    <li>
                      <p className="font-medium">Parent's Handbook</p>
                      <p className="text-sm text-muted-foreground">Supporting your child at home and school</p>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">Browse Resources</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            <div className="space-y-6">
              {organizations.map((org, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{org.name}</CardTitle>
                    <CardDescription>{org.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={org.website} target="_blank" rel="noreferrer" className="text-accent hover:underline flex items-center">
                        {org.website} <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="h-4 w-4 text-muted-foreground" />
                      <span>{org.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="professionals">
            <Card>
              <CardHeader>
                <CardTitle>Finding Professional Help</CardTitle>
                <CardDescription>How to connect with specialists who can assist with dyslexia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Types of Specialists</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><span className="font-medium">Educational Psychologists:</span> Conduct assessments to diagnose dyslexia and other learning disabilities.</li>
                    <li><span className="font-medium">Specialized Tutors:</span> Provide structured literacy instruction using evidence-based methods.</li>
                    <li><span className="font-medium">Speech-Language Pathologists:</span> Help with language processing and phonological awareness.</li>
                    <li><span className="font-medium">Occupational Therapists:</span> Assist with handwriting and fine motor skills challenges.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">How to Find Help</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Consult with your primary care physician for referrals.</li>
                    <li>Contact your school's special education department.</li>
                    <li>Reach out to dyslexia organizations for provider directories.</li>
                    <li>Join support groups to get recommendations from other families.</li>
                  </ol>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Questions to Ask Potential Specialists</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>What is your experience with dyslexia?</li>
                    <li>What methods do you use for assessment or intervention?</li>
                    <li>How do you measure progress?</li>
                    <li>How do you collaborate with schools or other professionals?</li>
                    <li>What is your fee structure and do you accept insurance?</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://dyslexiaida.org/provider-directory/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                    <span>Find a Provider Directory</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Resources;
