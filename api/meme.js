import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;
    
    const imageUrl = params.get('imageUrl');
    const topText = params.get('topText') || '';
    const bottomText = params.get('bottomText') || '';
    const fontSize = Math.min(Math.max(parseInt(params.get('fontSize')) || 50, 20), 100);

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ 
          error: 'imageUrl required',
          example: '/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=😎&bottomText=🚀'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simple shadow
    const shadow = '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 0 4px 0 #000, 0 -4px 0 #000, 4px 0 0 #000, -4px 0 0 #000';

    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          width: '800px',
          height: '600px',
          position: 'relative',
          backgroundColor: '#000',
        }}>
          <img
            src={imageUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '800px',
              height: '600px',
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
              fontSize: fontSize,
              fontWeight: 900,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: shadow,
              padding: '0 40px',
              zIndex: 10,
              lineHeight: 1.2,
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
              fontSize: fontSize,
              fontWeight: 900,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: shadow,
              padding: '0 40px',
              zIndex: 10,
              lineHeight: 1.2,
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
