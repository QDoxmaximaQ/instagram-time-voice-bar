/**
 * Instagram Ses ve Süre Kontrolü - Ses Barı Bileşeni (Pro)
 */
(function () {
    window.__IG_ENHANCED__ = window.__IG_ENHANCED__ || {};

    let lastActiveVol = 0.5;

    function createVolumeBar(video, onVolumeChange) {
        const { State, Icons } = window.__IG_ENHANCED__;
        const currentVolume = State.getVolume();

        if (currentVolume > 0) {
            lastActiveVol = currentVolume;
        }

        const volPanel = document.createElement('div');
        volPanel.className = 'ig-vol-widget';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'ig-vol-slider-wrapper';

        const pctLabel = document.createElement('span');
        pctLabel.className = 'ig-label ig-v-pct';
        pctLabel.innerText = Math.round(currentVolume * 100) + '%';

        const volSlider = document.createElement('input');
        volSlider.type = 'range';
        volSlider.className = 'ig-slider ig-v-slider';
        volSlider.min = 0;
        volSlider.max = 1;
        volSlider.step = 0.01;
        volSlider.value = currentVolume;

        sliderWrapper.append(pctLabel, volSlider);

        const iconBtn = document.createElement('div');
        iconBtn.className = 'ig-vol-icon-btn';
        iconBtn.innerHTML = Icons.renderVolumeIcon(currentVolume);

        const toggleMute = () => {
            const vol = State.getVolume();
            if (vol > 0) {
                lastActiveVol = vol;
                if (typeof onVolumeChange === 'function') {
                    onVolumeChange(0);
                }
            } else {
                const restoreVol = lastActiveVol > 0 ? lastActiveVol : 0.5;
                if (typeof onVolumeChange === 'function') {
                    onVolumeChange(restoreVol);
                }
            }
        };

        iconBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMute();
        });

        const updateVolGradient = (val) => {
            const p = val * 100;
            const grad = (State && State.getFillGradient)
                ? State.getFillGradient('to top', p)
                : `linear-gradient(to top, #ffffff ${p}%, rgba(255, 255, 255, 0.28) ${p}%)`;
            volSlider.style.setProperty('background-image', grad, 'important');
            iconBtn.innerHTML = Icons.renderVolumeIcon(val);
        };

        volSlider.addEventListener('input', (e) => {
            if (typeof onVolumeChange === 'function') {
                onVolumeChange(e.target.value);
            }
        });

        // Klavye desteği: Yukarı/Aşağı ok tuşları ile %5 hassas değişim
        volSlider.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                e.preventDefault();
                const newVol = Math.min(State.getVolume() + 0.05, 1);
                if (typeof onVolumeChange === 'function') onVolumeChange(newVol);
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const newVol = Math.max(State.getVolume() - 0.05, 0);
                if (typeof onVolumeChange === 'function') onVolumeChange(newVol);
            } else if (e.key.toLowerCase() === 'm') {
                e.preventDefault();
                toggleMute();
            }
        });

        // İlk boyama
        updateVolGradient(currentVolume);

        // Fare tekerleği ile ses seviyesini hassas ayarlama
        volPanel.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const delta = e.deltaY < 0 ? 0.05 : -0.05;
            const newVol = Math.min(Math.max(State.getVolume() + delta, 0), 1);
            if (typeof onVolumeChange === 'function') {
                onVolumeChange(newVol);
            }
        }, { passive: false });

        // Çift tıklayarak beğenme hareketini video kapsayıcısına ilet
        volPanel.addEventListener('dblclick', (e) => {
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

        volPanel.addEventListener('mousedown', (e) => e.stopPropagation());
        volPanel.addEventListener('click', (e) => e.stopPropagation());
        volPanel.addEventListener('touchstart', (e) => e.stopPropagation());

        volPanel.append(sliderWrapper, iconBtn);

        return {
            panel: volPanel,
            sliderWrapper,
            pctLabel,
            slider: volSlider,
            iconBtn,
            updateGradient: updateVolGradient,
            toggleMute
        };
    }

    window.__IG_ENHANCED__.VolumeBar = {
        create: createVolumeBar
    };
})();
