export const config = {
  runtime: 'edge',
};

const HTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎭 SMEME - Meme Generator</title>
    <meta name="description" content="Free Meme Generator with Emoji Support">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.6;
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
            animation: fadeInDown 0.8s ease;
        }
        
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .badges {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
        }
        
        .badge {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85em;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        .card {
            background: rgba(255,255,255,0.97);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: fadeInUp 0.8s ease;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        h2 {
            color: #374151;
            margin-bottom: 20px;
            font-size: 1.5em;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #4b5563;
            font-size: 0.95em;
        }
        
        input[type="text"],
        input[type="url"],
        input[type="number"] {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 1em;
            transition: all 0.3s;
            background: #f9fafb;
        }
        
        input[type="text"]:focus,
        input[type="url"]:focus,
        input[type="number"]:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        @media (max-width: 640px) {
            .row { grid-template-columns: 1fr; }
            header h1 { font-size: 2.5em; }
        }
        
        .color-group {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        input[type="color"] {
            width: 50px;
            height: 46px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            padding: 0;
            overflow: hidden;
        }
        
        .color-value {
            flex: 1;
            font-family: monospace;
            color: #6b7280;
        }
        
        button {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 14px;
            font-size: 1.2em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
        }
        
        button:active:not(:disabled) {
            transform: translateY(0);
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .templates {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .template {
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            border: 3px solid transparent;
            transition: all 0.3s;
            position: relative;
        }
        
        .template:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        
        .template.active {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.3);
        }
        
        .template img {
            width: 100%;
            height: 100px;
            object-fit: cover;
            display: block;
        }
        
        .template-name {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px;
            font-size: 0.8em;
            text-align: center;
        }
        
        .loading {
            display: none;
            text-align: center;
            padding: 40px;
        }
        
        .spinner {
            width: 60px;
            height: 60px;
            border: 4px solid #e5e7eb;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        #result {
            display: none;
            text-align: center;
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        #result img {
            max-width: 100%;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        
        .result-actions {
            margin-top: 25px;
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .result-actions button {
            width: auto;
            padding: 14px 28px;
            font-size: 1em;
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
        }
        
        .api-section {
            background: #1f2937;
            color: #10b981;
            padding: 20px;
            border-radius: 12px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin-top: 15px;
            line-height: 1.5;
        }
        
        .api-section .method {
            color: #fbbf24;
        }
        
        .api-section .url {
            color: #60a5fa;
        }
        
        .footer {
            text-align: center;
            padding: 40px 20px;
            color: rgba(255,255,255,0.9);
        }
        
        .footer a {
            color: white;
            text-decoration: none;
            border-bottom: 1px solid rgba(255,255,255,0.5);
        }
        
        .footer a:hover {
            border-bottom-color: white;
        }
        
        .tips {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            border-radius: 0 12px 12px 0;
            margin-top: 15px;
            font-size: 0.9em;
            color: #92400e;
        }
        
        .error-msg {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            border-radius: 0 12px 12px 0;
            margin-top: 15px;
            color: #991b1b;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎭 SMEME</h1>
            <p>Meme Generator dengan Full Emoji Support 😎🔥🚀</p>
            <div class="badges">
                <span class="badge">✅ 100% Gratis</span>
                <span class="badge">🚀 Edge Network</span>
                <span class="badge">😎 All Emoji</span>
                <span class="badge">⚡ Instant</span>
            </div>
        </header>

        <div class="card">
            <h2>🖼️ Pilih Template Populer</h2>
            <div class="templates" id="templates">
                <div class="template active" data-url="https://i.imgflip.com/30b1gx.jpg" data-name="Drake">
                    <img src="https://i.imgflip.com/30b1gx.jpg" alt="Drake" loading="lazy">
                    <div class="template-name">Drake</div>
                </div>
                <div class="template" data-url="https://i.imgflip.com/1ur9b0.jpg" data-name="Distracted">
                    <img src="https://i.imgflip.com/1ur9b0.jpg" alt="Distracted" loading="lazy">
                    <div class="template-name">Distracted BF</div>
                </div>
                <div class="template" data-url="https://i.imgflip.com/4t0m5.jpg" data-name="Doge">
                    <img src="https://i.imgflip.com/4t0m5.jpg" alt="Doge" loading="lazy">
                    <div class="template-name">Doge</div>
                </div>
                <div class="template" data-url="https://i.imgflip.com/2wifvo.jpg" data-name="Stonks">
                    <img src="https://i.imgflip.com/2wifvo.jpg" alt="Stonks" loading="lazy">
                    <div class="template-name">Stonks</div>
                </div>
                <div class="template" data-url="https://i.imgflip.com/1c1uej.jpg" data-name="Sad Pablo">
                    <img src="https://i.imgflip.com/1c1uej.jpg" alt="Sad Pablo" loading="lazy">
                    <div class="template-name">Sad Pablo</div>
                </div>
            </div>
            
            <div class="tips">
                💡 <strong>Tips:</strong> Klik template untuk memilih, atau gunakan URL gambar custom di bawah
            </div>
        </div>

        <div class="card">
            <h2>✏️ Buat Meme Kamu</h2>
            <form id="memeForm">
                <div class="form-group">
                    <label>🔗 URL Gambar Custom (Opsional)</label>
                    <input type="url" id="imageUrl" placeholder="https://example.com/gambar.jpg">
                    <small style="color: #6b7280; display: block; margin-top: 5px;">
                        Kosongkan untuk pakai template yang dipilih di atas
                    </small>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label>⬆️ Teks Atas <span style="font-size: 1.2em;">😎</span></label>
                        <input type="text" id="topText" placeholder="Ketik teks atas... (support emoji)" maxlength="100">
                    </div>
                    <div class="form-group">
                        <label>⬇️ Teks Bawah <span style="font-size: 1.2em;">🔥</span></label>
                        <input type="text" id="bottomText" placeholder="Ketik teks bawah... (support emoji)" maxlength="100">
                    </div>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label>📏 Ukuran Font (20-100)</label>
                        <input type="number" id="fontSize" value="50" min="20" max="100">
                    </div>
                    <div class="form-group">
                        <label>✏️ Tebal Outline (1-10)</label>
                        <input type="number" id="strokeWidth" value="4" min="1" max="10">
                    </div>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label>🎨 Warna Teks</label>
                        <div class="color-group">
                            <input type="color" id="textColor" value="#ffffff">
                            <span class="color-value" id="textColorValue">#FFFFFF</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>🖤 Warna Outline</label>
                        <div class="color-group">
                            <input type="color" id="strokeColor" value="#000000">
                            <span class="color-value" id="strokeColorValue">#000000</span>
                        </div>
                    </div>
                </div>

                <button type="submit" id="generateBtn">
                    🚀 Generate Meme Sekarang
                </button>
                
                <div class="error-msg" id="errorMsg"></div>
            </form>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>⏳ Sedang membuat meme...</p>
                <small style="color: #6b7280;">Ini hanya memakan waktu 1-2 detik</small>
            </div>

            <div id="result">
                <h3 style="margin-bottom: 20px; color: #374151; font-size: 1.5em;">🎉 Meme Berhasil Dibuat!</h3>
                <img id="memeImage" src="" alt="Generated Meme">
                <div class="result-actions">
                    <a id="downloadLink" href="#" download="smeme.png">
                        <button type="button" class="btn-secondary">💾 Download PNG</button>
                    </a>
                    <button type="button" onclick="resetForm()">🔄 Buat Lagi</button>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>🔌 API untuk Developer</h2>
            <p style="color: #6b7280; margin-bottom: 15px;">
                Gunakan API ini di bot WhatsApp, Telegram, Discord, atau aplikasi lain:
            </p>
            <div class="api-section">
<span class="method">GET</span> <span class="url">/api/meme?imageUrl=URL&topText=TEXT&bottomText=TEXT</span>

<span style="color: #9ca3af;"># Contoh penggunaan:</span>
<span class="url">/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=😎+Hello&bottomText=🚀+World&fontSize=50</span>

<span style="color: #9ca3af;"># Parameter:</span>
imageUrl    <span style="color: #f87171;">(required)</span> - URL gambar
topText     <span style="color: #6ee7b7;">(optional)</span> - Teks atas
bottomText  <span style="color: #6ee7b7;">(optional)</span> - Teks bawah  
fontSize    <span style="color: #6ee7b7;">(optional)</span> - 20-100, default: 50
textColor   <span style="color: #6ee7b7;">(optional)</span> - Hex color, default: #FFFFFF
strokeColor <span style="color: #6ee7b7;">(optional)</span> - Hex color, default: #000000
strokeWidth <span style="color: #6ee7b7;">(optional)</span> - 1-10, default: 4
            </div>
        </div>

        <div class="footer">
            <p>Made with ❤️ by <strong>egasenpai</strong></p>
            <p style="margin-top: 10px;">
                <a href="https://github.com/egasenpai/smeme-api">GitHub</a> • 
                <a href="/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=Test&bottomText=API">Test API</a>
            </p>
            <p style="margin-top: 15px; font-size: 0.9em; opacity: 0.8;">
                Deployed on Vercel Edge Network • ${new Date().getFullYear()}
            </p>
        </div>
    </div>

    <script>
        let selectedTemplate = 'https://i.imgflip.com/30b1gx.jpg';
        
        // Template selection
        document.querySelectorAll('.template').forEach(t => {
            t.addEventListener('click', function() {
                document.querySelectorAll('.template').forEach(x => {
                    x.classList.remove('active');
                });
                this.classList.add('active');
                selectedTemplate = this.dataset.url;
                document.getElementById('imageUrl').value = '';
            });
        });

        // Color pickers
        document.getElementById('textColor').addEventListener('input', e => {
            document.getElementById('textColorValue').textContent = e.target.value.toUpperCase();
        });
        document.getElementById('strokeColor').addEventListener('input', e => {
            document.getElementById('strokeColorValue').textContent = e.target.value.toUpperCase();
        });

        // Reset form
        function resetForm() {
            document.getElementById('result').style.display = 'none';
            document.getElementById('memeForm').style.display = 'block';
            document.getElementById('topText').value = '';
            document.getElementById('bottomText').value = '';
            document.getElementById('errorMsg').style.display = 'none';
        }

        // Form submit
        document.getElementById('memeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const imageUrl = document.getElementById('imageUrl').value.trim() || selectedTemplate;
            const topText = document.getElementById('topText').value;
            const bottomText = document.getElementById('bottomText').value;
            const fontSize = document.getElementById('fontSize').value;
            const textColor = document.getElementById('textColor').value;
            const strokeColor = document.getElementById('strokeColor').value;
            const strokeWidth = document.getElementById('strokeWidth').value;
            
            const errorMsg = document.getElementById('errorMsg');
            const loading = document.getElementById('loading');
            const result = document.getElementById('result');
            const generateBtn = document.getElementById('generateBtn');

            // Reset
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';
            
            // Validate URL
            try {
                new URL(imageUrl);
            } catch {
                errorMsg.textContent = '❌ URL gambar tidak valid. Pastikan menggunakan http:// atau https://';
                errorMsg.style.display = 'block';
                return;
            }

            // Show loading
            loading.style.display = 'block';
            generateBtn.disabled = true;

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

            try {
                const response = await fetch('/api/meme?' + params.toString());
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to generate meme');
                }
                
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                
                document.getElementById('memeImage').src = url;
                document.getElementById('downloadLink').href = url;
                
                document.getElementById('memeForm').style.display = 'none';
                loading.style.display = 'none';
                result.style.display = 'block';
                
            } catch (err) {
                loading.style.display = 'none';
                generateBtn.disabled = false;
                errorMsg.textContent = '❌ Error: ' + err.message;
                errorMsg.style.display = 'block';
            }
        });
    </script>
</body>
</html>`;

export default function handler() {
  return new Response(HTML, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
