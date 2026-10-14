# doxmaxima-player (v3.0.0) 🎛️✨

Instagram web üzerinde video, Reels ve Hikayeler (Stories) için tasarlanmış gelişmiş, kişiselleştirilebilir, çok dilli ve sıfır gecikmeli ses ve oynatma süresi çubuğu eklentisi.

---

## 💎 doxmaxima-player v3.0 UI ve Özelleştirme Merkezi

Tarayıcı araç çubuğundaki eklenti simgesine tıklandığında açılan modern, koyu cam efektli kontrol paneli:

- 👑 **doxmaxima-player Başlığı & v3.0 Aktif Rozeti**
- 🌐 **Çoklu Dil Desteği (7 Dil):** 🇹🇷 Türkçe, 🇬🇧 English, 🇷🇺 Русский, 🇩🇪 Deutsch, 🇯🇵 日本語, 🇰🇷 한국어, 🇨🇳 简体中文
- 🔘 **Zaman Barını Açma / Kapatma Anahtarı**
- 🔊 **Ses Barını Açma / Kapatma Anahtarı**
- 📺 **Gerçek Zamanlı Canlı Önizleme Kutusu:** Yüksek kontrastlı anime sahnesi (`Itachi-header.jpg`) üzerinde saydamlık ve bulanıklık testi
- 🎨 **Hazır Vurgu Temaları:** Beyaz Glow, Instagram Sunset, Neon Cyber, Zümrüt, Altın
- 🌈 **Özel Renk Sistemi:** Tek Renk (Solid) veya 2 Renkli Gradyan (Gradient) seçimi
- 🎚️ **Cam Saydamlığı & Kenarlık Opaklığı:** %0 (Tamamen Şeffaf / Kenarlık Kaldırılmış) ile %95 arası
- 🌫️ **Bulanıklık Gücü (Backdrop Blur):** 0px (Kapalı) ile 24px arası
- 📏 **Çubuk Kalınlığı:** İnce (3px), Normal (5px), Kalın (7px)
- 📐 **Köşe Yuvarlaklığı:** Hafif (6px), Modern (12px), Hap (22px)
- ⌨️ **Klavye Kısayolları:** M (Mute), Sol/Sağ Ok (5s sarma), Yukarı/Aşağı Ok (Ses ayarı)
- 🔄 **Tek Tıkla Varsayılan Ayarlara Sıfırlama**

---

## 📁 Modüler Mimari Yapısı

```
instagram-ses-zaman-bar/
├── manifest.json              # Chrome MV3 eklenti manifesti (v3.0.0)
├── package.json               # Sözdizimi doğrulama (npm run validate) scripti
├── README.md                  # Dokümantasyon
├── popup/
│   ├── popup.html             # doxmaxima-player v3.0 kontrol paneli
│   ├── popup.css              # Lüks koyu glassmorphism stilleri
│   └── popup.js               # 7 dilli i18n motoru ve canlı önizleme yöneticisi
├── images/
│   ├── icon.png               # Eklenti ikonları
│   └── Itachi-header.jpg      # Önizleme sahne görseli
├── css/
│   └── style.css              # Glassmorphism Pro tasarım ve reaktif CSS değişkenleri (--dox-*)
└── src/
    ├── core/
    │   ├── state.js           # Global ses durumu ve doxmaxima ayar eşitleyicisi
    │   ├── video-detector.js  # Bulanık dolgu ve ikincil video filtreleme motoru
    │   └── native-killer.js   # Çok dilli orijinal ses butonu temizleyici
    └── ui/
        ├── formatters.js      # Zaman biçimlendirme
        ├── icons.js           # Dinamik SVG ses ikonları
        ├── master-layer.js    # En üst katman (#ig-enhanced-master-layer) yönetimi
        ├── time-bar.js        # Throttled arabellek korumalı zaman çubuğu
        ├── volume-bar.js      # Dikey ses barı, fare tekerleği ve mute toggle
        ├── positioner.js      # Çakışma önleyici (Spatial Arbiter) konumlayıcı
        └── keyboard.js        # Toast geri bildirimli akıllı klavye kısayolları
```

---

## 🚀 Kurulum ve Kullanım

1. Chrome'da `chrome://extensions` adresine gidin.
2. Sağ üstten **"Geliştirici modu"**nu açın.
3. **"Paketlenmemiş öge yükle"** butonuna basarak bu klasörü seçin (veya mevcutsa yenile 🔄 butonuna basın).
4. Instagram'ı açın ve dilediğiniz videonun keyfini modern kontrollerle çıkarın!
4. Chrome araç çubuğundaki eklenti simgesine tıklayarak **doxmaxima-player** kontrol panelini dilediğiniz zaman açıp kişiselleştirebilirsiniz.
