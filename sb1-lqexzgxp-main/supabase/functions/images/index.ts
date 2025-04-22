import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = 15;

    // Mock response for development
    const mockResponse = {
      page,
      per_page: perPage,
      photos: Array.from({ length: 15 }, (_, i) => ({
        id: `mock-${i + (page - 1) * perPage}`,
        width: 1200,
        height: 800,
        url: `https://example.com/photo-${i + (page - 1) * perPage}`,
        photographer: `Photographer ${i + (page - 1) * perPage}`,
        photographer_url: "https://www.pexels.com/photographer",
        photographer_id: 12345,
        avg_color: "#FFFFFF",
        src: {
          original: `https://images.pexels.com/photos/${3000000 + i + (page - 1) * perPage}/pexels-photo-${3000000 + i + (page - 1) * perPage}.jpeg`,
          large2x: `https://images.pexels.com/photos/${3000000 + i + (page - 1) * perPage}/pexels-photo-${3000000 + i + (page - 1) * perPage}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`,
          large: `https://images.pexels.com/photos/${3000000 + i + (page - 1) * perPage}/pexels-photo-${3000000 + i + (page - 1) * perPage}.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
          medium: `https://images.pexels.com/photos/${3000000 + i + (page - 1) * perPage}/pexels-photo-${3000000 + i + (page - 1) * perPage}.jpeg?auto=compress&cs=tinysrgb&h=350`,
          small: `https://images.pexels.com/photos/${3000000 + i + (page - 1) * perPage}/pexels-photo-${3000000 + i + (page - 1) * perPage}.jpeg?auto=compress&cs=tinysrgb&h=130`,
          portrait: `https://images.pexels.com/photos/${3000000 + i + (page - 1) * perPage}/pexels-photo-${3000000 + i + (page - 1) * perPage}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800`,
          landscape: `https://images.pexels.com/photos/${3000000 + i + (page - 1) * perPage}/pexels-photo-${3000000 + i + (page - 1) * perPage}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
          tiny: `https://images.pexels.com/photos/${3000000 + i + (page - 1) * perPage}/pexels-photo-${3000000 + i + (page - 1) * perPage}.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280`
        },
        liked: false,
        alt: `Mock image ${i + (page - 1) * perPage}`
      })),
      total_results: 1000,
      next_page: page < 10 ? `https://api.pexels.com/v1/search?page=${page + 1}&per_page=${perPage}&query=${query}` : null
    };

    return new Response(
      JSON.stringify(mockResponse),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});