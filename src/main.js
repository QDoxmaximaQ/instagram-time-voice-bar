/**
 * Instagram Ses ve Süre Kontrolü - Ana Uygulama Orkestratörü (Pro)
 */
(function () {
    const {
        State,
        Icons,
        MasterLayer,
        VideoDetector,
        TimeBar,
        VolumeBar,
        Positioner,
        NativeKiller,
        Keyboard
    } = window.__IG_ENHANCED__;

    function cleanupGhostPanels() {
        const injectedUIs = State.getInjectedUIs();
        for (let i = injectedUIs.length - 1; i >= 0; i--) {
            const item = injectedUIs[i];
            if (!item.video || !item.video.isConnected) {
                if (item.time) item.time.remove();
                if (item.vol) item.vol.remove();
                State.removeInjectedUIAt(i);
            }
        }
    }

    function updateAllVolumes(val) {
        const currentGlobalVolume = State.setVolume(val);
        const pct = Math.round(currentGlobalVolume * 100) + '%';
        const p = currentGlobalVolume * 100;
        const iconSvg = Icons.renderVolumeIcon(currentGlobalVolume);

        document.querySelectorAll('.ig-v-pct').forEach((el) => {
            el.innerText = pct;
        });

        document.querySelectorAll('.ig-v-slider').forEach((slider) => {
            slider.value = currentGlobalVolume;
            const grad = (State && State.getFillGradient)
                ? State.getFillGradient('to top', p)
                : `linear-gradient(to top, #ffffff ${p}%, rgba(255, 255, 255, 0.28) ${p}%)`;
            slider.style.setProperty('background-image', grad, 'important');
        });

        document.querySelectorAll('.ig-vol-icon-btn').forEach((btn) => {
            btn.innerHTML = iconSvg;
        });

        const activeModal = VideoDetector.getActiveModal();
        const activePlayingVideo = State.getActivePlayingVideo();

        document.querySelectorAll('video, audio').forEach((v) => {
            // Arka plandaki, modal dışındaki veya carousel'de gizli videoları sustur
            if (VideoDetector.isBackgroundVideo(v, activeModal)) {
                v.muted = true;
                return;
            }

            v.volume = currentGlobalVolume;
            if (currentGlobalVolume > 0 && !v.paused) {
                // Eğer odaklı bir video varsa sadece onun sesini aç (Ses çakışmasını önler)
                if (activePlayingVideo && v !== activePlayingVideo && !activeModal) {
                    v.muted = true;
                } else {
                    v.muted = false;
                }
            } else if (currentGlobalVolume === 0) {
                v.muted = true;
            }
        });
    }

    function createUI() {
        const masterLayer = MasterLayer.get();

        document.querySelectorAll('video').forEach((video) => {
            // 1. Zaten paneli varsa ve bağlıysa tekrar ekleme (Çift bar koruması)
            if (video.igEnhancedPanels && video.igEnhancedPanels.time.isConnected) {
                return;
            }

            // 2. Carousel'de gizli veya sıfır boyutlu videolara gereksiz panel basma
            if (VideoDetector.isCarouselHidden(video)) {
                return;
            }

            // 3. Aynı gönderi içindeki ikincil / bulanık dolgu videolarına panel basma (Çift bar koruması)
            if (VideoDetector.isSecondaryVideoInPost && VideoDetector.isSecondaryVideoInPost(video)) {
                return;
            }

            video.dataset.hasEnhancedUI = 'true';

            video.addEventListener('play', () => {
                const activeModal = VideoDetector.getActiveModal();
                if (VideoDetector.isBackgroundVideo(video, activeModal)) {
                    video.pause();
                    video.muted = true;
                    return;
                }

                // Keşfet sayfasında ızgara videosu oynatılırken diğer ızgara videolarını durdur
                if (window.location.pathname.startsWith('/explore')) {
                    document.querySelectorAll('video').forEach((other) => {
                        if (other !== video && !other.paused) {
                            other.pause();
                            other.muted = true;
                        }
                    });
                } else {
                    // Ana akışta ve diğer sayfalarda tekil ses kaynağı: Diğer videoları hemen sustur
                    document.querySelectorAll('video').forEach((other) => {
                        if (other !== video) {
                            other.muted = true;
                        }
                    });
                }

                State.setActivePlayingVideo(video);

                const currentVol = State.getVolume();
                video.volume = currentVol;
                if (currentVol > 0) {
                    video.muted = false;
                }
            });

            // 1. Zaman Barı
            const timeBar = TimeBar.create(video);

            // 2. Ses Barı
            const volumeBar = VolumeBar.create(video, updateAllVolumes);

            masterLayer.appendChild(timeBar.panel);
            masterLayer.appendChild(volumeBar.panel);

            video.igEnhancedPanels = {
                time: timeBar.panel,
                vol: volumeBar.panel
            };

            State.addInjectedUI({
                video: video,
                time: timeBar.panel,
                vol: volumeBar.panel,
                timeSlider: timeBar.slider,
                updateTimeGradient: timeBar.updateGradient,
                volSlider: volumeBar.slider,
                updateVolGradient: volumeBar.updateGradient
            });
        });
    }

    // --- PERİYODİK GÜNCELLEMELER (Temizlik ve İyileştirme) ---
    setInterval(() => {
        const currentGlobalVolume = State.getVolume();
        const mouse = State.getMouse();

        cleanupGhostPanels();
        createUI();
        NativeKiller.killNativeIcons();

        const activeModal = VideoDetector.getActiveModal();

        document.querySelectorAll('video, audio').forEach((v) => {
            if (VideoDetector.isBackgroundVideo(v, activeModal)) {
                if (!v.paused) v.pause();
                v.muted = true;
                return;
            }

            // Sadece Keşfet ızgarasındayken fare üzerinde olmayan videoları durdur
            if (window.location.pathname.startsWith('/explore') && !activeModal) {
                const rect = v.getBoundingClientRect();
                const isHovered =
                    mouse.x >= rect.left &&
                    mouse.x <= rect.right &&
                    mouse.y >= rect.top &&
                    mouse.y <= rect.bottom;
                const panels = v.igEnhancedPanels;
                const isDragging =
                    panels &&
                    (panels.time.querySelector('input:active') ||
                        panels.vol.querySelector('input:active'));

                if (!isHovered && !isDragging) {
                    if (!v.paused) v.pause();
                    v.muted = true;
                    return;
                } else if (isHovered && v.paused) {
                    v.play().catch(() => {});
                    v.volume = currentGlobalVolume;
                    if (currentGlobalVolume > 0) {
                        v.muted = false;
                    }
                }
            }

            if (v.volume !== currentGlobalVolume) {
                v.volume = currentGlobalVolume;
            }
            if (currentGlobalVolume > 0 && !v.paused && v.muted) {
                v.muted = false;
            }
        });
    }, 200);

    // Modal açıldığında veya yeni video yüklendiğinde anında UI bağlama (Gecikmesiz)
    const observer = new MutationObserver(() => {
        cleanupGhostPanels();
        createUI();
        NativeKiller.killNativeIcons();
    });

    const observeRoot = () => {
        const target = document.body || document.documentElement;
        if (target) {
            observer.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-hidden', 'style'] });
        }
    };

    if (document.body) {
        observeRoot();
    } else {
        document.addEventListener('DOMContentLoaded', observeRoot);
    }

    // Klavye kısayollarını başlat
    if (Keyboard && typeof Keyboard.setup === 'function') {
        Keyboard.setup();
    }

    // --- AKICI KONUMLANDIRMA DÖNGÜSÜ (60 FPS - Titreme ve Zıplamaları Önler) ---
    function animationLoop() {
        Positioner.checkHoverAndPositions();
        requestAnimationFrame(animationLoop);
    }
    requestAnimationFrame(animationLoop);

    // Dışa aktarma
    window.__IG_ENHANCED__.updateAllVolumes = updateAllVolumes;
    window.__IG_ENHANCED__.createUI = createUI;
})();
