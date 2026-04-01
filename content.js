(function () {
    let currentGlobalVolume = parseFloat(localStorage.getItem('ig_enhanced_vol'));
    if (isNaN(currentGlobalVolume)) currentGlobalVolume = 0.5;

    // --- 1. GÖRSEL TASARIM (CSS) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Sistemsel Çökme Önleyici Zırh (Saf CSS gizlemeleri sadece flash'ı önler) 
           Geri kalan akıllı silme işlemleri devasa profil UI'larını tehlikeye atmaması için ebat filtreli JS üzerinden çalıştırılır. */
        svg[aria-label="Sesi kapat" i], svg[aria-label="Sesi aç" i],
        svg[aria-label="Videonun sesini kapat" i], svg[aria-label="Videonun sesini aç" i],
        svg[aria-label="Mute" i], svg[aria-label="Unmute" i],
        svg[aria-label="Audio is muted" i] {
            display: none !important;
        }

        .ig-ui-panel {
            position: fixed !important; 
            z-index: 2147483647 !important;
            background: transparent !important; 
            border: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            opacity: 0; 
            transition: opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
            pointer-events: none;
            user-select: none !important;
            box-sizing: border-box !important;
        }

        /* ========================================================= */
        /*                 ZAMAN BARI CSS AYARLARI                   */
        /* ========================================================= */
        .ig-time-container {
            padding: 8px 16px !important; 
            display: flex !important; 
            align-items: center !important; 
            gap: 14px !important;
            background: rgba(0, 0, 0, 0.4) !important;
            border-radius: 10px !important;
            backdrop-filter: blur(4px) !important;
            -webkit-backdrop-filter: blur(4px) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8) !important;
            border: 1px solid rgba(184, 184, 184, 0.4)!important;
        }

        /* ========================================================= */
        /*                  SES BARI CSS AYARLARI                    */
        /* ========================================================= */
        .ig-vol-widget {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-end !important;
            position: fixed !important; 
            z-index: 2147483647 !important;
            opacity: 0; 
            transition: opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
            pointer-events: none;
            user-select: none !important;
            background: rgba(0, 0, 0, 0.4) !important;
            border-radius: 10px !important;
            backdrop-filter: blur(4px) !important;
            -webkit-backdrop-filter: blur(4px) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
            padding: 8px 0 !important;
            width: 34px !important;
            border: 1px solid rgba(184, 184, 184, 0.4)!important;
        }

        .ig-vol-icon-btn {
            width: 34px !important;
            height: 34px !important;
            background: transparent !important;
            border-radius: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: transform 0.2s !important;
        }

        .ig-vol-icon-btn:hover {
            transform: scale(1.05) !important;
        }

        .ig-vol-icon-btn svg {
            width: 18px !important;
            height: 18px !important;
            fill: #fff !important;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5)) !important;
        }

        .ig-vol-slider-wrapper {
            width: 34px !important;
            height: 120px !important;
            opacity: 1 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            background: transparent !important;
            border-radius: 0 !important;
            padding: 10px 0 !important;
            box-sizing: border-box !important;
        }

        /* ========================================================= */
        /*             ORTAK KONTROLLER (Slider & Label)             */
        /* ========================================================= */
        .ig-slider {
            -webkit-appearance: none !important;
            background: rgba(255, 255, 255, 0.4) !important;
            outline: none !important;
            cursor: pointer !important;
            border-radius: 6px !important;
            transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.6), inset 0 1px 2px rgba(0,0,0,0.2) !important; 
        }

        .ig-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            width: 10px !important; 
            height: 10px !important;
            background: #ffffff !important;
            border-radius: 50% !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.8) !important;
            transition: width 0.2s, height 0.2s !important;
        }
        
        .ig-slider:hover::-webkit-slider-thumb,
        .ig-slider:active::-webkit-slider-thumb {
            width: 12px !important; /* Üzerine gelince biraz daha belirginleşir */
            height: 12px !important;
        }

        .ig-h-slider { flex: 1 !important; height: 3px !important; }
        .ig-h-slider:hover, .ig-h-slider:active { height: 5px !important; }

        .ig-v-slider { 
            writing-mode: vertical-lr !important; 
            direction: rtl !important; 
            width: 4px !important; 
            height: 80px !important; 
        }
        .ig-v-slider:hover, .ig-v-slider:active { width: 4px !important; }

        .ig-label {
            color: rgba(255, 255, 255, 0.95) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            letter-spacing: 0.3px !important;
            text-shadow: 0 1px 4px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7) !important;
            min-width: 42px;
            text-align: center;
            font-variant-numeric: tabular-nums !important;
        }
        .ig-v-pct {
            margin-bottom: 12px !important;
            min-width: 100% !important;
            font-size: 11px !important; /* 34px genişliğe tasma yapmayacak şık punto */
            font-weight: 800 !important;
            letter-spacing: 0px !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8) !important;
        }

        /* YENİ: Aşağı Açılan Menü (Reels ve Keşfet için) */
        .ig-vol-downwards {
            flex-direction: column-reverse !important;
            justify-content: flex-start !important;
        }
        .ig-vol-downwards .ig-vol-slider-wrapper {
            flex-direction: column-reverse !important;
        }
        .ig-vol-downwards .ig-v-pct {
            margin-bottom: 0px !important;
            margin-top: 12px !important;
        }
    `;
    document.head.appendChild(style);

    // --- 2. GLOBAL KATMAN (EN ÜST KATMAN) ---
    const masterLayer = document.createElement('div');
    masterLayer.id = 'ig-enhanced-master-layer';
    Object.assign(masterLayer.style, {
        position: 'fixed',
        top: '0', left: '0',
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: '2147483647',
        overflow: 'visible'
    });
    document.documentElement.appendChild(masterLayer);

    // --- 3. FONKSİYONLAR ---
    const injectedUIs = []; // Sahneden ayrılan videoların hayalet panellerini silmek için takip dizisi
    function updateGlobalVolume(val) {
        currentGlobalVolume = parseFloat(val);
        localStorage.setItem('ig_enhanced_vol', currentGlobalVolume);

        document.querySelectorAll('.ig-v-pct').forEach(el => {
            el.innerText = Math.round(currentGlobalVolume * 100) + '%';
        });

        document.querySelectorAll('video, audio').forEach(v => {
            v.volume = currentGlobalVolume;
            if (currentGlobalVolume > 0) {
                v.muted = false;
            } else {
                v.muted = true;
            }
        });
    }

    function createUI() {
        document.querySelectorAll('video').forEach(video => {
            if (video.dataset.hasEnhancedUI) return;
            video.dataset.hasEnhancedUI = "true";

            // =========================================================
            //               1. ZAMAN BARI YAPISI
            // =========================================================
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

            const updateTimeGradient = (val) => {
                const p = (val / 1000) * 100 || 0;
                timeSlider.style.background = `linear-gradient(to right, #fff ${p}%, rgba(255,255,255,0.4) ${p}%)`;
            };

            video.addEventListener('timeupdate', () => {
                if (!timeSlider.matches(':active')) {
                    const progress = (video.currentTime / video.duration) * 1000 || 0;
                    timeSlider.value = progress;

                    const m = Math.floor(video.currentTime / 60);
                    const s = Math.floor(video.currentTime % 60);
                    timeLabel.innerText = `${m}:${s.toString().padStart(2, '0')}`;

                    updateTimeGradient(progress);
                }
            });

            timeSlider.addEventListener('input', () => {
                if (video.duration) {
                    video.currentTime = (timeSlider.value / 1000) * video.duration;
                }
                updateTimeGradient(timeSlider.value);
            });

            timePanel.append(timeLabel, timeSlider);

            // =========================================================
            //                2. SES BARI YAPISI
            // =========================================================
            const volPanel = document.createElement('div');
            volPanel.className = 'ig-vol-widget';

            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'ig-vol-slider-wrapper';

            const pctLabel = document.createElement('span');
            pctLabel.className = 'ig-label ig-v-pct';
            pctLabel.innerText = Math.round(currentGlobalVolume * 100) + '%';

            const volSlider = document.createElement('input');
            volSlider.type = 'range';
            volSlider.className = 'ig-slider ig-v-slider';
            volSlider.min = 0; volSlider.max = 1; volSlider.step = 0.01;
            volSlider.value = currentGlobalVolume;

            sliderWrapper.append(pctLabel, volSlider);

            const iconBtn = document.createElement('div');
            iconBtn.className = 'ig-vol-icon-btn';

            // Dinamik İkon Güncelleme
            const updateIcon = (val) => {
                if (val == 0) {
                    iconBtn.innerHTML = `
                        <svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                    `;
                } else if (val < 0.5) {
                    iconBtn.innerHTML = `
                        <svg viewBox="0 0 24 24"><path d="M5 9v6h4l5 5V4L9 9H5zm11 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                    `;
                } else {
                    iconBtn.innerHTML = `
                        <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    `;
                }
            };

            let lastVol = currentGlobalVolume > 0 ? currentGlobalVolume : 0.5;
            iconBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentGlobalVolume > 0) {
                    lastVol = currentGlobalVolume;
                    volSlider.value = 0;
                    updateGlobalVolume(0);
                    updateVolGradient(0);
                } else {
                    volSlider.value = lastVol;
                    updateGlobalVolume(lastVol);
                    updateVolGradient(lastVol);
                }
            });

            const updateVolGradient = (val) => {
                const p = val * 100;
                volSlider.style.background = `linear-gradient(to top, #fff ${p}%, rgba(255,255,255,0.4) ${p}%)`;
                updateIcon(val);
            };

            volSlider.addEventListener('input', (e) => {
                updateGlobalVolume(e.target.value);
                updateVolGradient(e.target.value);
            });
            updateVolGradient(currentGlobalVolume); // İlk boyama

            [timePanel, volPanel].forEach(p => {
                p.addEventListener('mousedown', e => e.stopPropagation());
                p.addEventListener('click', e => e.stopPropagation());
                p.addEventListener('touchstart', e => e.stopPropagation());
            });

            volPanel.append(sliderWrapper, iconBtn);

            masterLayer.appendChild(timePanel);
            masterLayer.appendChild(volPanel);

            video.igEnhancedPanels = { time: timePanel, vol: volPanel };
            injectedUIs.push({ video: video, time: timePanel, vol: volPanel });
        });
    }

    // --- 4. GÜVENİLİR HOVER (FARE) VE KOORDİNAT TAKİBİ ---
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function checkHoverAndPositions() {
        document.querySelectorAll('video').forEach(video => {
            const panels = video.igEnhancedPanels;
            if (!panels) return;

            const rect = video.getBoundingClientRect();

            if (rect.width === 0 || rect.height === 0 || rect.bottom <= 0 || rect.top >= window.innerHeight) {
                panels.time.style.opacity = '0';
                panels.vol.style.opacity = '0';
                panels.time.style.pointerEvents = 'none';
                panels.vol.style.pointerEvents = 'none';
                return;
            }

            const isStory = window.location.href.includes('/stories/');
            const docBottom = window.innerHeight;
            const bottomSpace = docBottom - rect.bottom;

            if (isStory) {
                panels.vol.classList.remove('ig-vol-downwards');
                // HİKAYELER İÇİN MERKEZİ VE TAM ORANTILI TASARIM (Media Player Hissi)
                // 1080p ve 4K monitörler arasındaki devasa orantısızlığı (ikonun daha yüksekte veya alçakta kalmasını) yok etmek için dinamik Y-ekseni hesabı.
                const storyDynamicSpacing = rect.height * 0.095; // Herkesin ekranında videonun %9.5'ine kilitlenir
                // Cevap kutucuğu veya aşağı kaydırmalarda ekran sınırları dışına taşmayı engellemek için viewport bazlı minimum güvenlik bariyeri
                const bottomOffset = Math.max(bottomSpace + storyDynamicSpacing, 70);

                const percentX = 0.0125;
                const marginX = Math.max(rect.width * percentX, 5);

                panels.time.style.top = 'auto';
                panels.time.style.bottom = bottomOffset + 'px';
                panels.time.style.left = (rect.left + marginX) + 'px';
                panels.time.style.width = (rect.width - 34 - (marginX * 2) - 10) + 'px';
                panels.time.style.maxWidth = 'none';
                panels.time.style.transform = 'none';

                panels.vol.style.top = 'auto';
                panels.vol.style.bottom = bottomOffset + 'px';
                panels.vol.style.left = (rect.right - 34 - marginX) + 'px';
                panels.vol.style.right = 'auto';
                panels.vol.style.transform = 'none';
            } else {
                panels.vol.classList.add('ig-vol-downwards');
                // REELS VE KEŞFET KONUMLANDIRMASI
                // =========================================================
                //      ORAN YÜZDELERİ (Çözünürlük Bağımsız - % Bazlı Ölçekleme)
                // =========================================================
                // Tüm cihazlarda ortalama: "5px" yatayda %1.25, "10px" dikeyde %1.25'e denk gelir (standart telefonda).
                const percentY = 0.0125; // Yukarıdan %1.25 (Ort. 10px)
                const percentX = 0.0125; // Sağdan/Soldan %1.25 (Ort. 5px)

                const marginY = Math.max(rect.height * percentY, 10);
                const marginX = Math.max(rect.width * percentX, 5);

                // =========================================================
                //      ZAMAN BARI KONUMU (Sol Üst, Yüzde Orantılı)
                // =========================================================
                panels.time.style.top = Math.max(rect.top + marginY, 10) + 'px';
                panels.time.style.bottom = 'auto';
                panels.time.style.left = (rect.left + marginX) + 'px';
                panels.time.style.transform = 'none'; // Merkezi hizalama kaldırılıp sola yaslandı
                panels.time.style.maxWidth = 'none';

                // Sağ tarafta aynı oranda boşluk ve ses ikonuna (+34px) çarpmaması için güvenlik aralığı bırakıldı.
                // Genişlik: Toplam videodan (Sağ Margin + İkon Genişliği + Güvenlik Boşluğu + Sol Margin) çıkarıldı.
                panels.time.style.width = (rect.width - 34 - (marginX * 2) - 10) + 'px';

                // =========================================================
                //      SES BARI KONUMU (Sağ Üst, Yüzde Orantılı)
                // =========================================================
                panels.vol.style.top = Math.max(rect.top + marginY, 10) + 'px';
                panels.vol.style.bottom = 'auto';
                // İkon 34px. Tamamen sağa yapışıp sadece %X kadar sola gelmesi sağlandı.
                panels.vol.style.left = (rect.right - 34 - marginX) + 'px';
                panels.vol.style.right = 'auto';
                panels.vol.style.transform = 'none';
            }

            // Fare koordinatlarına göre belirme tetiklenmesi
            if (mouseX >= rect.left && mouseX <= rect.right &&
                mouseY >= rect.top && mouseY <= rect.bottom) {

                panels.time.style.opacity = '1';
                panels.vol.style.opacity = '1';
                panels.time.style.pointerEvents = 'all';
                panels.vol.style.pointerEvents = 'all';
            } else {
                panels.time.style.opacity = '0';
                panels.vol.style.opacity = '0';
                panels.time.style.pointerEvents = 'none';
                panels.vol.style.pointerEvents = 'none';
            }
        });
    }

    function killNativeIcons() {
        // Dinamik Instagram İkonunu Gizle (Ebat Korumalı Güvenli API - Performans Optimizasyonlu)
        document.querySelectorAll('svg').forEach(s => {
            const lbl = (s.getAttribute('aria-label') || '').toLowerCase();
            const titleNode = s.querySelector('title');
            const titleText = titleNode ? titleNode.textContent.toLowerCase() : '';

            if (lbl.includes('ses') || lbl.includes('mute') || lbl.includes('audio') ||
                titleText.includes('ses') || titleText.includes('mute') || titleText.includes('audio')) {

                // "Orijinal Ses" yazılı geniş müzik çubuğunu veya Profil bloklarını kazara
                // yok etmemek için, ebeveyn hedefin kesinlikle dar bir buton olduğunu matematiksel olarak kanıtlıyoruz.
                const btn = s.closest('button, [role="button"]');
                if (btn && btn.clientWidth > 0 && btn.clientWidth < 65 && btn.clientHeight < 65) {
                    s.style.display = 'none';
                    btn.style.display = 'none';
                    btn.style.pointerEvents = 'none';
                }
            }
        });
    }

    // --- 5. PERİYODİK GÜNCELLEMELER (Temizlik ve Yapılandırma) ---
    setInterval(() => {
        // DOM'dan silinmiş videoların hayalet panellerini sayfa üzerinde asılı kalmamaları için kalıcı olarak sil
        for (let i = injectedUIs.length - 1; i >= 0; i--) {
            if (!injectedUIs[i].video.isConnected) {
                if (injectedUIs[i].time) injectedUIs[i].time.remove();
                if (injectedUIs[i].vol) injectedUIs[i].vol.remove();
                injectedUIs.splice(i, 1);
            }
        }

        createUI();
        killNativeIcons();

        document.querySelectorAll('video, audio').forEach(v => {
            if (v.volume !== currentGlobalVolume) {
                v.volume = currentGlobalVolume;
            }
            if (currentGlobalVolume > 0 && v.muted) {
                v.muted = false;
            }
        });
    }, 200);

    // --- 6. AKICI KONUMLANDIRMA DÖNGÜSÜ (60 FPS - Titreme ve Zıplamaları Önler) ---
    function animationLoop() {
        checkHoverAndPositions();
        requestAnimationFrame(animationLoop);
    }
    requestAnimationFrame(animationLoop);

})();