
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface TextToSpeechProps {
  text: string;
  language?: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, language = "en" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to handle TTS generation
  const generateSpeech = async () => {
    try {
      setIsLoading(true);
      
      // Configure the speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume;
      
      // Set language based on the selected option
      if (language === "hi") {
        utterance.lang = "hi-IN"; // Hindi language code
      } else {
        utterance.lang = "en-US"; // Default to English
      }
      
      // Find appropriate voice based on language
      const voices = window.speechSynthesis.getVoices();
      const languageVoices = voices.filter(voice => 
        language === "hi" ? voice.lang.includes("hi") : voice.lang.includes("en")
      );
      
      if (languageVoices.length > 0) {
        utterance.voice = languageVoices[0];
      }
      
      // Start speaking
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      // Events for speech synthesis
      utterance.onstart = () => {
        setIsPlaying(true);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsLoading(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsLoading(false);
        toast.error(language === "hi" ? "आवाज़ उत्पन्न करने में त्रुटि" : "Error generating speech");
      };
      
      
    } catch (error) {
      console.error('Error generating speech:', error);
      toast.error(language === "hi" ? "आवाज़ उत्पन्न करने में विफल" : "Failed to generate speech");
      setIsLoading(false);
    }
  };
  
  // Function to play/pause audio
  const togglePlayback = () => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        generateSpeech();
      }
      setIsPlaying(true);
    }
  };
  
  // Function to restart audio
  const restartAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setTimeout(() => {
      generateSpeech();
    }, 100);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (isPlaying) {
      speechSynthesis.cancel();
      setTimeout(() => {
        generateSpeech();
      }, 100);
    }
  };
  
  // Load available voices when component mounts
  React.useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    
    // Some browsers need this event listener to load voices
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      speechSynthesis.cancel();
    };
  }, []);
  
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        {language === "hi" ? "पहचाने गए टेक्स्ट को सुनें:" : "Listen to the recognized text:"}
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={togglePlayback}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? (
            <span>{language === "hi" ? "लोड हो रहा है..." : "Loading..."}</span>
          ) : isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> {language === "hi" ? "रोकें" : "Pause"}
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> {language === "hi" ? "चलाएं" : "Play"}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={restartAudio}
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">{language === "hi" ? "पुनः प्रारंभ करें" : "Restart"}</span>
        </Button>
        
        <div className="flex items-center gap-2 min-w-[150px] max-w-[200px]">
          <Volume2 className="h-4 w-4" />
          <Slider
            defaultValue={[volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
      
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-sm" dir={language === "hi" ? "auto" : "ltr"}>{text}</p>
      </div>
    </div>
  );
};

export default TextToSpeech;
