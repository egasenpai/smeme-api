import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

// Helper buat shadow
function createShadow(width, color) {
  const w = Math.min(Math.max(Number(width) || 4, 1), 10)
  const c = color || '#000000'
  const shadows = []
  for (let x = -w; x <= w; x++) {
    for (let y = -w; y <= w; y++) {
      if (x !== 0 || y !== 0) {
        shadows.push(`${x}px ${y}px 0 ${c}`)
      }
    }
  }
  return shadows.join(', ')
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const imageUrl = searchParams.get('imageUrl')
    const topText = searchParams.get('topText') || ''
    const bottomText = searchParams.get('bottomText') || ''
    const fontSize = Math.min(Math.max(parseInt(searchParams.get('fontSize')) || 50, 20), 100)
    const textColor = searchParams.get('textColor') || '#FFFFFF'
    const strokeColor = searchParams.get('strokeColor') || '#000000'
    const strokeWidth = Math.min(Math.max(parseInt(searchParams.get('strokeWidth')) || 4, 1), 10)

    // Validation
    if (!imageUrl) {
      return Response.json(
        { 
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
        },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      const url = new URL(imageUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch {
      return Response.json(
        { error: 'Invalid imageUrl. Must be valid http/https URL' },
        { status: 400 }
      )
    }

    const shadowStyle = createShadow(strokeWidth, strokeColor)

    // Generate meme
    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          width: '800px',
          height: '600px',
          position: 'relative',
          backgroundColor: '#000000',
          overflow: 'hidden',
        }}>
          {/* Background Image */}
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
          
          {/* Top Text */}
          {topText && (
            <div style={{
              position: 'absolute',
              top: '30px',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: fontSize,
              fontWeight: 900,
              color: textColor,
              textTransform: 'uppercase',
              fontFamily: 'Impact, Arial Black, sans-serif, Apple Color Emoji, Segoe UI Emoji',
              textShadow: shadowStyle,
              padding: '0 40px',
              zIndex: 10,
              lineHeight: 1.1,
              letterSpacing: '2px',
              wordWrap: 'break-word',
              maxWidth: '800px',
            }}>
              {topText}
            </div>
          )}

          {/* Bottom Text */}
          {bottomText && (
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: fontSize,
              fontWeight: 900,
              color: textColor,
              textTransform: 'uppercase',
              fontFamily: 'Impact, Arial Black, sans-serif, Apple Color Emoji, Segoe UI Emoji',
              textShadow: shadowStyle,
              padding: '0 40px',
              zIndex: 10,
              lineHeight: 1.1,
              letterSpacing: '2px',
              wordWrap: 'break-word',
              maxWidth: '800px',
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
    )

  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Failed to generate meme', message: error.message },
      { status: 500 }
    )
  }
}
