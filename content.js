(function() {
    // --- 1. AYARLAR VE SES HAFIZASI ---
    let savedVol = parseFloat(localStorage.getItem('ig_enhanced_vol'));
    let currentGlobalVolume = !isNaN(savedVol) ? savedVol : 0.1;

    // --- 2. SES PATLAMASINI ENGELLEYEN "SERT KİLİT" (HARD-LOCK) ---
    // Tarayıcının ses motoruna doğrudan müdahale ederek sitenin sesi açmasını imkansız kılıyoruz.
    const volumeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
    const originalVolumeSetter = volumeDescriptor.set;

    Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
        set: function(value) {
            // Site sesi 1.0 (tam ses) yapmaya çalışsa bile, biz her zaman kendi değerimizi dayatıyoruz.
            originalVolumeSetter.call(this, currentGlobalVolume);
        },
        get: function() {
            return currentGlobalVolume;
        },
        configurable: false // Sitenin bu engeli kaldırmasını önler.
    });

    // Bazı siteler sesi 'muted = false' yaparak açar, bunu da kilitliyoruz.
    const mutedDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'muted');
    const originalMutedSetter = mutedDescriptor.set;

    Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
        set: function(value) {
            originalMutedSetter.call(this, value);
            // Sessizden her çıkıldığında sesi anında bizim seviyemize zorla.
            if (!value) {
                originalVolumeSetter.call(this, currentGlobalVolume);
            }
        },
        get: function() {
            return this.getAttribute('muted') === 'true';
        },
        configurable: false
    });

    // --- 3. TÜM GÖRSEL TASARIM (CSS) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Genel Panel Yapısı */
        .ig-ui-panel {
            position: absolute !important; 
            z-index: 2147483647 !important;
            background: rgba(15, 15, 15, 0.75) !important; 
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            opacity: 0; 
            transition: opacity 0.3s ease-in-out !important;
            pointer-events: all !important;
            user-select: none !important;
        }

        /* Video üzerine gelince panelleri göster */
        .video-parent-hover:hover .ig-ui-panel { 
            opacity: 1 !important; 
        }

        /* Zaman Paneli (Üstte) */
        .ig-time-container {
            top: 10px !important; 
            left: 10px !important; 
            right: 50px !important;
            padding: 6px 15px !important; 
            border-radius: 30px !important;
            display: flex !important; 
            align-items: center !important; 
            gap: 12px !important;
        }

        /* Ses Paneli (Sağda) */
        .ig-vol-container {
            top: 60px !important; 
            right: 10px !important;
            padding: 12px 8px !important; 
            border-radius: 20px !important;
            display: flex !important; 
            flex-direction: column !important; 
            align-items: center !important; 
            gap: 10px !important;
        }

        /* Kaydırıcı (Slider) Tasarımları */
        .ig-slider {
            -webkit-appearance: none !important;
            background: rgba(255, 255, 255, 0.2) !important;
            outline: none !important;
            cursor: pointer !important;
            border-radius: 10px !important;
        }

        .ig-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            width: 12px !important;
            height: 12px !important;
            background: #fff !important;
            border-radius: 50% !important;
            box-shadow: 0 0 5px rgba(0,0,0,0.5) !important;
        }

        .ig-h-slider { flex: 1 !important; height: 4px !important; }
        .ig-v-slider { 
            writing-mode: vertical-lr !important; 
            direction: rtl !important; 
            width: 5px !important; 
            height: 110px !important; 
        }

        /* Yazı Tipleri */
        .ig-label {
            color: #fff !important;
            font-family: 'Consolas', monospace !important;
            font-size: 11px !important;
            font-weight: bold !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5) !important;
        }
    `;
    document.head.appendChild(style);

    // --- 4. FONKSİYONLAR VE KONTROLLER ---
    function updateGlobalVolume(val) {
        currentGlobalVolume = parseFloat(val);
        localStorage.setItem('ig_enhanced_vol', currentGlobalVolume);
        
        // Tüm videoların sesini orijinal motoru kullanarak güncelle
        document.querySelectorAll('video').forEach(v => {
            originalVolumeSetter.call(v, currentGlobalVolume);
        });

        // Arayüzdeki tüm ses yüzdelerini güncelle
        document.querySelectorAll('.ig-v-pct').forEach(el => {
            el.innerText = Math.round(currentGlobalVolume * 100) + '%';
        });
    }

    function createUI() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.dataset.hasEnhancedUI) return;
            video.dataset.hasEnhancedUI = "true";

            // Sesi daha video yüklenmeden kilitli seviyeye getir
            originalVolumeSetter.call(video, currentGlobalVolume);

            // Videoyu saran en uygun kabı (container) bul
            let container = video.parentElement;
            while (container && container.offsetHeight < 100) container = container.parentElement;
            if (!container) return;

            container.classList.add('video-parent-hover');
            container.style.position = 'relative';

            // --- ZAMAN PANELİ OLUŞTUR ---
            const timePanel = document.createElement('div');
            timePanel.className = 'ig-ui-panel ig-time-container';
            
            const timeLabel = document.createElement('span');
            timeLabel.className = 'ig-label';
            timeLabel.innerText = '00:00';

            const timeSlider = document.createElement('input');
            timeSlider.type = 'range';
            timeSlider.className = 'ig-slider ig-h-slider';
            timeSlider.max = 1000;
            timeSlider.value = 0;

            video.addEventListener('timeupdate', () => {
                if (!timeSlider.matches(':active')) {
                    const progress = (video.currentTime / video.duration) * 1000 || 0;
                    timeSlider.value = progress;
                    
                    const m = Math.floor(video.currentTime / 60);
                    const s = Math.floor(video.currentTime % 60);
                    timeLabel.innerText = `${m}:${s.toString().padStart(2, '0')}`;
                }
            });

            timeSlider.oninput = () => {
                video.currentTime = (timeSlider.value / 1000) * video.duration;
            };

            // --- SES PANELİ OLUŞTUR ---
            const volPanel = document.createElement('div');
            volPanel.className = 'ig-ui-panel ig-vol-container';

            const volSlider = document.createElement('input');
            volSlider.type = 'range';
            volSlider.className = 'ig-slider ig-v-slider';
            volSlider.min = 0; volSlider.max = 1; volSlider.step = 0.01;
            volSlider.value = currentGlobalVolume;

            const pctLabel = document.createElement('span');
            pctLabel.className = 'ig-label ig-v-pct';
            pctLabel.innerText = Math.round(currentGlobalVolume * 100) + '%';

            volSlider.oninput = (e) => updateGlobalVolume(e.target.value);

            // Engelleme: Tıklamaların videoyu durdurmasını önle
            [timePanel, volPanel].forEach(p => {
                p.addEventListener('mousedown', e => e.stopPropagation());
                p.addEventListener('click', e => e.stopPropagation());
            });

            // Panelleri ekrana yerleştir
            timePanel.append(timeLabel, timeSlider);
            volPanel.append(volSlider, pctLabel);
            container.appendChild(timePanel);
            container.appendChild(volPanel);

            // Ek Güvenlik: Video her oynatıldığında sesi tekrar zorla
            video.addEventListener('play', () => {
                originalVolumeSetter.call(video, currentGlobalVolume);
            });
        });
    }

    // --- 5. OTOMATİK TAKİP (MUTATION OBSERVER) ---
    // Yeni videolar eklendiğinde (kaydırdıkça) anında yakalar
    const observer = new MutationObserver(() => createUI());
    observer.observe(document.body, { childList: true, subtree: true });

    // İlk çalıştırma
    createUI();

    // Periyodik kontrol (Bazı zorlu durumlar için yedek plan)
    setInterval(() => {
        document.querySelectorAll('video').forEach(v => {
            if (v.volume !== currentGlobalVolume) {
                originalVolumeSetter.call(v, currentGlobalVolume);
            }
        });
    }, 1000);

})();