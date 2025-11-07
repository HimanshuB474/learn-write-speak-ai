import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser compatibility
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle preflight requests
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  return null;
}

// Process handwriting using Lovable AI
async function processHandwriting(imageBase64: string, language: string = "en") {
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing handwriting with language: ${language}`);
    
    // Prepare the prompt based on language
    const prompt = language === "hi" 
      ? "Extract and transcribe all Hindi text from this handwritten image. Return only the recognized text without any additional commentary."
      : "Extract and transcribe all English text from this handwritten image. Return only the recognized text without any additional commentary.";

    // Call Lovable AI with vision capabilities
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (response.status === 402) {
        throw new Error("Payment required. Please add credits to your workspace.");
      }
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI processing error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Lovable AI response received");
    
    // Extract recognized text from response
    const recognizedText = data.choices?.[0]?.message?.content || "";
    
    return recognizedText;
  } catch (error) {
    console.error("Error processing handwriting:", error);
    throw new Error(`Failed to process handwriting: ${error.message}`);
  }
}

// Main handler
serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { image, language = "en" } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Processing handwriting request with language: ${language}...`);
    
    // Process the image with Lovable AI
    const recognizedText = await processHandwriting(image, language);
    console.log("Recognized text:", recognizedText ? "Text found" : "No text found");

    // Return the recognized text
    return new Response(
      JSON.stringify({ text: recognizedText }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
