/**
 * Instagram Ses ve Süre Kontrolü - Zaman Barı Bileşeni (Pro)
 */
(function () {
    window.__IG_ENHANCED__ = window.__IG_ENHANCED__ || {};

    function createTimeBar(video) {
        const { formatTime } = window.__IG_ENHANCED__.Formatters;

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
            const { State } = window.__IG_ENHANCED__;
            const grad = (State && State.getFillGradient)
                ? State.getFillGradient('to right', p)
                : `linear-gradient(to right, #ffffff ${p}%, rgba(255, 255, 255, 0.28) ${p}%)`;
            timeSlider.style.setProperty('background-image', grad, 'important');
        };

        // Video zamanı güncellendiğinde (kullanıcı slider'ı sürüklemiyorsa)
        video.addEventListener('timeupdate', () => {
            if (!timeSlider.matches(':active')) {
                const dur = video.duration;
                const progress = (Number.isFinite(dur) && dur > 0) ? (video.currentTime / dur) * 1000 : 0;
                timeSlider.value = progress;
                timeLabel.innerText = formatTime(video.currentTime);
                updateTimeGradient(progress);
            }
        });

        // Sürükleme performansı: Buffer kilitlenmesini önlemek için currentTime atamasını throttle et
        let seekRaf = null;
        let pendingTime = null;

        const commitSeek = (targetTime) => {
            if (Number.isFinite(targetTime) && targetTime >= 0) {
                video.currentTime = targetTime;
            }
        };

        timeSlider.addEventListener('input', () => {
            const dur = video.duration;
            if (Number.isFinite(dur) && dur > 0) {
                pendingTime = (timeSlider.value / 1000) * dur;
                timeLabel.innerText = formatTime(pendingTime);
                updateTimeGradient(timeSlider.value);

                if (!seekRaf) {
                    seekRaf = requestAnimationFrame(() => {
                        commitSeek(pendingTime);
                        seekRaf = null;
                    });
                }
            }
        });

        timeSlider.addEventListener('change', () => {
            const dur = video.duration;
            if (Number.isFinite(dur) && dur > 0) {
                commitSeek((timeSlider.value / 1000) * dur);
            }
        });

        // Klavye ok tuşları ile hassas 5 saniye ileri/geri sarma
        timeSlider.addEventListener('keydown', (e) => {
            e.stopPropagation();
            const dur = video.duration;
            if (!Number.isFinite(dur) || dur <= 0) return;

            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const step = 5; // 5 saniye
                const newT = e.key === 'ArrowLeft' 
                    ? Math.max(video.currentTime - step, 0)
                    : Math.min(video.currentTime + step, dur);
                commitSeek(newT);
                timeLabel.innerText = formatTime(newT);
                const progress = (newT / dur) * 1000;
                timeSlider.value = progress;
                updateTimeGradient(progress);
            }
        });

        // Çift tıklayarak beğenme hareketini video kapsayıcısına ilet
        timePanel.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const evt = new MouseEvent('dblclick', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: e.clientX,
                clientY: e.clientY
            });
            video.dispatchEvent(evt);
        });

        timePanel.addEventListener('mousedown', (e) => e.stopPropagation());
        timePanel.addEventListener('click', (e) => e.stopPropagation());
        timePanel.addEventListener('touchstart', (e) => e.stopPropagation());

        timePanel.append(timeLabel, timeSlider);

        return {
            panel: timePanel,
            label: timeLabel,
            slider: timeSlider,
            updateGradient: updateTimeGradient
        };
    }

    window.__IG_ENHANCED__.TimeBar = {
        create: createTimeBar
    };
})();
