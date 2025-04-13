
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Download, Trash2, PenTool, Upload } from "lucide-react";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface CanvasProps {
  onCaptureText: (text: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ onCaptureText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [isProcessing, setIsProcessing] = useState(false);
  
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
      
      // Set default styles
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "black";
      context.lineWidth = 3;
    };
    
    resize();
    window.addEventListener("resize", resize);
    setCtx(context);
    
    return () => window.removeEventListener("resize", resize);
  }, []);
  
  // Handle mouse/touch events
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    if (!ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
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
      // Touch event
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
  
  // Process handwriting using the Supabase backend
  const processHandwriting = async () => {
    if (!canvasRef.current) return;
    
    try {
      setIsProcessing(true);
      toast.info("Processing your handwriting...");
      
      // Get the image data
      const dataURL = canvasRef.current.toDataURL("image/png");
      const base64Data = dataURL.split(',')[1];
      
      // Generate a unique filename
      const filename = `handwriting_${Date.now()}.png`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('handwriting-images')
        .upload(filename, decode(base64Data), {
          contentType: 'image/png',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error('Failed to upload image for processing');
        setIsProcessing(false);
        return;
      }
      
      // Get a public URL for the uploaded file
      const { data: publicUrlData } = supabaseClient.storage
        .from('handwriting-images')
        .getPublicUrl(filename);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // Call the handwriting recognition function via Supabase Edge Function
      // Note: In a real implementation, you would create this Edge Function in Supabase
      // For now, we'll simulate a response with a timeout
      
      // Simulate API processing time
      setTimeout(() => {
        // Sample recognized text (in a real implementation, this would come from the OCR service)
        const recognizedText = "This is sample text recognized from your handwriting. In a production environment, this would be the actual text extracted by an OCR service.";
        
        onCaptureText(recognizedText);
        toast.success('Handwriting processed successfully!');
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error processing handwriting:', error);
      toast.error('An error occurred while processing your handwriting');
      setIsProcessing(false);
    }
  };
  
  // Helper function to decode Base64 to binary
  const decode = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
  };
  
  return (
    <div className="space-y-4">
      <div className="canvas-container bg-white">
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
            Pen
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            onClick={() => setTool("eraser")}
            size="sm"
          >
            <Eraser className="h-4 w-4 mr-2" />
            Eraser
          </Button>
          <Button
            variant="outline"
            onClick={clearCanvas}
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={saveImage}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button 
            onClick={processHandwriting}
            size="sm"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Recognize Text"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
