import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Volume2, VolumeX, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Set a default voice if available
        if (voices.length > 0 && !voice) {
          const defaultVoice = voices.find(v => v.default) || voices[0];
          setVoice(defaultVoice.name);
        }
      };
      
      // Chrome requires this to be called this way
      speechSynthesis.addEventListener("voiceschanged", updateVoices);
      updateVoices(); // For browsers that load voices immediately
      
      return () => {
        speechSynthesis.removeEventListener("voiceschanged", updateVoices);
        if (isPlaying) {
          window.speechSynthesis.cancel();
        }
      };
    }
    
    // Create audio element
    const audio = new Audio();
    audio.onended = () => setIsPlaying(false);
    setAudioElement(audio);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);
  
  // Effect to update audio element when the URL changes
  useEffect(() => {
    if (audioElement && audioUrl) {
      audioElement.src = audioUrl;
      audioElement.volume = isMuted ? 0 : volume / 100;
      audioElement.playbackRate = rate;
    }
  }, [audioUrl, audioElement]);
  
  // Generate TTS audio
  const generateSpeech = async () => {
    // In a production app, you would send this to your Supabase Edge Function
    // which would call an external TTS API like ElevenLabs or AWS Polly
    
    // For now, we'll use the browser's built-in speech synthesis
    // but structure the code to make it easy to swap in a real API later
    
    try {
      // Show toast to indicate processing
      toast.info("Generating speech...");
      
      // In a real implementation, you would call your Supabase function:
      /*
      const { data, error } = await supabaseClient.functions.invoke('generate-speech', {
        body: { 
          text, 
          voice: voice, 
          speed: rate 
        }
      });
      
      if (error) throw error;
      setAudioUrl(data.audioUrl);
      */
      
      // For now, we'll continue to use the browser's speech synthesis
      if (window.speechSynthesis) {
        // Clear any previous audio URL
        setAudioUrl(null);
        
        // Use the browser's speech synthesis
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice if selected
        if (voice) {
          const selectedVoice = availableVoices.find(v => v.name === voice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }
        
        utterance.rate = rate;
        utterance.volume = isMuted ? 0 : volume / 100;
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        
        // Log speech generation to Supabase for analytics
        logSpeechGeneration();
      }
      
    } catch (error) {
      console.error("Error generating speech:", error);
      toast.error("Failed to generate speech");
    }
  };
  
  // Log speech generation to Supabase
  const logSpeechGeneration = async () => {
    try {
      const { error } = await supabaseClient
        .from('speech_logs')
        .insert({
          text_length: text.length,
          voice: voice,
          rate: rate,
          timestamp: new Date().toISOString()
        });
        
      if (error) {
        console.error("Error logging speech generation:", error);
      }
    } catch (error) {
      console.error("Error logging to Supabase:", error);
    }
  };
  
  // Toggle play/pause
  const toggleSpeech = () => {
    if (audioElement && audioUrl) {
      // If we have an audio URL, use the audio element
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    } else {
      // Otherwise use the browser's speech synthesis
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        generateSpeech();
      }
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioElement) {
      audioElement.volume = isMuted ? volume / 100 : 0;
    } else if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      
      if (isMuted) {
        // If we're unmuting, restart speech
        generateSpeech();
      }
    }
  };
  
  return (
    <div className="bg-card p-5 rounded-lg border shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={toggleSpeech}
            variant="default"
            size="sm"
            className="flex-shrink-0"
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            onClick={() => {
              if (isPlaying) {
                if (audioElement && audioUrl) {
                  audioElement.pause();
                  audioElement.currentTime = 0;
                } else {
                  window.speechSynthesis.cancel();
                }
                setIsPlaying(false);
              }
              
              // Small delay before restarting
              setTimeout(() => {
                if (audioElement && audioUrl) {
                  audioElement.currentTime = 0;
                  audioElement.play();
                  setIsPlaying(true);
                } else {
                  generateSpeech();
                }
              }, 10);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between mb-2">
              <Label htmlFor="voice-select">Voice</Label>
            </div>
            <Select
              value={voice}
              onValueChange={setVoice}
            >
              <SelectTrigger id="voice-select" className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {availableVoices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="volume-slider">Volume: {volume}%</Label>
            </div>
            <Slider
              id="volume-slider"
              min={0}
              max={100}
              step={1}
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              disabled={isMuted}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rate-slider">Speed: {rate.toFixed(1)}</Label>
            </div>
            <Slider
              id="rate-slider" 
              min={0.5}
              max={2}
              step={0.1}
              value={[rate]}
              onValueChange={(value) => setRate(value[0])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
