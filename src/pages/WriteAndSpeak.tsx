
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
import { supabaseClient } from "@/lib/supabaseClient";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const WriteAndSpeak = () => {
  const [recognizedText, setRecognizedText] = useState("");
  const [manualText, setManualText] = useState("");
  const [textToSpeak, setTextToSpeak] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState("en");
  
  // Handle text from handwriting recognition
  const handleCaptureText = (text: string) => {
    if (text) {
      setRecognizedText(text);
      setTextToSpeak(text);
      toast.success("Text recognized successfully!");
    } else {
      toast.error("No text was recognized. Please try again with clearer handwriting.");
    }
  };
  
  // Handle text input manually
  const handleManualSubmit = () => {
    if (manualText.trim()) {
      setTextToSpeak(manualText);
      setRecognizedText(manualText);
      toast.success("Text submitted for speech");
    } else {
      toast.error("Please enter some text first");
    }
  };
  
  // Handle image upload and process with Google Vision API
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    setIsProcessing(true);
    toast.info("Processing your handwriting...");
    
    try {
      // Convert the file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // Call the Supabase Edge Function for handwriting recognition
        const { data, error } = await supabaseClient.functions.invoke('process-handwriting', {
          body: { image: base64data, language }
        });
        
        if (error) {
          console.error('Error processing handwriting:', error);
          toast.error('Failed to process handwriting');
          setIsProcessing(false);
          return;
        }
        
        // Extract the recognized text
        const extractedText = data.text;
        
        if (extractedText && extractedText.trim() !== '') {
          setRecognizedText(extractedText);
          setTextToSpeak(extractedText);
          toast.success('Handwriting processed successfully!');
        } else {
          toast.error('No text was recognized. Please try again with clearer handwriting.');
        }
        
        setIsProcessing(false);
      };
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('An error occurred while processing your image');
      setIsProcessing(false);
    }
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
        
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="language-select" className="whitespace-nowrap">Language:</Label>
            <Select 
              value={language} 
              onValueChange={setLanguage}
            >
              <SelectTrigger id="language-select" className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {language === "en" ? 
              "Currently set to recognize English text" : 
              "वर्तमान में हिंदी पाठ को पहचानने के लिए सेट है"
            }
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
              <Canvas onCaptureText={handleCaptureText} language={language} />
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
                      disabled={isProcessing}
                    />
                    <Button asChild disabled={isProcessing}>
                      <label htmlFor="file-upload">
                        {isProcessing ? "Processing..." : "Select Image"}
                      </label>
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
