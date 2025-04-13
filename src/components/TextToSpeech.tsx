
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Play, Pause, Volume2, RotateCcw, Download } from "lucide-react";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  
  // Function to handle TTS generation
  const generateSpeech = async () => {
    try {
      setIsLoading(true);
      
      // For this implementation, we'll use the browser's built-in speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume;
      
      // Start speaking
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      // Events for speech synthesis
      utterance.onstart = () => {
        setIsPlaying(true);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        toast.error("Error generating speech");
      };
      
      // Log the speech generation to Supabase
      try {
        await supabaseClient
          .from('speech_logs')
          .insert({
            speech_text: text
          });
      } catch (dbError) {
        console.error('Error logging speech generation:', dbError);
        // Don't show error to user, this is just for logging
      }
      
    } catch (error) {
      console.error('Error generating speech:', error);
      toast.error("Failed to generate speech");
    } finally {
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
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (isPlaying) {
      speechSynthesis.cancel();
      setTimeout(() => {
        generateSpeech();
      }, 100);
    }
  };
  
  // Clean up speech synthesis when component unmounts
  React.useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);
  
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Listen to the recognized text:
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={togglePlayback}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Play
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={restartAudio}
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Restart</span>
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
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

export default TextToSpeech;
