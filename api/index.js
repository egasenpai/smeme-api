// api/index.js - GABUNGAN HOME + MEME GENERATOR

import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { pathname, searchParams } = new URL(req.url);
  
  // ROUTING: /api/meme untuk generate meme
  if (pathname === '/api/meme' || pathname === '/meme') {
    try {
      const imageUrl = searchParams.get('imageUrl');
      const topText = searchParams.get('topText') || '';
      const bottomText = searchParams.get('bottomText') || '';
      const fontSize = parseInt(searchParams.get('fontSize')) || 50;
      const textColor = searchParams.get('textColor') || '#FFFFFF';
      const strokeColor = searchParams.get('strokeColor') || '#000000';
      const strokeWidth = parseInt(searchParams.get('strokeWidth')) || 4;

      if (!imageUrl) {
        return new Response(
          JSON.stringify({ 
            error: 'imageUrl parameter is required',
            example: '/api/meme?imageUrl=URL&topText=😎&bottomText=🚀'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: '#000',
          }}>
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
            {topText && (
              <div style={{
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
              }}>
                {topText}
              </div>
            )}
            {bottomText && (
              <div style={{
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
              }}>
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
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  // ROUTING: / (home) untuk info
  return new Response(
    JSON.stringify({
      name: "🎭 SMEME API",
      status: "✅ Online",
      endpoints: {
        home: "/",
        generate: "/api/meme?imageUrl=URL&topText=TEXT&bottomText=TEXT"
      },
      params: {
        imageUrl: "required - URL gambar",
        topText: "optional - teks atas (support emoji 🎉)",
        bottomText: "optional - teks bawah (support emoji 🔥)",
        fontSize: "optional - default: 50",
        textColor: "optional - default: #FFFFFF",
        strokeColor: "optional - default: #000000",
        strokeWidth: "optional - default: 4"
      },
      example: "/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=😎+Cool&bottomText=🤯+Mind+Blown"
    }, null, 2),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
