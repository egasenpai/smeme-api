export const config = {
  runtime: 'edge',
};

const HTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎭 SMEME - Meme Generator</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;padding:20px}
        .container{max-width:800px;margin:0 auto}
        header{text-align:center;padding:40px;color:#fff}
        header h1{font-size:3em;margin-bottom:10px}
        .card{background:#fff;border-radius:20px;padding:30px;margin-bottom:20px;box-shadow:0 10px 40px rgba(0,0,0,.2)}
        .form-group{margin-bottom:20px}
        label{display:block;margin-bottom:8px;font-weight:700;color:#333}
        input{width:100%;padding:12px;border:2px solid #ddd;border-radius:10px;font-size:1em}
        button{width:100%;padding:15px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:10px;font-size:1.1em;font-weight:700;cursor:pointer}
        button:disabled{opacity:.6;cursor:not-allowed}
        .templates{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
        .template{cursor:pointer;border:3px solid transparent;border-radius:10px;overflow:hidden}
        .template.active{border-color:#667eea}
        .template img{width:100%;height:80px;object-fit:cover}
        #result{display:none;text-align:center;margin-top:20px}
        #result img{max-width:100%;border-radius:10px}
        .api-box{background:#1f2937;color:#10b981;padding:15px;border-radius:10px;font-family:monospace;font-size:.9em;overflow-x:auto}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎭 SMEME</h1>
            <p>Meme Generator dengan Emoji Support 😎🔥🚀</p>
        </header>
        <div class="card">
            <h2 style="margin-bottom:15px">Pilih Template</h2>
            <div class="templates" id="templates">
                <div class="template active" data-url="https://i.imgflip.com/30b1gx.jpg"><img src="https://i.imgflip.com/30b1gx.jpg" alt="Drake"></div>
                <div class="template" data-url="https://i.imgflip.com/1ur9b0.jpg"><img src="https://i.imgflip.com/1ur9b0.jpg" alt="Distracted"></div>
                <div class="template" data-url="https://i.imgflip.com/4t0m5.jpg"><img src="https://i.imgflip.com/4t0m5.jpg" alt="Doge"></div>
            </div>
            <form id="memeForm">
                <div class="form-group">
                    <label>URL Gambar Custom (Opsional)</label>
                    <input type="url" id="imageUrl" placeholder="https://example.com/gambar.jpg">
                </div>
                <div class="form-group">
                    <label>⬆️ Teks Atas</label>
                    <input type="text" id="topText" placeholder="😎 Teks atas...">
                </div>
                <div class="form-group">
                    <label>⬇️ Teks Bawah</label>
                    <input type="text" id="bottomText" placeholder="🔥 Teks bawah...">
                </div>
                <div class="form-group">
                    <label>📏 Ukuran Font (20-100)</label>
                    <input type="number" id="fontSize" value="50" min="20" max="100">
                </div>
                <button type="submit" id="generateBtn">🚀 Generate Meme</button>
            </form>
            <div id="result">
                <h3 style="margin:20px 0">✅ Meme Berhasil!</h3>
                <img id="memeImage" src="" alt="Meme">
                <br><br>
                <a id="downloadLink" href="#" download="meme.png"><button type="button">💾 Download</button></a>
            </div>
        </div>
        <div class="card">
            <h2 style="margin-bottom:15px">🔌 API Endpoint</h2>
            <div class="api-box">GET /api/meme?imageUrl=URL&topText=TEXT&bottomText=TEXT</div>
        </div>
    </div>
    <script>
        let selectedTemplate='https://i.imgflip.com/30b1gx.jpg';
        document.querySelectorAll('.template').forEach(t=>{
            t.addEventListener('click',function(){
                document.querySelectorAll('.template').forEach(x=>x.classList.remove('active'));
                this.classList.add('active');
                selectedTemplate=this.dataset.url;
                document.getElementById('imageUrl').value='';
            });
        });
        document.getElementById('memeForm').addEventListener('submit',async(e)=>{
            e.preventDefault();
            const imageUrl=document.getElementById('imageUrl').value||selectedTemplate;
            const params=new URLSearchParams({
                imageUrl,
                topText:document.getElementById('topText').value,
                bottomText:document.getElementById('bottomText').value,
                fontSize:document.getElementById('fontSize').value
            });
            const btn=document.getElementById('generateBtn');
            btn.disabled=true;btn.textContent='⏳ Loading...';
            try{
                const response=await fetch('/api/meme?'+params.toString());
                const blob=await response.blob();
                const url=URL.createObjectURL(blob);
                document.getElementById('memeImage').src=url;
                document.getElementById('downloadLink').href=url;
                document.getElementById('result').style.display='block';
            }catch(err){
                alert('Error: '+err.message);
            }finally{
                btn.disabled=false;btn.textContent='🚀 Generate Meme';
            }
        });
    </script>
</body>
</html>`;

export default function handler() {
  return new Response(HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
