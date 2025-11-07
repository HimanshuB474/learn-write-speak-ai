
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
import { supabase } from "@/integrations/supabase/client";
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
  
  // Translations for UI elements
  const translations = {
    en: {
      title: "Write & Speak",
      subtitle: "Write or type your text, and our AI will convert it to speech. Perfect for practicing pronunciation and improving reading skills.",
      languageLabel: "Language:",
      languageHint: "Currently set to recognize English text",
      drawTab: "Draw",
      uploadTab: "Upload",
      typeTab: "Type",
      drawDescription: "Use the canvas below to write your text. Our AI will recognize it and convert it to digital text.",
      uploadTitle: "Upload an image of your handwriting",
      selectImage: "Select Image",
      processing: "Processing...",
      typeLabel: "Type your text",
      typePlaceholder: "Type your text here...",
      submitText: "Submit Text",
      recognizedTextLabel: "Recognized Text",
      recognizedTextPlaceholder: "Recognized text will appear here...",
      textToSpeechTitle: "Text to Speech",
      noTextError: "Please enter some text first",
      textSubmitted: "Text submitted for speech",
      successRecognition: "Text recognized successfully!",
      failedRecognition: "No text was recognized. Please try again with clearer handwriting."
    },
    hi: {
      title: "लिखें और बोलें",
      subtitle: "अपना टेक्स्ट लिखें या टाइप करें, और हमारा AI इसे भाषण में बदल देगा। उच्चारण का अभ्यास करने और पढ़ने के कौशल को बेहतर बनाने के लिए बिल्कुल सही।",
      languageLabel: "भाषा:",
      languageHint: "वर्तमान में हिंदी पाठ को पहचानने के लिए सेट है",
      drawTab: "आरेख",
      uploadTab: "अपलोड",
      typeTab: "टाइप",
      drawDescription: "अपना टेक्स्ट लिखने के लिए नीचे दिए गए कैनवास का उपयोग करें। हमारा AI इसे पहचान कर डिजिटल टेक्स्ट में बदल देगा।",
      uploadTitle: "अपनी हस्तलिखित छवि अपलोड करें",
      selectImage: "छवि चुनें",
      processing: "प्रसंस्करण हो रहा है...",
      typeLabel: "अपना टेक्स्ट टाइप करें",
      typePlaceholder: "अपना टेक्स्ट यहां टाइप करें...",
      submitText: "टेक्स्ट सबमिट करें",
      recognizedTextLabel: "पहचाना गया टेक्स्ट",
      recognizedTextPlaceholder: "पहचाना गया टेक्स्ट यहां दिखाई देगा...",
      textToSpeechTitle: "टेक्स्ट से भाषण",
      noTextError: "कृपया पहले कुछ टेक्स्ट दर्ज करें",
      textSubmitted: "भाषण के लिए टेक्स्ट सबमिट किया गया",
      successRecognition: "टेक्स्ट सफलतापूर्वक पहचाना गया!",
      failedRecognition: "कोई टेक्स्ट नहीं पहचाना गया। कृपया स्पष्ट हस्तलेखन के साथ फिर से प्रयास करें।"
    }
  };
  
  // Current language translations
  const t = translations[language as keyof typeof translations];
  
  // Handle text from handwriting recognition
  const handleCaptureText = (text: string) => {
    if (text) {
      setRecognizedText(text);
      setTextToSpeak(text);
      toast.success(t.successRecognition);
    } else {
      toast.error(t.failedRecognition);
    }
  };
  
  // Handle text input manually
  const handleManualSubmit = () => {
    if (manualText.trim()) {
      setTextToSpeak(manualText);
      setRecognizedText(manualText);
      toast.success(t.textSubmitted);
    } else {
      toast.error(t.noTextError);
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
        
        // Call the Supabase Edge Function for handwriting recognition with language parameter
        const { data, error } = await supabase.functions.invoke('process-handwriting', {
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
          toast.success(t.successRecognition);
        } else {
          toast.error(t.failedRecognition);
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
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="language-select" className="whitespace-nowrap">{t.languageLabel}</Label>
            <Select 
              value={language} 
              onValueChange={setLanguage}
            >
              <SelectTrigger id="language-select" className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t.languageHint}
          </p>
        </div>
        
        <div className="space-y-8">
          <Tabs defaultValue="draw" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="draw">{t.drawTab}</TabsTrigger>
              <TabsTrigger value="upload">{t.uploadTab}</TabsTrigger>
              <TabsTrigger value="type">{t.typeTab}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="draw" className="space-y-6">
              <p className="text-sm text-muted-foreground mb-2">
                {t.drawDescription}
              </p>
              <Canvas onCaptureText={handleCaptureText} language={language} />
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                    <ArrowUpFromLine className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="mb-4 text-sm text-muted-foreground">
                      {t.uploadTitle}
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
                        {isProcessing ? t.processing : t.selectImage}
                      </label>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="type" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-text">{t.typeLabel}</Label>
                  <Textarea
                    id="manual-text"
                    placeholder={t.typePlaceholder}
                    className="min-h-32"
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    dir={language === "hi" ? "auto" : "ltr"}
                  />
                </div>
                <Button onClick={handleManualSubmit}>{t.submitText}</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {recognizedText && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="recognized-text">{t.recognizedTextLabel}</Label>
                  <Textarea
                    id="recognized-text"
                    className="min-h-24"
                    value={recognizedText}
                    onChange={(e) => {
                      setRecognizedText(e.target.value);
                      setTextToSpeak(e.target.value);
                    }}
                    placeholder={t.recognizedTextPlaceholder}
                    dir={language === "hi" ? "auto" : "ltr"}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {textToSpeak && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">{t.textToSpeechTitle}</h2>
              <TextToSpeech text={textToSpeak} language={language} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WriteAndSpeak;
