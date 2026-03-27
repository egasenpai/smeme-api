export const config = {
  runtime: 'edge',
};

export default function handler() {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>🎭 SMEME API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: rgba(255,255,255,0.95);
      border-radius: 20px;
      padding: 40px;
      max-width: 800px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 { font-size: 3em; margin-bottom: 10px; text-align: center; }
    .badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9em;
      margin: 5px;
    }
    .endpoint {
      background: #1f2937;
      color: #10b981;
      padding: 20px;
      border-radius: 10px;
      font-family: monospace;
      margin: 20px 0;
      overflow-x: auto;
    }
    .params {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }
    .param { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
    .required { color: #ef4444; font-weight: bold; }
    .optional { color: #6b7280; }
    code { background: #e5e7eb; padding: 2px 8px; border-radius: 4px; font-family: monospace; }
    .example {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 10px 10px 0;
    }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎭 SMEME API</h1>
    <p style="text-align: center; margin-bottom: 20px;">
      <span class="badge">✅ Online</span>
      <span class="badge">🚀 Edge Function</span>
      <span class="badge">😎 Emoji Support</span>
    </p>
    
    <div class="endpoint">
      GET /api/meme?imageUrl=URL&topText=TEXT&bottomText=TEXT
    </div>
    
    <div class="params">
      <h3>📋 Parameters:</h3>
      <div class="param">
        <code>imageUrl</code> <span class="required">REQUIRED</span><br>
        URL gambar yang mau dijadiin meme
      </div>
      <div class="param">
        <code>topText</code> <span class="optional">optional</span><br>
        Teks di atas (support emoji 🎉)
      </div>
      <div class="param">
        <code>bottomText</code> <span class="optional">optional</span><br>
        Teks di bawah (support emoji 🔥)
      </div>
      <div class="param">
        <code>fontSize</code> <span class="optional">default: 50</span><br>
        Ukuran font (20-100)
      </div>
    </div>
    
    <div class="example">
      <strong>📝 Contoh URL:</strong><br>
      <code>/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=😎+Cool&bottomText=🤯+Mind+Blown</code>
    </div>
    
    <div class="footer">
      Made with ❤️ | Deployed on Vercel Edge
    </div>
  </div>
</body>
</html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
