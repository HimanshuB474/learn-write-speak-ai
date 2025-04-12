
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Volume2, VolumeX, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";

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
  }, []);
  
  // Play or pause speech
  const toggleSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
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
        
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (isPlaying && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      
      // If we're unmuting, start playing again
      if (isMuted) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (voice) {
          const selectedVoice = availableVoices.find(v => v.name === voice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }
        
        utterance.rate = rate;
        utterance.volume = volume / 100;
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
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
                window.speechSynthesis.cancel();
                setIsPlaying(false);
              }
              
              const utterance = new SpeechSynthesisUtterance(text);
              
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
              
              window.speechSynthesis.speak(utterance);
              setIsPlaying(true);
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
