import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get parameters
    const imageUrl = searchParams.get('imageUrl');
    const topText = searchParams.get('topText') || '';
    const bottomText = searchParams.get('bottomText') || '';
    const fontSize = Math.min(Math.max(parseInt(searchParams.get('fontSize')) || 50, 20), 100);
    const textColor = searchParams.get('textColor') || '#FFFFFF';
    const strokeColor = searchParams.get('strokeColor') || '#000000';
    const strokeWidth = Math.min(Math.max(parseInt(searchParams.get('strokeWidth')) || 4, 1), 10);

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ 
          error: 'imageUrl parameter is required',
          usage: '/api/meme?imageUrl=YOUR_IMAGE_URL&topText=😎&bottomText=🚀'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate meme image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: '#000',
          }}
        >
          {/* Background Image */}
          <img
            src={imageUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Top Text */}
          {topText && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: `${fontSize}px`,
                fontWeight: 900,
                color: textColor,
                textTransform: 'uppercase',
                fontFamily: 'Impact, Arial Black, sans-serif',
                textShadow: `
                  ${strokeWidth}px ${strokeWidth}px 0 ${strokeColor},
                  -${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                  ${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                  -${strokeWidth}px ${strokeWidth}px 0 ${strokeColor},
                  0 ${strokeWidth}px 0 ${strokeColor},
                  0 -${strokeWidth}px 0 ${strokeColor},
                  ${strokeWidth}px 0 0 ${strokeColor},
                  -${strokeWidth}px 0 0 ${strokeColor}
                `,
                padding: '0 40px',
                zIndex: 10,
                lineHeight: 1.2,
                letterSpacing: '2px',
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
                bottom: '40px',
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: `${fontSize}px`,
                fontWeight: 900,
                color: textColor,
                textTransform: 'uppercase',
                fontFamily: 'Impact, Arial Black, sans-serif',
                textShadow: `
                  ${strokeWidth}px ${strokeWidth}px 0 ${strokeColor},
                  -${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                  ${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                  -${strokeWidth}px ${strokeWidth}px 0 ${strokeColor},
                  0 ${strokeWidth}px 0 ${strokeColor},
                  0 -${strokeWidth}px 0 ${strokeColor},
                  ${strokeWidth}px 0 0 ${strokeColor},
                  -${strokeWidth}px 0 0 ${strokeColor}
                `,
                padding: '0 40px',
                zIndex: 10,
                lineHeight: 1.2,
                letterSpacing: '2px',
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
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate meme',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
