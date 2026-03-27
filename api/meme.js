import { ImageResponse } from '@vercel/og';

// Config untuk Edge Function
export const config = {
  runtime: 'edge',
};

// Font fallback untuk emoji
const emojiFont = 'Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji';

// Helper: buat text shadow
function createShadow(width, color) {
  const w = Math.min(Math.max(Number(width) || 4, 1), 10);
  const c = color || '#000000';
  const shadows = [];
  for (let x = -w; x <= w; x++) {
    for (let y = -w; y <= w; y++) {
      if (x !== 0 || y !== 0) {
        shadows.push(`${x}px ${y}px 0 ${c}`);
      }
    }
  }
  return shadows.join(', ');
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    // Get parameters dengan validasi
    const imageUrl = params.get('imageUrl');
    const topText = (params.get('topText') || '').slice(0, 100);
    const bottomText = (params.get('bottomText') || '').slice(0, 100);
    const fontSize = Math.min(Math.max(parseInt(params.get('fontSize')) || 50, 20), 100);
    const textColor = params.get('textColor') || '#FFFFFF';
    const strokeColor = params.get('strokeColor') || '#000000';
    const strokeWidth = Math.min(Math.max(parseInt(params.get('strokeWidth')) || 4, 1), 10);

    // Validasi imageUrl
    if (!imageUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'imageUrl is required',
          usage: {
            endpoint: '/api/meme',
            method: 'GET',
            parameters: {
              imageUrl: 'string (required) - URL gambar',
              topText: 'string (optional) - Teks atas',
              bottomText: 'string (optional) - Teks bawah',
              fontSize: 'number (20-100, default: 50)',
              textColor: 'hex (default: #FFFFFF)',
              strokeColor: 'hex (default: #000000)',
              strokeWidth: 'number (1-10, default: 4)'
            },
            example: '/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=😎&bottomText=🚀'
          }
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // Validasi URL format
    let validatedUrl;
    try {
      validatedUrl = new URL(imageUrl);
      // Hanya allow http/https
      if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid imageUrl format. Must be valid http/https URL' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    const shadowStyle = createShadow(strokeWidth, strokeColor);

    // Generate image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '800px',
            height: '600px',
            position: 'relative',
            backgroundColor: '#000000',
            overflow: 'hidden',
          }}
        >
          {/* Background Image */}
          <img
            src={validatedUrl.toString()}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '800px',
              height: '600px',
              objectFit: 'cover',
            }}
          />
          
          {/* Top Text */}
          {topText && (
            <div
              style={{
                position: 'absolute',
                top: '30px',
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: `${fontSize}px`,
                fontWeight: 900,
                color: textColor,
                textTransform: 'uppercase',
                fontFamily: `Impact, Arial Black, sans-serif, ${emojiFont}`,
                textShadow: shadowStyle,
                padding: '0 40px',
                zIndex: 10,
                lineHeight: 1.1,
                letterSpacing: '2px',
                wordWrap: 'break-word',
                maxWidth: '800px',
              }}
            >
              {topText}
            </div>
          )}

          {/* Bottom Text */}
          {bottomText && (
            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: `${fontSize}px`,
                fontWeight: 900,
                color: textColor,
                textTransform: 'uppercase',
                fontFamily: `Impact, Arial Black, sans-serif, ${emojiFont}`,
                textShadow: shadowStyle,
                padding: '0 40px',
                zIndex: 10,
                lineHeight: 1.1,
                letterSpacing: '2px',
                wordWrap: 'break-word',
                maxWidth: '800px',
              }}
            >
              {bottomText}
            </div>
          )}
        </div>
      ),
      {
        width: 800,
        height: 600,
        emoji: 'twemoji',
        fonts: [
          {
            name: 'Impact',
            data: await fetch('https://cdn.jsdelivr.net/gh/google/fonts@main/apache/roboto/Roboto-Black.ttf').then(r => r.arrayBuffer()),
            weight: 900,
            style: 'normal',
          },
        ],
      }
    );

  } catch (error) {
    console.error('Error generating meme:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to generate meme',
        message: error.message,
        tip: 'Make sure imageUrl is accessible and valid'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}
