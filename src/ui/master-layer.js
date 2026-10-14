/**
 * Instagram Ses ve Süre Kontrolü - Master Layer (En Üst Katman)
 */
(function () {
    window.__IG_ENHANCED__ = window.__IG_ENHANCED__ || {};

    let masterLayerInstance = null;

    function getMasterLayer() {
        if (masterLayerInstance && masterLayerInstance.isConnected) {
            return masterLayerInstance;
        }

        const existing = document.getElementById('ig-enhanced-master-layer');
        if (existing) {
            masterLayerInstance = existing;
            return masterLayerInstance;
        }

        masterLayerInstance = document.createElement('div');
        masterLayerInstance.id = 'ig-enhanced-master-layer';
        Object.assign(masterLayerInstance.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '2147483647',
            overflow: 'visible'
        });

        const root = document.documentElement || document.body;
        if (root) {
            root.appendChild(masterLayerInstance);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                (document.documentElement || document.body).appendChild(masterLayerInstance);
            });
        }

        return masterLayerInstance;
    }

    // Erken başlatma
    if (document.documentElement) {
        getMasterLayer();
    } else {
        document.addEventListener('DOMContentLoaded', getMasterLayer);
    }

    window.__IG_ENHANCED__.MasterLayer = {
        get: getMasterLayer
    };
})();
