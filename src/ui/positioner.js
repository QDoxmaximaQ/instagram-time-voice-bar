/**
 * Instagram Ses ve Süre Kontrolü - Çakışma Önleyici Konumlandırma Motoru (Pro)
 */
(function () {
    window.__IG_ENHANCED__ = window.__IG_ENHANCED__ || {};

    let cachedExploreHeaderBottom = 0;
    let lastHeaderCheckTime = 0;

    function getExploreHeaderBottom() {
        const now = performance.now();
        if (now - lastHeaderCheckTime < 600) {
            return cachedExploreHeaderBottom;
        }
        lastHeaderCheckTime = now;

        let bottom = 0;
        const banners = document.querySelectorAll('header, [role="banner"]');
        for (const b of banners) {
            const r = b.getBoundingClientRect();
            if (r.top <= 5 && r.bottom > bottom && r.bottom < 150) {
                bottom = r.bottom;
            }
        }

        const headings = document.querySelectorAll('h1, h2, h3, [role="heading"], a[href*="/explore/"]');
        for (const h of headings) {
            const r = h.getBoundingClientRect();
            if (r.top >= 0 && r.bottom < 150 && r.bottom > bottom) {
                bottom = r.bottom;
            }
        }

        if (bottom === 0 && window.location.pathname.startsWith('/explore')) {
            bottom = 50;
        }

        cachedExploreHeaderBottom = bottom;
        return bottom;
    }

    function checkHoverAndPositions() {
        const { State, VideoDetector } = window.__IG_ENHANCED__;
        const mouse = State.getMouse();
        const currentGlobalVolume = State.getVolume();
        const activeModal = VideoDetector.getActiveModal();
        const isExplore = window.location.pathname.startsWith('/explore');
        const exploreHeaderBottom = isExplore ? getExploreHeaderBottom() : 0;
        const isExploreGrid = isExplore && !activeModal;
        const injectedUIs = State.getInjectedUIs();

        const activeCandidates = [];

        for (let i = 0; i < injectedUIs.length; i++) {
            const item = injectedUIs[i];
            const video = item.video;
            const timePanel = item.time;
            const volPanel = item.vol;

            if (!video || !video.isConnected || !timePanel || !volPanel) continue;

            // 1. Arka planda kalan, carousel'de gizli veya ikincil/bulanık video kontrolü
            if (VideoDetector.isBackgroundVideo(video, activeModal)) {
                if (!video.paused) {
                    video.pause();
                }
                video.muted = true;
                timePanel.style.opacity = '0';
                volPanel.style.opacity = '0';
                timePanel.style.pointerEvents = 'none';
                volPanel.style.pointerEvents = 'none';
                continue;
            }

            const rect = video.getBoundingClientRect();

            // 2. Ekran dışı / sıfır boyut koruması
            if (
                rect.width === 0 ||
                rect.height === 0 ||
                rect.bottom <= 0 ||
                rect.top >= window.innerHeight ||
                rect.right <= 0 ||
                rect.left >= window.innerWidth
            ) {
                timePanel.style.opacity = '0';
                volPanel.style.opacity = '0';
                timePanel.style.pointerEvents = 'none';
                volPanel.style.pointerEvents = 'none';
                continue;
            }

            // 3. Header ve ekran dışı koruması
            if (rect.top < exploreHeaderBottom) {
                timePanel.style.opacity = '0';
                volPanel.style.opacity = '0';
                timePanel.style.pointerEvents = 'none';
                volPanel.style.pointerEvents = 'none';
                continue;
            }

            const isStory = window.location.href.includes('/stories/');
            const docBottom = window.innerHeight;
            const bottomSpace = docBottom - rect.bottom;

            if (isStory) {
                volPanel.classList.remove('ig-vol-downwards');
                const storyDynamicSpacing = rect.height * 0.095;
                const bottomOffset = Math.max(bottomSpace + storyDynamicSpacing, 70);

                const percentX = 0.0125;
                const marginX = Math.max(rect.width * percentX, 6);

                timePanel.style.top = 'auto';
                timePanel.style.bottom = bottomOffset + 'px';
                timePanel.style.left = (rect.left + marginX) + 'px';
                timePanel.style.width = (rect.width - 36 - (marginX * 2) - 10) + 'px';
                timePanel.style.maxWidth = 'none';
                timePanel.style.transform = 'none';

                volPanel.style.top = 'auto';
                volPanel.style.bottom = bottomOffset + 'px';
                volPanel.style.left = (rect.right - 36 - marginX) + 'px';
                volPanel.style.right = 'auto';
                volPanel.style.transform = 'none';
            } else {
                volPanel.classList.add('ig-vol-downwards');
                const percentY = 0.0125;
                const percentX = 0.0125;

                const marginY = Math.max(rect.height * percentY, 10);
                const marginX = Math.max(rect.width * percentX, 6);

                const targetTop = rect.top + marginY;

                // Sadece Instagram Explore (/explore) ızgara videoları için orantılı düzen sınıfını etkinleştir
                if (isExploreGrid) {
                    timePanel.classList.add('ig-explore-time');
                } else {
                    timePanel.classList.remove('ig-explore-time');
                }

                timePanel.style.top = targetTop + 'px';
                timePanel.style.bottom = 'auto';
                timePanel.style.left = (rect.left + marginX) + 'px';
                timePanel.style.transform = 'none';
                timePanel.style.maxWidth = 'none';
                timePanel.style.width = (rect.width - 36 - (marginX * 2) - 10) + 'px';

                volPanel.style.top = targetTop + 'px';
                volPanel.style.bottom = 'auto';
                volPanel.style.left = (rect.right - 36 - marginX) + 'px';
                volPanel.style.right = 'auto';
                volPanel.style.transform = 'none';
            }

            // 4. Fare koordinatlarına ve aktif slider etkileşimine göre aday belirleme
            const isHovered =
                mouse.x >= rect.left &&
                mouse.x <= rect.right &&
                mouse.y >= rect.top &&
                mouse.y <= rect.bottom;
            const isDragging =
                timePanel.querySelector('input:active') ||
                volPanel.querySelector('input:active');

            if (isExploreGrid) {
                if (!isHovered && !isDragging) {
                    if (!video.paused) {
                        video.pause();
                    }
                    video.muted = true;
                } else if (isHovered && video.paused) {
                    video.play().catch(() => {});
                    video.volume = currentGlobalVolume;
                    if (currentGlobalVolume > 0) {
                        video.muted = false;
                    }
                }
            }

            if (isHovered || isDragging) {
                activeCandidates.push({
                    item,
                    video,
                    rect,
                    timePanel,
                    volPanel,
                    isHovered,
                    isDragging
                });
            } else {
                timePanel.style.opacity = '0';
                volPanel.style.opacity = '0';
                timePanel.style.pointerEvents = 'none';
                volPanel.style.pointerEvents = 'none';
            }
        }

        // =========================================================================
        //   UZAMSAL ÇAKIŞMA HAKEMİ (Spatial Collision Arbiter - Çift Barı Kökten Engeller)
        // =========================================================================
        for (let a = 0; a < activeCandidates.length; a++) {
            for (let b = a + 1; b < activeCandidates.length; b++) {
                const c1 = activeCandidates[a];
                const c2 = activeCandidates[b];
                if (!c1 || !c2) continue;

                // İki videonun ekrandaki çakışma miktarını hesapla
                const minWidth = Math.min(c1.rect.width, c2.rect.width);
                const xOverlap = Math.max(0, Math.min(c1.rect.right, c2.rect.right) - Math.max(c1.rect.left, c2.rect.left));
                const yOverlap = Math.max(0, Math.min(c1.rect.bottom, c2.rect.bottom) - Math.max(c1.rect.top, c2.rect.top));

                // Yatayda %50'den fazla ve dikeyde en az 40px çakışıyorlarsa AYNI GÖNDERİDEDİRLER!
                if (xOverlap > minWidth * 0.5 && yOverlap > 40) {
                    let winner = c1;
                    let loser = c2;

                    const c1Playing = !c1.video.paused && c1.video.currentTime > 0;
                    const c2Playing = !c2.video.paused && c2.video.currentTime > 0;

                    if (!c1Playing && c2Playing) {
                        winner = c2;
                        loser = c1;
                    } else if (c1Playing && !c2Playing) {
                        winner = c1;
                        loser = c2;
                    } else if (c2.video.currentTime > c1.video.currentTime) {
                        winner = c2;
                        loser = c1;
                    } else if (c1.video.currentTime > c2.video.currentTime) {
                        winner = c1;
                        loser = c2;
                    } else if (VideoDetector.isBlurredBackgroundVideo && VideoDetector.isBlurredBackgroundVideo(c1.video)) {
                        winner = c2;
                        loser = c1;
                    } else if (VideoDetector.isBlurredBackgroundVideo && VideoDetector.isBlurredBackgroundVideo(c2.video)) {
                        winner = c1;
                        loser = c2;
                    } else if (c1.video.compareDocumentPosition && (c1.video.compareDocumentPosition(c2.video) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                        winner = c2;
                        loser = c1;
                    }

                    // Kaybeden videonun panellerini kesinlikle gizle ve etkisiz kıl
                    loser.timePanel.style.opacity = '0';
                    loser.volPanel.style.opacity = '0';
                    loser.timePanel.style.pointerEvents = 'none';
                    loser.volPanel.style.pointerEvents = 'none';

                    if (winner === c1) {
                        activeCandidates[b] = null;
                    } else {
                        activeCandidates[a] = null;
                    }
                }
            }
        }

        // Kazanan gerçek adayların panellerini göster
        for (let i = 0; i < activeCandidates.length; i++) {
            const winner = activeCandidates[i];
            if (!winner) continue;

            const settings = State.getSettings ? State.getSettings() : null;
            const showTime = !settings || settings.enableTimeBar !== false;
            const showVol = !settings || settings.enableVolumeBar !== false;

            winner.timePanel.style.opacity = showTime ? '1' : '0';
            winner.timePanel.style.pointerEvents = showTime ? 'all' : 'none';

            winner.volPanel.style.opacity = showVol ? '1' : '0';
            winner.volPanel.style.pointerEvents = showVol ? 'all' : 'none';

            if (winner.isHovered && !winner.video.paused) {
                State.setActivePlayingVideo(winner.video);
            }
        }
    }

    window.__IG_ENHANCED__.Positioner = {
        getExploreHeaderBottom,
        checkHoverAndPositions
    };
})();
