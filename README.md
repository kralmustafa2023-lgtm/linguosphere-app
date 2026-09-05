# 🎓 İngilizce Öğrenme Platformu

A1'den C2'ye tam müfredat — 45 ders, 8 oyun modu

## Özellikler

- 🎯 5 Seviye: A1 Temel → C1-C2 İleri
- 📚 45 Ders + Seviye Sonu Mega Tekrar
- 🎮 8 Oyun Modu: Flashcard, Quiz, Eşleştirme, Boşluk Doldurma, Cümle Kurma, Hız Turu, Yazma, Dinleme
- 🔊 Web Speech API ile Sesli Okuma
- 🏆 14 Rozet + XP Sistemi
- 🔥 Günlük Seri Takibi
- 📱 Tam Mobil Uyumlu
- 🎨 Premium Koyu Tema

## Kurulum

1. Tüm dosyaları web sunucusuna yükle
2. `index.html` dosyasını aç
3. Oyna!

### Yerel Geliştirme

Python ile:
```bash
python -m http.server 8000
```

VS Code ile:
- Live Server eklentisini kur
- index.html üzerinde sağ tık → "Open with Live Server"

## Teknik Notlar

- Herhangi bir backend gerektirmez
- localStorage ile progress kaydeder
- Web Speech API ile sesli okuma (API key gerekmez)
- Tüm modern tarayıcılarla uyumlu (Chrome, Firefox, Safari, Edge)
- Ses efektleri Web Audio API ile oluşturulur

## Klasör Yapısı

```
english-learning-app/
├── index.html          ← Ana giriş sayfası
├── css/                ← 6 stil dosyası
├── js/                 ← 19 JavaScript modülü
│   ├── screens/        ← 6 ekran modülü
│   └── games/          ← 8 oyun modülü
├── data/               ← 5 JSON müfredat dosyası
├── assets/             ← İkonlar ve sesler
└── README.md
```

## Hosting

- **GitHub Pages** — Repository'den direkt yayın
- **Netlify** — Sürükle bırak deploy (ücretsiz)
- **Vercel** — `vercel deploy` (ücretsiz)
