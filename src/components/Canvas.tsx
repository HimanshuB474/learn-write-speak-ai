
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Download, Trash2, PenTool } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CanvasProps {
  onCaptureText: (text: string) => void;
  language?: string;
}

const Canvas: React.FC<CanvasProps> = ({ onCaptureText, language = "en" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Translations for UI elements
  const translations = {
    en: {
      pen: "Pen",
      eraser: "Eraser",
      clear: "Clear",
      save: "Save",
      recognizeText: "Recognize Text",
      processing: "Processing...",
    },
    hi: {
      pen: "कलम",
      eraser: "इरेज़र",
      clear: "साफ़ करें",
      save: "सहेजें",
      recognizeText: "टेक्स्ट पहचानें",
      processing: "प्रसंस्करण हो रहा है...",
    }
  };
  
  // Get current language translations
  const t = translations[language as keyof typeof translations];
  
  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    
    // Set canvas dimensions
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Set default styles - must be set AFTER changing canvas size
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "black";
      context.lineWidth = 3;
      context.globalCompositeOperation = "source-over";
      
      // Fill with white background for better OCR results
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Reset stroke style after fill
      context.strokeStyle = "black";
    };
    
    resize();
    window.addEventListener("resize", resize);
    setCtx(context);
    
    return () => window.removeEventListener("resize", resize);
  }, []);
  
  // Handle mouse/touch events
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    if (!ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "black";
    }
    
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    if (!ctx) return;
    ctx.closePath();
  };
  
  // Get coordinates regardless of mouse or touch event
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event - prevent default scrolling
      if (e.touches.length === 0) return { offsetX: 0, offsetY: 0 };
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };
  
  // Clear the canvas
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    // Refill with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };
  
  // Save the canvas as image
  const saveImage = () => {
    if (!canvasRef.current) return;
    
    const dataURL = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "handwriting.png";
    link.href = dataURL;
    link.click();
  };
  
  // Process handwriting using Google Vision API via Supabase edge function
  const processHandwriting = async () => {
    if (!canvasRef.current) return;
    
    try {
      setIsProcessing(true);
      toast.info("Processing your handwriting...");
      
      // Get the image data
      const dataURL = canvasRef.current.toDataURL("image/png");
      
      // Call the Supabase Edge Function for handwriting recognition with language parameter
      const { data, error } = await supabase.functions.invoke('process-handwriting', {
        body: { image: dataURL, language }
      });
      
      if (error) {
        console.error('Error processing handwriting:', error);
        toast.error('Failed to process handwriting');
        setIsProcessing(false);
        return;
      }
      
      // Extract the recognized text
      const recognizedText = data.text;
      
      if (recognizedText && recognizedText.trim() !== '') {
        onCaptureText(recognizedText);
      } else {
        toast.error(language === "hi" ? 
          "कोई टेक्स्ट नहीं पहचाना गया। कृपया स्पष्ट हस्तलेखन के साथ फिर से प्रयास करें।" : 
          "No text was recognized. Please try again with clearer handwriting."
        );
      }
      
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing handwriting:', error);
      toast.error(language === "hi" ? 
        "आपके हस्तलेखन को संसाधित करते समय एक त्रुटि हुई" : 
        "An error occurred while processing your handwriting"
      );
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="canvas-container bg-white border-2 border-gray-300 rounded-md h-[300px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full touch-none"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant={tool === "pen" ? "default" : "outline"}
            onClick={() => setTool("pen")}
            size="sm"
          >
            <PenTool className="h-4 w-4 mr-2" />
            {t.pen}
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            onClick={() => setTool("eraser")}
            size="sm"
          >
            <Eraser className="h-4 w-4 mr-2" />
            {t.eraser}
          </Button>
          <Button
            variant="outline"
            onClick={clearCanvas}
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t.clear}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={saveImage}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {t.save}
          </Button>
          <Button 
            onClick={processHandwriting}
            size="sm"
            disabled={isProcessing}
          >
            {isProcessing ? t.processing : t.recognizeText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
