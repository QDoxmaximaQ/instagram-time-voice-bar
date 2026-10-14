/**
 * Instagram Ses ve Süre Kontrolü - Evrensel (i18n) Orijinal Buton ve Yerel Ses Slider'ı Gizleyici (Pro)
 */
(function () {
    window.__IG_ENHANCED__ = window.__IG_ENHANCED__ || {};

    const AUDIO_KEYWORDS_REGEX = /(ses|mute|audio|sound|ton|stumm|silenciar|sonido|son|som|suono|zvuk|звук|laut|dempen|消音|음소거|静音|كتم)/i;
    const CALL_EXCLUDE_REGEX = /(arama|call|llamada|appel|anruf|chiamata|ligação|звонок|videochat)/i;

    function hideElement(el) {
        if (!el || !el.style) return;
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
    }

    function killNativeIcons() {
        // 1. Yerel Instagram Ses Slider'ı ve Kontrol Kapsülü (role="slider" veya ses düzeyi aria etiketi olanlar)
        const nativeSliders = document.querySelectorAll(
            '[role="slider"]:not(.ig-slider), ' +
            '[aria-orientation="vertical"]:not(.ig-v-slider):not(.ig-slider), ' +
            'div[aria-label*="ses düzey" i], ' +
            'div[aria-label*="volume" i], ' +
            'div[aria-label*="sound" i], ' +
            'div[aria-label*="audio" i], ' +
            'div[role="slider"].x10l6tqk.x1vjfegm.x191j7n5.xdg88n9'
        );
        nativeSliders.forEach((slider) => {
            if (slider.closest('.ig-ui-panel, .ig-vol-widget, #ig-enhanced-master-layer, .ig-slider')) {
                return;
            }
            hideElement(slider);
        });

        // 2. Orijinal ses butonları ve ikonları
        document.querySelectorAll('button, [role="button"], svg').forEach((el) => {
            if (el.closest('.ig-ui-panel, .ig-vol-widget, #ig-enhanced-master-layer')) {
                return;
            }

            const lbl = (el.getAttribute('aria-label') || '').toLowerCase();
            const titleNode = el.querySelector('title');
            const titleText = titleNode ? titleNode.textContent.toLowerCase() : '';
            const svgChild = el.querySelector('svg');
            const svgLbl = svgChild ? (svgChild.getAttribute('aria-label') || '').toLowerCase() : '';

            // DM sesli/görüntülü arama butonlarını koru
            if (CALL_EXCLUDE_REGEX.test(lbl) || CALL_EXCLUDE_REGEX.test(titleText) || CALL_EXCLUDE_REGEX.test(svgLbl)) {
                return;
            }

            const isAudioBtn =
                AUDIO_KEYWORDS_REGEX.test(lbl) ||
                AUDIO_KEYWORDS_REGEX.test(titleText) ||
                AUDIO_KEYWORDS_REGEX.test(svgLbl);

            if (isAudioBtn) {
                const btn = el.matches('button, [role="button"]') ? el : el.closest('button, [role="button"]');
                if (btn) {
                    hideElement(btn);
                }
                hideElement(el);
            }
        });
    }

    window.__IG_ENHANCED__.NativeKiller = {
        killNativeIcons
    };
})();
