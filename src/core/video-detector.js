/**
 * Instagram Ses ve Süre Kontrolü - Gelişmiş Video ve Modal Tespiti (Pro)
 */
(function () {
    window.__IG_ENHANCED__ = window.__IG_ENHANCED__ || {};

    function getActiveModal() {
        const dialogs = document.querySelectorAll('div[role="dialog"], [aria-modal="true"]');
        for (const d of dialogs) {
            const rect = d.getBoundingClientRect();
            if (rect.width > 120 && rect.height > 120) {
                return d;
            }
        }
        return null;
    }

    function isBlurredBackgroundVideo(video) {
        if (!video) return false;
        const style = window.getComputedStyle(video);
        if (style.filter && style.filter.includes('blur')) return true;
        if (video.parentElement) {
            const pStyle = window.getComputedStyle(video.parentElement);
            if (pStyle.filter && pStyle.filter.includes('blur')) return true;
        }
        return false;
    }

    function isCarouselHidden(video) {
        if (!video || !video.isConnected) return true;

        // 1. Instagram carousel aktif olmayan slayt etiketi
        if (video.closest('[aria-hidden="true"]')) {
            return true;
        }

        // 2. Sıfır boyut kontrolü
        if (video.offsetWidth === 0 || video.offsetHeight === 0) {
            return true;
        }

        // 3. Ebeveyn veya kendi görünürlük stili
        const style = window.getComputedStyle(video);
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.05) {
            return true;
        }

        // 4. Bulanık arka plan dolgu videosu kontrolü
        if (isBlurredBackgroundVideo(video)) {
            return true;
        }

        return false;
    }

    function isSecondaryVideoInPost(video) {
        if (!video || !video.isConnected) return false;

        // Aynı gönderi (article veya kart) içindeki diğer videoları bul
        const post = video.closest('article, [role="presentation"], div[data-blade-container]');
        if (!post) return false;

        const postVideos = Array.from(post.querySelectorAll('video')).filter(
            v => v.isConnected && v.offsetWidth > 0 && v.offsetHeight > 0 && !isCarouselHidden(v)
        );

        if (postVideos.length <= 1) return false;

        // Gönderi içinde birden fazla video varsa, hangisi birincil?
        // 1. Çalmakta olan video
        let primary = postVideos.find(v => !v.paused && v.currentTime > 0);

        // 2. Eğer hiçbiri çalmıyorsa, süresi daha ileri olan
        if (!primary) {
            primary = postVideos.reduce((prev, curr) => (curr.currentTime > prev.currentTime ? curr : prev), postVideos[0]);
        }

        // 3. Bulanık olmayan video önceliği
        if (primary && isBlurredBackgroundVideo(primary)) {
            const nonBlurred = postVideos.find(v => !isBlurredBackgroundVideo(v));
            if (nonBlurred) primary = nonBlurred;
        }

        return primary && video !== primary;
    }

    function isBackgroundVideo(video, activeModal) {
        if (!video || !video.isConnected) return true;
        if (isCarouselHidden(video)) return true;
        if (isSecondaryVideoInPost(video)) return true;

        const modal = activeModal !== undefined ? activeModal : getActiveModal();

        // 1. Ekranda aktif bir modal varsa ve video bu modalın dışındaysa:
        if (modal) {
            if (!modal.contains(video)) {
                return true;
            }
        }

        // 2. Keşfet veya profilden posta tıklandığında URL /p/ veya /reel/ olur
        const path = window.location.pathname;
        if (path.startsWith('/p/') || path.startsWith('/reel/')) {
            const allVideos = Array.from(document.querySelectorAll('video')).filter(v => {
                const r = v.getBoundingClientRect();
                return r.width > 0 && r.height > 0 && !isCarouselHidden(v) && !isSecondaryVideoInPost(v);
            });
            if (allVideos.length > 1) {
                const modalVid = allVideos.find(v => v.closest('div[role="dialog"], [aria-modal="true"], article')) || allVideos[allVideos.length - 1];
                if (modalVid && video !== modalVid) {
                    return true;
                }
            }
        }

        // 3. Fiziksel örtülme kontrolü (Sadece ekranda bir modal/dialog varken çalıştırılır)
        if (modal) {
            const rect = video.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                if (cx >= 0 && cx <= window.innerWidth && cy >= 0 && cy <= window.innerHeight) {
                    const el = document.elementFromPoint(cx, cy);
                    if (el) {
                        const elDialog = el.closest('div[role="dialog"], [aria-modal="true"]');
                        const vidDialog = video.closest('div[role="dialog"], [aria-modal="true"]');
                        if (elDialog && (!vidDialog || elDialog !== vidDialog)) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    // Keşfet veya profil ızgarasında bir videoya tıklandığında arka plandaki videoyu ve barlarını hemen sustur/gizle
    document.addEventListener('click', (e) => {
        if (e.target.closest('div[role="dialog"], [aria-modal="true"]')) {
            return;
        }

        const postLink = e.target.closest('a[href*="/p/"], a[href*="/reel/"]');
        if (postLink) {
            const gridVideo = postLink.querySelector('video') || e.target.closest('div')?.querySelector('video');
            if (gridVideo) {
                gridVideo.pause();
                gridVideo.muted = true;
                if (gridVideo.igEnhancedPanels) {
                    gridVideo.igEnhancedPanels.time.style.opacity = '0';
                    gridVideo.igEnhancedPanels.vol.style.opacity = '0';
                    gridVideo.igEnhancedPanels.time.style.pointerEvents = 'none';
                    gridVideo.igEnhancedPanels.vol.style.pointerEvents = 'none';
                }
            }
        }
    }, true);

    window.__IG_ENHANCED__.VideoDetector = {
        getActiveModal,
        isCarouselHidden,
        isBlurredBackgroundVideo,
        isSecondaryVideoInPost,
        isBackgroundVideo
    };
})();
