
import React, { useState } from "react";
import Layout from "@/components/Layout";
import Canvas from "@/components/Canvas";
import TextToSpeech from "@/components/TextToSpeech";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpFromLine } from "lucide-react";
import { toast } from "sonner";

const WriteAndSpeak = () => {
  const [recognizedText, setRecognizedText] = useState("");
  const [manualText, setManualText] = useState("");
  const [textToSpeak, setTextToSpeak] = useState("");
  
  // Handle text from handwriting recognition
  const handleCaptureText = (text: string) => {
    setRecognizedText(text);
    setTextToSpeak(text);
    toast.success("Text recognized successfully!");
  };
  
  // Handle text input manually
  const handleManualSubmit = () => {
    setTextToSpeak(manualText);
    toast.success("Text submitted for speech");
  };
  
  // Mock upload function
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you'd send this file to an API for processing
    // For now, we'll simulate recognition with a timeout
    toast.info("Processing your handwriting...");
    
    setTimeout(() => {
      const mockRecognizedText = "This is sample text recognized from your uploaded image. In a production application, this would be the actual text extracted from your handwriting.";
      setRecognizedText(mockRecognizedText);
      setTextToSpeak(mockRecognizedText);
      toast.success("Handwriting processed successfully!");
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Write & Speak</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Write or type your text, and our AI will convert it to speech.
            Perfect for practicing pronunciation and improving reading skills.
          </p>
        </div>
        
        <div className="space-y-8">
          <Tabs defaultValue="draw" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="draw">Draw</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="type">Type</TabsTrigger>
            </TabsList>
            
            <TabsContent value="draw" className="space-y-6">
              <p className="text-sm text-muted-foreground mb-2">
                Use the canvas below to write your text. Our AI will recognize it and convert it to digital text.
              </p>
              <Canvas onCaptureText={handleCaptureText} />
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                    <ArrowUpFromLine className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="mb-4 text-sm text-muted-foreground">
                      Upload an image of your handwriting
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button asChild>
                      <label htmlFor="file-upload">Select Image</label>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="type" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-text">Type your text</Label>
                  <Textarea
                    id="manual-text"
                    placeholder="Type your text here..."
                    className="min-h-32"
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                  />
                </div>
                <Button onClick={handleManualSubmit}>Submit Text</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {recognizedText && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="recognized-text">Recognized Text</Label>
                  <Textarea
                    id="recognized-text"
                    className="min-h-24"
                    value={recognizedText}
                    onChange={(e) => {
                      setRecognizedText(e.target.value);
                      setTextToSpeak(e.target.value);
                    }}
                    placeholder="Recognized text will appear here..."
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {textToSpeak && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Text to Speech</h2>
              <TextToSpeech text={textToSpeak} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WriteAndSpeak;
