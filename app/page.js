'use client'

import { useState } from 'react'
import './globals.css'

const templates = [
  { id: 'drake', url: 'https://i.imgflip.com/30b1gx.jpg', name: 'Drake Hotline Bling' },
  { id: 'distracted', url: 'https://i.imgflip.com/1ur9b0.jpg', name: 'Distracted Boyfriend' },
  { id: 'doge', url: 'https://i.imgflip.com/4t0m5.jpg', name: 'Doge' },
  { id: 'stonks', url: 'https://i.imgflip.com/2wifvo.jpg', name: 'Stonks' },
  { id: 'pablo', url: 'https://i.imgflip.com/1c1uej.jpg', name: 'Sad Pablo' },
  { id: 'yuno', url: 'https://i.imgflip.com/26am.jpg', name: 'Y U No' },
]

export default function Home() {
  const [selected, setSelected] = useState(templates[0])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const [form, setForm] = useState({
    imageUrl: '',
    topText: '',
    bottomText: '',
    fontSize: 50,
    textColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 4
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const imageUrl = form.imageUrl.trim() || selected.url
    
    // Validate URL
    try {
      new URL(imageUrl)
    } catch {
      setError('URL gambar tidak valid. Pastikan menggunakan http:// atau https://')
      setLoading(false)
      return
    }

    const params = new URLSearchParams({
      imageUrl,
      topText: form.topText,
      bottomText: form.bottomText,
      fontSize: form.fontSize,
      textColor: form.textColor,
      strokeColor: form.strokeColor,
      strokeWidth: form.strokeWidth
    })

    try {
      const res = await fetch(`/api/meme?${params.toString()}`)
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to generate meme')
      }
      
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setResult(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setForm({ ...form, topText: '', bottomText: '' })
  }

  return (
    <div className="container">
      <header>
        <h1>🎭 SMEME</h1>
        <p>Meme Generator dengan Full Emoji Support 😎🔥🚀</p>
        <div className="badges">
          <span className="badge">✅ 100% Gratis</span>
          <span className="badge">🚀 Edge Network</span>
          <span className="badge">😎 All Emoji</span>
          <span className="badge">⚡ Instant</span>
        </div>
      </header>

      <div className="card">
        <h2 style={{ marginBottom: '20px', color: '#374151' }}>🖼️ Pilih Template</h2>
        <div className="templates">
          {templates.map(t => (
            <div
              key={t.id}
              className={`template ${selected.id === t.id ? 'active' : ''}`}
              onClick={() => {
                setSelected(t)
                setForm({ ...form, imageUrl: '' })
              }}
            >
              <img src={t.url} alt={t.name} loading="lazy" />
              <div className="template-name">{t.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', color: '#374151' }}>✏️ Buat Meme</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🔗 URL Gambar Custom (Opsional)</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/gambar.jpg"
            />
            <small style={{ color: '#6b7280', display: 'block', marginTop: '5px' }}>
              Kosongkan untuk pakai template yang dipilih
            </small>
          </div>

          <div className="row">
            <div className="form-group">
              <label>⬆️ Teks Atas <span style={{ fontSize: '1.2em' }}>😎</span></label>
              <input
                type="text"
                value={form.topText}
                onChange={e => setForm({ ...form, topText: e.target.value })}
                placeholder="Ketik teks atas..."
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label>⬇️ Teks Bawah <span style={{ fontSize: '1.2em' }}>🔥</span></label>
              <input
                type="text"
                value={form.bottomText}
                onChange={e => setForm({ ...form, bottomText: e.target.value })}
                placeholder="Ketik teks bawah..."
                maxLength={100}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>📏 Ukuran Font (20-100)</label>
              <input
                type="number"
                value={form.fontSize}
                onChange={e => setForm({ ...form, fontSize: e.target.value })}
                min={20}
                max={100}
              />
            </div>
            <div className="form-group">
              <label>✏️ Tebal Outline (1-10)</label>
              <input
                type="number"
                value={form.strokeWidth}
                onChange={e => setForm({ ...form, strokeWidth: e.target.value })}
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>🎨 Warna Teks</label>
              <input
                type="text"
                value={form.textColor}
                onChange={e => setForm({ ...form, textColor: e.target.value })}
                placeholder="#FFFFFF"
              />
            </div>
            <div className="form-group">
              <label>🖤 Warna Outline</label>
              <input
                type="text"
                value={form.strokeColor}
                onChange={e => setForm({ ...form, strokeColor: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? '⏳ Generating...' : '🚀 Generate Meme'}
          </button>
          
          {error && <div className="error">{error}</div>}
        </form>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Sedang membuat meme...</p>
          </div>
        )}

        {result && (
          <div className="result">
            <h3 style={{ marginBottom: '20px', color: '#374151' }}>🎉 Meme Berhasil!</h3>
            <img src={result} alt="Generated Meme" />
            <div className="result-actions">
              <a href={result} download="smeme.png">
                <button className="btn-secondary">💾 Download PNG</button>
              </a>
              <button onClick={reset}>🔄 Buat Lagi</button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', color: '#374151' }}>🔌 API untuk Developer</h2>
        <p style={{ color: '#6b7280', marginBottom: '15px' }}>
          Gunakan API ini di bot WhatsApp, Telegram, Discord, atau aplikasi lain:
        </p>
        <div className="api-box">
          <span className="method">GET</span> <span className="url">/api/meme?imageUrl=URL&topText=TEXT&bottomText=TEXT</span>
          <br /><br />
          <span style={{ color: '#9ca3af' }}># Contoh:</span>
          <br />
          <span className="url">/api/meme?imageUrl=https://i.imgflip.com/30b1gx.jpg&topText=😎+Hello&bottomText=🚀+World&fontSize=50</span>
        </div>
      </div>

      <footer className="footer">
        <p>Made with ❤️ by <strong>egasenpai</strong></p>
        <p style={{ marginTop: '10px' }}>
          <a href="https://github.com/egasenpai/smeme-api">GitHub</a>
        </p>
      </footer>
    </div>
  )
}
