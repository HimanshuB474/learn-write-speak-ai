
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

// Google Cloud Vision API configuration
const GOOGLE_VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";
const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "personal-456419",
  "private_key_id": "6cf8d4198dba6d4ccb2287f0012b6deb5382c186",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnh/Vn9sxG+9ap\nfmEesP+n2zURs7doeZpK7Ibwvowf+f3ZyNKNKNEII/43hU28Ax7P05efp+akJMiV\nRz3KAL2qzMb0U5acZFXXJ6DfRMA4beSTHD5+e+3BLlu0ZyS7AmVNh+PGW2nyEhj6\nP4RINoOA6ziF5TdvB0Q509IvSDu7pUIsHNaeKFLV4D7VTF8poYshbOgEH4TJh+lu\nA6O7OdYQxoUhf0ive+tMsF9UvEq3asm+UHTrYGolikSgNUJqkMxFQ1Z+J/jc0rog\nzWLxOJoHgwT8rMU/J/9I+5yVo6AsXLZYzB4wy1n5geCHehz6AnEO6ekS3htqgwHV\nLmbB/cVLAgMBAAECggEABCbCVgkvlrK25wxSq8gHDcnIzt99NAGPaTvjPCP8pO40\n9CidzxGr3F/H9OhAvN/26396ymIGvRqMPea+CTtrd8gLRhKsMMPrvKEmw2GYwc03\nVM3mXowDoD3d1+KWbmvoxrsPUeMCBRWduNXKGWAAcjlh9S9w6Ddt4WD2XGWV1ViA\nsgUTL3BspgWr2lTNDRlAORTO7/yQPwOTYB3r6d2lq3WuIarnxe1/0GMH3QUHxSr7\nFLmVidMPQkkGh89+DWRhDxFXsN3CTZ5U467wySHWISlXbnMOHqhj5BK7uRN9WbAN\nY1UadxqLBd3H5KHskostGQB2i/FCawhSh5Fm/9LoAQKBgQDlZNCbkk7GNqhVJQcX\nrcQcjX4KxD2EqNBaE2uWI3lf9fGwmrR2EGQQ3B+gdIhewIvoB1YGbSOWN7IHL+l0\nKzbQy4LvcvDBPvrm+WkqZNplggOGpWDR5HoBYpptgmvQcLOnBpHfXqdeLOHgvlub\npcPT1aNGCGDvbwyjIAEqbCNFgQKBgQC69k8xgdKZekgC6OqUHEpOruJAHory8/oF\nUE0DiaJEv4FZCwrpMIw6nYQYZ6Dhh3YsKkM3uqzkveDwYXmKo9rbZ7fFRuN8cZrl\nwKPU6UZcZ1C9bZqtuX7uEDZW1Em29NGPaw50YmAuLZoMBBqIMPlPo5dq29wC83bB\nFuvimumoywKBgFbOL6KvWt/nDwwpVuW++9dSM8AfQqhQuYdckfnesq99glgyMtf6\nm+NFaTJu5qv0cPz8ybDk2/KcYOIXX2B2eefJG2NBO5nlG00MVJ+WSo7fBDaPnnPO\n4dxkU8vc7q+R9mneMpU0XGFm2pMRddkQgWpIDeESipwQidew5MAI69ABAoGAGUUV\nayGa73ehqBMHMcGpIX1twzDdovzq/DDgV+wQbK5ds0VU0jPnoDyOECZhjloa1NlZ\ngHzQxZIMhzEFloGTITihlB6CvN02DHu/KRXmlrK4LQJVd8msqEy0q4PB+uKYOIRF\nzeFGErfDLICZfXLxH5yC6MSStitmD68jbtt1XYUCgYEAvg/LVgrE+eDv6OH8Rkbz\nzJ46dINxSt/rk7b7FYuOrCcDBl+yRYpFrMNLTTWT9dIeq7q60RPRH5zk53/t2adq\n+jlngGwWhdLGisJT4rYByU/J8Mf9a3dTU40rEo0umM=\n-----END PRIVATE KEY-----\n",
  "client_email": "vision-vis@personal-456419.iam.gserviceaccount.com",
  "client_id": "113867634749030162196",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/vision-vis%40personal-456419.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Generate a JWT token for Google API authentication
async function generateGoogleAccessToken() {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: SERVICE_ACCOUNT.client_email,
    scope: "https://www.googleapis.com/auth/cloud-vision",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600, // 1 hour
    iat: now,
  };

  // Encode header and payload
  const encoder = new TextEncoder();
  const headerBase64 = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const payloadBase64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const toSign = encoder.encode(`${headerBase64}.${payloadBase64}`);

  // Convert private key for signing
  const privateKey = SERVICE_ACCOUNT.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, ""); // Remove all whitespace including newlines

  const binaryKey = Uint8Array.from(atob(privateKey), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  // Sign the JWT
  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    cryptoKey,
    toSign
  );

  // Convert signature to base64url
  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Create signed JWT
  const jwt = `${headerBase64}.${payloadBase64}.${signatureBase64}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.text();
    console.error("Token exchange error:", errorData);
    throw new Error(`Failed to exchange JWT: ${tokenResponse.status} ${errorData}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Process image with Google Vision API
async function processHandwriting(imageBase64: string, language: string = "en") {
  try {
    const accessToken = await generateGoogleAccessToken();
    console.log("Successfully generated Google access token");
    
    // Clean up base64 data
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    
    // Define language hints based on the selected language
    const languageHints = language === "hi" ? 
      ["hi-t-i0-handwrit", "hi"] : 
      ["en-t-i0-handwrit", "en"];
    
    console.log(`Processing with language hints: ${languageHints.join(", ")}`);
    
    const requestBody = {
      requests: [
        {
          image: {
            content: cleanBase64,
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION",
              maxResults: 10,
            },
          ],
          imageContext: {
            languageHints: languageHints
          }
        },
      ],
    };

    console.log("Sending request to Vision API...");
    const response = await fetch(GOOGLE_VISION_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vision API error response:", errorText);
      throw new Error(`Vision API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Log the response for debugging
    console.log("Vision API response received");
    
    // Extract text from response - first try fullTextAnnotation for better formatting
    let recognizedText = data.responses[0]?.fullTextAnnotation?.text;
    
    // If no text was found with fullTextAnnotation, try textAnnotations
    if (!recognizedText) {
      recognizedText = data.responses[0]?.textAnnotations?.[0]?.description || "";
    }
    
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
    
    // Process the image with Google Vision API with the specified language
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
