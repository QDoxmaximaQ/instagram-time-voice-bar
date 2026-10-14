/**
 * Instagram Ses ve Süre Kontrolü - Gelişmiş Durum ve doxmaxima-player Ayarları (State Pro)
 */
(function () {
    window.__IG_ENHANCED__ = window.__IG_ENHANCED__ || {};

    let initialVol = parseFloat(localStorage.getItem('ig_enhanced_vol'));
    if (isNaN(initialVol)) initialVol = 0.5;
    let currentGlobalVolume = Math.min(Math.max(initialVol, 0), 1);

    const injectedUIs = []; // Sahnedeki kayıtlı video panelleri
    let activePlayingVideo = null; // Şu an sesi açık ve odaklı olan tekil video

    const mouse = {
        x: -1,
        y: -1,
        lastScrollTime: 0
    };

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        mouse.x = -1;
        mouse.y = -1;
    });

    // Sayfa kaydırıldığında da koordinat tazeliğini koru
    window.addEventListener('scroll', () => {
        mouse.lastScrollTime = performance.now();
    }, { passive: true });

    // =========================================================
    //            doxmaxima-player ÖZELLEŞTİRME AYARLARI        
    // =========================================================
    const THEMES = {
        white: {
            name: 'Klasik Beyaz',
            c1: '#ffffff',
            c2: '#ffffff',
            glow: 'rgba(255, 255, 255, 0.7)'
        },
        sunset: {
            name: 'Instagram Sunset',
            c1: '#f09433',
            c2: '#dc2743',
            c3: '#bc1888',
            glow: 'rgba(220, 39, 67, 0.7)'
        },
        cyan: {
            name: 'Neon Cyan',
            c1: '#00f2fe',
            c2: '#4facfe',
            glow: 'rgba(0, 242, 254, 0.7)'
        },
        emerald: {
            name: 'Zümrüt Yeşili',
            c1: '#00e676',
            c2: '#00b0ff',
            glow: 'rgba(0, 230, 118, 0.7)'
        },
        gold: {
            name: 'Altın Sarısı',
            c1: '#ffd700',
            c2: '#ff8800',
            glow: 'rgba(255, 215, 0, 0.7)'
        }
    };

    const DEFAULT_SETTINGS = {
        enableTimeBar: true,
        enableVolumeBar: true,
        enableKeyboard: true,
        theme: 'white',
        customType: 'solid',
        customColor1: '#ff007f',
        customColor2: '#7928ca',
        bgOpacity: 72,
        blurAmount: 12,
        thickness: 5,
        borderRadius: 12
    };

    let currentSettings = { ...DEFAULT_SETTINGS };

    function hexToRgba(hex, alpha = 0.7) {
        if (!hex) return `rgba(255, 255, 255, ${alpha})`;
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function getThemeData() {
        const themeKey = currentSettings.theme || 'white';
        if (themeKey === 'custom') {
            const isGrad = currentSettings.customType === 'gradient';
            const c1 = currentSettings.customColor1 || '#ff007f';
            const c2 = isGrad ? (currentSettings.customColor2 || '#7928ca') : c1;
            return {
                name: 'Özel',
                c1: c1,
                c2: c2,
                glow: hexToRgba(c1, 0.75),
                isCustom: true
            };
        }
        return THEMES[themeKey] || THEMES.white;
    }

    function getFillGradient(direction, percent) {
        const p = Math.min(Math.max(percent, 0), 100);
        const th = getThemeData();

        if (th.c3) {
            return `linear-gradient(${direction}, ${th.c1} 0%, ${th.c2} ${(p * 0.5).toFixed(1)}%, ${th.c3} ${p.toFixed(1)}%, rgba(255, 255, 255, 0.28) ${p.toFixed(1)}%)`;
        } else {
            return `linear-gradient(${direction}, ${th.c1} 0%, ${th.c2} ${p.toFixed(1)}%, rgba(255, 255, 255, 0.28) ${p.toFixed(1)}%)`;
        }
    }

    function applyDoxSettings(settings) {
        if (!settings) return;
        currentSettings = { ...currentSettings, ...settings };

        const th = getThemeData();
        const opacity = (currentSettings.bgOpacity !== undefined ? currentSettings.bgOpacity : 72) / 100;
        const isZeroOpacity = currentSettings.bgOpacity === 0;
        const borderAlpha = (opacity * 0.25).toFixed(3);
        const blur = currentSettings.blurAmount !== undefined ? currentSettings.blurAmount : 12;
        const radius = currentSettings.borderRadius !== undefined ? currentSettings.borderRadius : 12;
        const thickness = currentSettings.thickness !== undefined ? currentSettings.thickness : 5;

        // 1. Dinamik <style id="doxmaxima-dynamic-style"> etiketini oluştur veya güncelle
        let styleTag = document.getElementById('doxmaxima-dynamic-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'doxmaxima-dynamic-style';
            const targetParent = document.head || document.documentElement || document.body;
            if (targetParent) {
                targetParent.appendChild(styleTag);
            }
        }

        if (styleTag) {
            const blurFilter = (!isZeroOpacity && blur > 0) ? `blur(${blur}px) saturate(180%)` : 'none';
            const bgStyle = isZeroOpacity ? 'transparent' : `rgba(18, 18, 22, ${opacity})`;
            const borderStyle = isZeroOpacity ? 'none' : `1px solid rgba(255, 255, 255, ${borderAlpha})`;
            const shadowStyle = isZeroOpacity ? 'none' : `0 8px 24px rgba(0, 0, 0, ${(opacity * 0.5).toFixed(3)}), inset 0 1px 1px rgba(255, 255, 255, ${(opacity * 0.15).toFixed(3)})`;

            styleTag.textContent = `
                .ig-time-container {
                    display: ${currentSettings.enableTimeBar ? 'flex' : 'none'} !important;
                    background: ${bgStyle} !important;
                    border: ${borderStyle} !important;
                    box-shadow: ${shadowStyle} !important;
                    backdrop-filter: ${blurFilter} !important;
                    -webkit-backdrop-filter: ${blurFilter} !important;
                    border-radius: ${radius}px !important;
                }
                .ig-vol-widget {
                    display: ${currentSettings.enableVolumeBar ? 'flex' : 'none'} !important;
                    background: ${bgStyle} !important;
                    border: ${borderStyle} !important;
                    box-shadow: ${shadowStyle} !important;
                    backdrop-filter: ${blurFilter} !important;
                    -webkit-backdrop-filter: ${blurFilter} !important;
                    border-radius: ${radius}px !important;
                }
                .ig-h-slider {
                    height: ${thickness}px !important;
                    filter: drop-shadow(0 0 2px ${th.glow}) !important;
                }
                .ig-h-slider:hover, .ig-h-slider:active {
                    height: ${thickness + 2}px !important;
                }
                .ig-v-slider {
                    width: ${thickness}px !important;
                    filter: drop-shadow(0 0 2px ${th.glow}) !important;
                }
                .ig-v-slider:hover, .ig-v-slider:active {
                    width: ${thickness + 2}px !important;
                }
                .ig-slider::-webkit-slider-thumb {
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 8px ${th.glow} !important;
                }
                .ig-slider:hover::-webkit-slider-thumb, .ig-slider:active::-webkit-slider-thumb {
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.9), 0 0 14px ${th.glow} !important;
                }
                .ig-vol-icon-btn svg {
                    filter: drop-shadow(0 0 3px ${th.glow}) !important;
                }
                .ig-vol-icon-btn:hover svg {
                    fill: ${th.c2 || th.c1} !important;
                    filter: drop-shadow(0 0 8px ${th.glow}) !important;
                }
            `;
        }

        // 2. Kök değişkenleri eşzamanla
        const root = document.documentElement;
        if (root) {
            root.style.setProperty('--dox-time-display', currentSettings.enableTimeBar ? 'flex' : 'none');
            root.style.setProperty('--dox-vol-display', currentSettings.enableVolumeBar ? 'flex' : 'none');
            root.style.setProperty('--dox-bg', isZeroOpacity ? 'transparent' : `rgba(18, 18, 22, ${opacity})`);
            root.style.setProperty('--dox-border-color', isZeroOpacity ? 'transparent' : `rgba(255, 255, 255, ${borderAlpha})`);
            root.style.setProperty('--dox-blur', `${isZeroOpacity ? 0 : blur}px`);
            root.style.setProperty('--dox-border-radius', `${radius}px`);
            root.style.setProperty('--dox-bar-thickness', `${thickness}px`);
            root.style.setProperty('--dox-accent-glow', th.glow);
        }

        // 3. Mevcut tüm ses barlarını anında yeni temayla boya
        if (window.__IG_ENHANCED__.updateAllVolumes) {
            window.__IG_ENHANCED__.updateAllVolumes(currentGlobalVolume);
        }

        // 4. Mevcut tüm zaman barlarını anında yeni temayla boya
        injectedUIs.forEach((item) => {
            if (item.video && item.updateTimeGradient) {
                const dur = item.video.duration;
                const p = (Number.isFinite(dur) && dur > 0) ? (item.video.currentTime / dur) * 1000 : 0;
                item.updateTimeGradient(p);
            }
        });
    }

    function initSettings() {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['doxmaxima_settings'], (res) => {
                if (res && res.doxmaxima_settings) {
                    applyDoxSettings(res.doxmaxima_settings);
                } else {
                    applyDoxSettings(DEFAULT_SETTINGS);
                }
            });

            chrome.storage.onChanged.addListener((changes, area) => {
                if (area === 'local' && changes.doxmaxima_settings) {
                    applyDoxSettings(changes.doxmaxima_settings.newValue);
                }
            });
        } else {
            const saved = localStorage.getItem('doxmaxima_settings');
            if (saved) {
                try { applyDoxSettings(JSON.parse(saved)); } catch (e) { applyDoxSettings(DEFAULT_SETTINGS); }
            } else {
                applyDoxSettings(DEFAULT_SETTINGS);
            }
        }

        // Popup üzerinden anlık gelen mesajları dinle
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener((msg) => {
                if (msg && msg.type === 'DOX_SETTINGS_UPDATED') {
                    applyDoxSettings(msg.settings);
                }
            });
        }

        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'DOX_SETTINGS_UPDATED') {
                applyDoxSettings(e.data.settings);
            }
        });
    }

    if (document.documentElement) {
        initSettings();
    } else {
        document.addEventListener('DOMContentLoaded', initSettings);
    }

    window.__IG_ENHANCED__.State = {
        getVolume() {
            return currentGlobalVolume;
        },
        setVolume(val) {
            currentGlobalVolume = Math.min(Math.max(parseFloat(val) || 0, 0), 1);
            localStorage.setItem('ig_enhanced_vol', currentGlobalVolume);
            return currentGlobalVolume;
        },
        getInjectedUIs() {
            return injectedUIs;
        },
        removeInjectedUIAt(index) {
            return injectedUIs.splice(index, 1);
        },
        addInjectedUI(entry) {
            injectedUIs.push(entry);
        },
        findInjectedUIByVideo(video) {
            return injectedUIs.find(item => item.video === video);
        },
        getMouse() {
            return mouse;
        },
        getActivePlayingVideo() {
            return activePlayingVideo;
        },
        setActivePlayingVideo(video) {
            activePlayingVideo = video;
        },
        getSettings() {
            return currentSettings;
        },
        applySettings: applyDoxSettings,
        getFillGradient,
        getThemeData,
        hexToRgba,
        THEMES,
        DEFAULT_SETTINGS
    };
})();
