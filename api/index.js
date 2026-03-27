import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Helper: buat text shadow
function makeShadow(width, color) {
  const w = Number(width) || 4;
  const c = color || '#000000';
  const shadows = [
    `${w}px ${w}px 0 ${c}`,
    `-${w}px -${w}px 0 ${c}`,
    `${w}px -${w}px 0 ${c}`,
    `-${w}px ${w}px 0 ${c}`,
    `0 ${w}px 0 ${c}`,
    `0 -${w}px 0 ${c}`,
    `${w}px 0 0 ${c}`,
    `-${w}px 0 0 ${c}`
  ];
  return shadows.join(', ');
}

// HTML Web Interface
function getWebUI() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎭 SMEME Generator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            padding: 40px 20px;
            color: white;
        }
        header h1 {
            font-size: 3.5em;
            margin-bottom: 10px;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
        }
        header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .badges {
            margin-top: 20px;
        }
        .badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            margin: 5px;
            backdrop-filter: blur(10px);
        }
        .card {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
        }
        input[type="text"],
        input[type="url"],
        input[type="number"] {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 1em;
            transition: all 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        @media (max-width: 600px) {
            .row { grid-template-columns: 1fr; }
            header h1 { font-size: 2.5em; }
        }
        .color-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        input[type="color"] {
            width: 50px;
            height: 40px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
        button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.2em;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        button:active {
            transform: translateY(0);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        #result {
            display: none;
            text-align: center;
        }
        #result img {
            max-width: 100%;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .loading {
            display: none;
            text-align: center;
            padding: 40px;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e5e7eb;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .preview-text {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 0.9em;
            word-break: break-all;
            margin-top: 10px;
        }
        .templates {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .template {
            cursor: pointer;
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.2s;
            border: 3px solid transparent;
        }
        .template:hover {
            transform: scale(1.05);
        }
        .template.active {
            border-color: #667eea;
        }
        .template img {
            width: 100%;
            height: 100px;
            object-fit: cover;
        }
        .api-section {
            background: #1f2937;
            color: #10b981;
            padding: 20px;
            border-radius: 10px;
            font-family: monospace;
            overflow-x: auto;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 40px;
            color: rgba(255,255,255,0.8);
        }
        .emoji-preview {
            font-size: 1.5em;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎭 SMEME</h1>
            <p>Meme Generator dengan Support Emoji 😎🔥🚀</p>
            <div class="badges">
                <span class="badge">✅ Gratis</span>
                <span class="badge">🚀 Cepat</span>
                <span class="badge">😎 Emoji Support</span>
                <span class="badge">📱 Mobile Friendly</span>
            </div>
        </header>

        <div class="card">
            <h2 style="margin-bottom: 20px; color: #374151;">🖼️ Pilih Template</h2>
            <div class="templates" id="templates">
                <div class="template active" data-url="https://i.imgflip.com/30b1gx.jpg">
                    <img src="https://i.imgflip.com/30b1gx.jpg" alt="Drake">
                </div>
                <div class="template" data-url="https://i.imgflip.com/1ur9b0.jpg">
                    <img src="https://i.imgflip.com/1ur9b0.jpg" alt="Distracted">
                </div>
                <div class="template" data-url="https://i.imgflip.com/4t0m5.jpg">
                    <img src="https://i.imgflip.com/4t0m5.jpg" alt="Doge">
                </div>
                <div class="template" data-url="https://i.imgflip.com/2wifvo.jpg">
                    <img src="https://i.imgflip.com/2wifvo.jpg" alt="Stonks">
                </div>
                <div class="template" data-url="https://i.imgflip.com/1c1uej.jpg">
                    <img src="https://i.imgflip.com/1c1uej.jpg" alt="Sad Pablo">
                </div>
                <div class="template" data-url="https://i.imgflip.com/26am.jpg">
                    <img src="https://i.imgflip.com/26am.jpg" alt="Y U No">
                </div>
            </div>
        </div>

        <div class="card">
            <h2 style="margin-bottom: 20px; color: #374151;">✏️ Buat Meme</h2>
            <form id="memeForm">
                <div class="form-group">
                    <label>🔗 URL Gambar (Custom)</label>
                    <input type="url" id="imageUrl" placeholder="https://example.com/gambar.jpg">
                    <small style="color: #6b7280;">Kosongkan untuk pakai template yang dipilih</small>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label>⬆️ Teks Atas <span class="emoji-preview">😎</span></label>
                        <input type="text" id="topText" placeholder="Ketik disini... (support emoji)" maxlength="100">
                    </div>
                    <div class="form-group">
                        <label>⬇️ Teks Bawah <span class="emoji-preview">🔥</span></label>
                        <input type="text" id="bottomText" placeholder="Ketik disini... (support emoji)" maxlength="100">
                    </div>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label>📏 Ukuran Font</label>
                        <input type="number" id="fontSize" value="50" min="20" max="100">
                    </div>
                    <div class="form-group">
                        <label>✏️ Tebal Outline</label>
                        <input type="number" id="strokeWidth" value="4" min="1" max="10">
                    </div>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label>🎨 Warna Teks</label>
                        <div class="color-group">
                            <input type="color" id="textColor" value="#ffffff">
                            <input type="text" id="textColorHex" value="#FFFFFF" readonly style="flex:1;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>🖤 Warna Outline</label>
                        <div class="color-group">
                            <input type="color" id="strokeColor" value="#000000">
                            <input type="text" id="strokeColorHex" value="#000000" readonly style="flex:1;">
                        </div>
                    </div>
                </div>

                <button type="submit" id="generateBtn">
                    🚀 Generate Meme
                </button>
            </form>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>⏳ Sedang membuat meme...</p>
            </div>

            <div id="result">
                <h3 style="margin-bottom: 15px; color: #374151;">🎉 Meme Berhasil Dibuat!</h3>
                <img id="memeImage" src="" alt="Generated Meme">
                <br><br>
                <a id="downloadLink" href="#" download="meme.png">
                    <button type="button">💾 Download Meme</button>
                </a>
                <div class="preview-text" id="apiUrl"></div>
            </div>
        </div>

        <div class="card">
            <h2 style="margin-bottom: 20px; color: #374151;">🔌 API Endpoint</h2>
            <p style="margin-bottom: 15px; color: #6b7280;">Gunakan API ini di bot WhatsApp, Telegram, atau aplikasi lain:</p>
            <div class="api-section">
GET /api/meme?imageUrl=URL&topText=TEXT&bottomText=TEXT
            </div>
            <p style="margin-top: 15px; color: #6b7280;">
                <strong>Parameter:</strong> imageUrl (required), topText, bottomText, fontSize, textColor, strokeColor, strokeWidth
            </p>
        </div>

        <div class="footer">
            <p>Made with ❤️ by egasenpai | Deployed on Vercel Edge</p>
            <p style="margin-top: 10px; font-size: 0.9em;">
                <a href="https://github.com/egasenpai/smeme-api" style="color: white;">GitHub</a> • 
                <a href="/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=😎&bottomText=🚀" style="color: white;">Test API</a>
            </p>
        </div>
    </div>

    <script>
        let selectedTemplate = 'https://i.imgflip.com/30b1gx.jpg';

        // Template selection
        document.querySelectorAll('.template').forEach(t => {
            t.addEventListener('click', function() {
                document.querySelectorAll('.template').forEach(x => x.classList.remove('active'));
                this.classList.add('active');
                selectedTemplate = this.dataset.url;
                document.getElementById('imageUrl').value = '';
            });
        });

        // Color picker sync
        document.getElementById('textColor').addEventListener('input', e => {
            document.getElementById('textColorHex').value = e.target.value.toUpperCase();
        });
        document.getElementById('strokeColor').addEventListener('input', e => {
            document.getElementById('strokeColorHex').value = e.target.value.toUpperCase();
        });

        // Form submit
        document.getElementById('memeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const imageUrl = document.getElementById('imageUrl').value || selectedTemplate;
            const topText = document.getElementById('topText').value;
            const bottomText = document.getElementById('bottomText').value;
            const fontSize = document.getElementById('fontSize').value;
            const textColor = document.getElementById('textColor').value;
            const strokeColor = document.getElementById('strokeColor').value;
            const strokeWidth = document.getElementById('strokeWidth').value;

            // Show loading
            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            document.getElementById('generateBtn').disabled = true;

            // Build URL
            const params = new URLSearchParams({
                imageUrl,
                topText,
                bottomText,
                fontSize,
                textColor,
                strokeColor,
                strokeWidth
            });

            const apiUrl = '/api/meme?' + params.toString();

            try {
                const response = await fetch(apiUrl);
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                
                document.getElementById('memeImage').src = imageUrl;
                document.getElementById('downloadLink').href = imageUrl;
                document.getElementById('apiUrl').textContent = 'API URL: ' + window.location.origin + apiUrl;
                
                document.getElementById('result').style.display = 'block';
            } catch (err) {
                alert('❌ Error: ' + err.message);
            } finally {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('generateBtn').disabled = false;
            }
        });
    </script>
</body>
</html>`;
}

export default async function handler(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  
  // ROUTE: / (home) - Web Interface
  if (pathname === '/' || pathname === '') {
    return new Response(getWebUI(), {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
  
  // ROUTE: /api/meme untuk generate meme
  if (pathname === '/api/meme' || pathname === '/meme') {
    try {
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
            usage: '/api/meme?imageUrl=YOUR_IMAGE_URL&topText=TEXT&bottomText=TEXT',
            example: '/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=😎+Hello&bottomText=🚀+World'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate URL
      try {
        new URL(imageUrl);
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid imageUrl format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const shadowStyle = makeShadow(strokeWidth, strokeColor);

      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              width: '800px',
              height: '600px',
              position: 'relative',
              backgroundColor: '#000000',
            }}
          >
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
              <div
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  fontSize: fontSize,
                  fontWeight: 900,
                  color: textColor,
                  textTransform: 'uppercase',
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  textShadow: shadowStyle,
                  padding: '0 40px',
                  zIndex: 10,
                  lineHeight: 1.2,
                  letterSpacing: '2px',
                  wordWrap: 'break-word',
                }}
              >
                {topText}
              </div>
            )}
            {bottomText && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  fontSize: fontSize,
                  fontWeight: 900,
                  color: textColor,
                  textTransform: 'uppercase',
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  textShadow: shadowStyle,
                  padding: '0 40px',
                  zIndex: 10,
                  lineHeight: 1.2,
                  letterSpacing: '2px',
                  wordWrap: 'break-word',
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
      console.error('Meme generation error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate meme',
          message: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 404 Not Found
  return new Response(
    JSON.stringify({ 
      error: 'Not Found',
      path: pathname,
      available: ['/', '/api/meme']
    }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
}
