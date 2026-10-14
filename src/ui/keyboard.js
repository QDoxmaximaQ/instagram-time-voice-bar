/**
 * Instagram Ses ve Süre Kontrolü - Akıllı Klavye Kısayolları (Keyboard Shortcuts Pro)
 */
(function () {
    window.__IG_ENHANCED__ = window.__IG_ENHANCED__ || {};

    let toastEl = null;
    let toastTimeout = null;

    function showToast(text) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'ig-toast-hint';
            document.body.appendChild(toastEl);
        }
        toastEl.innerText = text;
        toastEl.style.opacity = '1';

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            if (toastEl) toastEl.style.opacity = '0';
        }, 1200);
    }

    function isInputFocused() {
        const active = document.activeElement;
        if (!active) return false;
        const tag = active.tagName.toLowerCase();
        return (
            tag === 'input' ||
            tag === 'textarea' ||
            active.isContentEditable ||
            active.getAttribute('role') === 'textbox'
        );
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Yorum yazarken veya DM'de iken kısayolları engelle
            if (isInputFocused()) return;

            const { State, VideoDetector, Formatters } = window.__IG_ENHANCED__;
            const settings = State.getSettings ? State.getSettings() : null;
            if (settings && settings.enableKeyboard === false) return;

            const mouse = State.getMouse();

            // Fare imlecinin altındaki videoyu veya o an çalan aktif videoyu bul
            const allVideos = Array.from(document.querySelectorAll('video')).filter(
                (v) => !VideoDetector.isCarouselHidden(v)
            );

            const targetVideo =
                allVideos.find((v) => {
                    const r = v.getBoundingClientRect();
                    return (
                        mouse.x >= r.left &&
                        mouse.x <= r.right &&
                        mouse.y >= r.top &&
                        mouse.y <= r.bottom
                    );
                }) ||
                State.getActivePlayingVideo() ||
                allVideos.find((v) => !v.paused);

            if (!targetVideo) return;

            const key = e.key.toLowerCase();

            // 1. Mute / Unmute ('M')
            if (key === 'm') {
                e.preventDefault();
                const currentVol = State.getVolume();
                if (currentVol > 0) {
                    window.__IG_ENHANCED__.updateAllVolumes(0);
                    showToast('🔇 Sessiz');
                } else {
                    window.__IG_ENHANCED__.updateAllVolumes(0.5);
                    showToast('🔊 %50');
                }
            }

            // 2. Ses Ayarı (Yukarı / Aşağı Ok)
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const newVol = Math.min(State.getVolume() + 0.05, 1);
                window.__IG_ENHANCED__.updateAllVolumes(newVol);
                showToast(`🔊 %${Math.round(newVol * 100)}`);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const newVol = Math.max(State.getVolume() - 0.05, 0);
                window.__IG_ENHANCED__.updateAllVolumes(newVol);
                showToast(newVol === 0 ? '🔇 Sessiz' : `🔉 %${Math.round(newVol * 100)}`);
            }

            // 3. İleri / Geri Sarma (Sol / Sağ Ok)
            else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const dur = targetVideo.duration;
                if (Number.isFinite(dur) && dur > 0) {
                    targetVideo.currentTime = Math.max(targetVideo.currentTime - 5, 0);
                    showToast(`⏪ -5s (${Formatters.formatTime(targetVideo.currentTime)})`);
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const dur = targetVideo.duration;
                if (Number.isFinite(dur) && dur > 0) {
                    targetVideo.currentTime = Math.min(targetVideo.currentTime + 5, dur);
                    showToast(`⏩ +5s (${Formatters.formatTime(targetVideo.currentTime)})`);
                }
            }
        });
    }

    window.__IG_ENHANCED__.Keyboard = {
        setup: setupKeyboardShortcuts,
        showToast
    };
})();
