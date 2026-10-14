/**
 * doxmaxima-player v3.0 - Modern UI Ayar ve Özelleştirme Yöneticisi
 */

const THEMES = {
    white: {
        color: '#ffffff',
        fill: '#ffffff',
        glow: 'rgba(255, 255, 255, 0.7)'
    },
    sunset: {
        color: '#f09433',
        fill: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
        glow: 'rgba(220, 39, 67, 0.7)'
    },
    cyan: {
        color: '#00f2fe',
        fill: 'linear-gradient(45deg, #00f2fe, #4facfe)',
        glow: 'rgba(0, 242, 254, 0.7)'
    },
    emerald: {
        color: '#00e676',
        fill: '#00e676',
        glow: 'rgba(0, 230, 118, 0.7)'
    },
    gold: {
        color: '#ffd700',
        fill: 'linear-gradient(45deg, #ffd700, #ffaa00)',
        glow: 'rgba(255, 215, 0, 0.7)'
    }
};

const I18N = {
    tr: {
        badgeVersion: 'v3.0 Aktif',
        tagline: 'Gelişmiş Instagram Medya Denetleyicisi',
        langTitle: 'Arayüz Dili',
        langDesc: 'Tercih ettiğiniz dili seçin',
        moduleLabel: 'MODÜL GÖRÜNÜRLÜĞÜ',
        timeBar: 'Zaman Barı',
        timeBarDesc: 'Oynatma ve sarma çubuğu',
        volBar: 'Ses Barı',
        volBarDesc: 'Dikey ses seviyesi ve tekerlek',
        kb: 'Klavye Kısayolları',
        kbDesc: 'M (Mute), Oklar (Ses/Sarma)',
        previewLabel: 'CANLI ÖNİZLEME',
        previewTag: 'Gerçek Zamanlı',
        customLabel: 'ÖZELLEŞTİRME SEÇENEKLERİ',
        themeTitle: 'Vurgu Rengi / Tema',
        themeWhite: 'Beyaz',
        themeSunset: 'Sunset',
        themeCyan: 'Neon',
        themeEmerald: 'Zümrüt',
        themeGold: 'Altın',
        themeCustom: 'Özel',
        customColorTitle: 'Özel Vurgu Rengi',
        modeSolid: 'Tek Renk',
        modeGradient: 'Gradyan',
        labelColor: 'Renk',
        labelColor1: '1. Renk',
        labelColor2: '2. Renk',
        animTitle: 'Vurgu Animasyonu',
        animNone: 'Sabit',
        animPulse: 'Nefes',
        animWave: 'Dalgalı',
        animShimmer: 'Işıltı',
        opacityTitle: 'Cam Saydamlığı & Kenarlık Opaklığı',
        blurTitle: 'Bulanıklık Gücü (Backdrop Blur)',
        thicknessTitle: 'Çubuk Kalınlığı',
        thickThin: 'İnce (3px)',
        thickNormal: 'Normal (5px)',
        thickThick: 'Kalın (7px)',
        radiusTitle: 'Köşe Yuvarlaklığı',
        radiusSharp: 'Hafif (6px)',
        radiusModern: 'Modern (12px)',
        radiusPill: 'Hap (22px)',
        resetBtn: 'Varsayılan Ayarlara Dön',
        opacityZero: '%0 (Şeffaf)',
        blurZero: '0px (Kapalı)'
    },
    en: {
        badgeVersion: 'v3.0 Active',
        tagline: 'Advanced Instagram Media Controller',
        langTitle: 'Interface Language',
        langDesc: 'Select your preferred language',
        moduleLabel: 'MODULE VISIBILITY',
        timeBar: 'Time Bar',
        timeBarDesc: 'Playback progress and seek bar',
        volBar: 'Volume Bar',
        volBarDesc: 'Precision vertical volume controller',
        kb: 'Keyboard Shortcuts',
        kbDesc: 'M (Mute), Arrows (Volume/Seek)',
        previewLabel: 'LIVE PREVIEW',
        previewTag: 'Real-Time',
        customLabel: 'CUSTOMIZATION OPTIONS',
        themeTitle: 'Accent Color / Theme',
        themeWhite: 'White',
        themeSunset: 'Sunset',
        themeCyan: 'Neon',
        themeEmerald: 'Emerald',
        themeGold: 'Gold',
        themeCustom: 'Custom',
        customColorTitle: 'Custom Accent Color',
        modeSolid: 'Solid Color',
        modeGradient: 'Gradient',
        labelColor: 'Color',
        labelColor1: 'Color 1',
        labelColor2: 'Color 2',
        animTitle: 'Accent Animation',
        animNone: 'Static',
        animPulse: 'Pulse',
        animWave: 'Wave',
        animShimmer: 'Shimmer',
        opacityTitle: 'Glass Opacity & Border Alpha',
        blurTitle: 'Blur Strength (Backdrop Blur)',
        thicknessTitle: 'Bar Thickness',
        thickThin: 'Thin (3px)',
        thickNormal: 'Normal (5px)',
        thickThick: 'Thick (7px)',
        radiusTitle: 'Corner Radius',
        radiusSharp: 'Subtle (6px)',
        radiusModern: 'Modern (12px)',
        radiusPill: 'Pill (22px)',
        resetBtn: 'Reset to Default Settings',
        opacityZero: '%0 (Transparent)',
        blurZero: '0px (Off)'
    },
    ru: {
        badgeVersion: 'v3.0 Активно',
        tagline: 'Продвинутый медиа-контроллер Instagram',
        langTitle: 'Язык интерфейса',
        langDesc: 'Выберите предпочитаемый язык',
        moduleLabel: 'ВИДИМОСТЬ МОДУЛЕЙ',
        timeBar: 'Шкала времени',
        timeBarDesc: 'Полоса воспроизведения и перемотки',
        volBar: 'Шкала громкости',
        volBarDesc: 'Вертикальный регулятор громкости',
        kb: 'Горячие клавиши',
        kbDesc: 'M (Без звука), Стрелки (Громкость/Перемотка)',
        previewLabel: 'ПРЕДПРОСМОТР',
        previewTag: 'В реальном времени',
        customLabel: 'НАСТРОЙКИ ОФОРМЛЕНИЯ',
        themeTitle: 'Цвет акцента / Тема',
        themeWhite: 'Белый',
        themeSunset: 'Закат',
        themeNeon: 'Неон',
        themeEmerald: 'Изумруд',
        themeGold: 'Золото',
        themeCustom: 'Свой',
        customColorTitle: 'Пользовательский цвет',
        modeSolid: 'Один цвет',
        modeGradient: 'Градиент',
        labelColor: 'Цвет',
        labelColor1: 'Цвет 1',
        labelColor2: 'Цвет 2',
        animTitle: 'Анимация акцента',
        animNone: 'Статика',
        animPulse: 'Пульс',
        animWave: 'Волна',
        animShimmer: 'Мерцание',
        opacityTitle: 'Прозрачность стекла и рамки',
        blurTitle: 'Сила размытия (Backdrop Blur)',
        thicknessTitle: 'Толщина полосы',
        thickThin: 'Тонкая (3px)',
        thickNormal: 'Обычная (5px)',
        thickThick: 'Толстая (7px)',
        radiusTitle: 'Закругление углов',
        radiusSharp: 'Легкое (6px)',
        radiusModern: 'Модерн (12px)',
        radiusPill: 'Капсула (22px)',
        resetBtn: 'Сбросить на начальные настройки',
        opacityZero: '%0 (Прозрачно)',
        blurZero: '0px (Выкл)'
    },
    de: {
        badgeVersion: 'v3.0 Aktiv',
        tagline: 'Erweiterter Instagram Medien-Controller',
        langTitle: 'Oberflächensprache',
        langDesc: 'Wählen Sie Ihre bevorzugte Sprache',
        moduleLabel: 'MODULSIGHTBARKEIT',
        timeBar: 'Zeitleiste',
        timeBarDesc: 'Wiedergabe- und Suchleiste',
        volBar: 'Lautstärkeleiste',
        volBarDesc: 'Vertikaler Präzisions-Lautstärkeregler',
        kb: 'Tastaturkürzel',
        kbDesc: 'M (Stumm), Pfeiltasten (Lautstärke/Suche)',
        previewLabel: 'LIVE-VORSCHAU',
        previewTag: 'Echtzeit',
        customLabel: 'ANPASSUNGSOPTIONEN',
        themeTitle: 'Akzentfarbe / Design',
        themeWhite: 'Weiß',
        themeSunset: 'Sunset',
        themeNeon: 'Neon',
        themeEmerald: 'Smaragd',
        themeGold: 'Gold',
        themeCustom: 'Eigene',
        customColorTitle: 'Benutzerdefinierte Farbe',
        modeSolid: 'Einfarbig',
        modeGradient: 'Farbverlauf',
        labelColor: 'Farbe',
        labelColor1: 'Farbe 1',
        labelColor2: 'Farbe 2',
        animTitle: 'Akzent-Animation',
        animNone: 'Statisch',
        animPulse: 'Pulsieren',
        animWave: 'Welle',
        animShimmer: 'Schimmern',
        opacityTitle: 'Glastransparenz & Randstärke',
        blurTitle: 'Unschärfe (Backdrop Blur)',
        thicknessTitle: 'Balkendicke',
        thickThin: 'Dünn (3px)',
        thickNormal: 'Normal (5px)',
        thickThick: 'Dick (7px)',
        radiusTitle: 'Eckenabrundung',
        radiusSharp: 'Dezent (6px)',
        radiusModern: 'Modern (12px)',
        radiusPill: 'Kapsel (22px)',
        resetBtn: 'Auf Standardeinstellungen zurücksetzen',
        opacityZero: '%0 (Transparent)',
        blurZero: '0px (Aus)'
    },
    ja: {
        badgeVersion: 'v3.0 有効',
        tagline: '高度なInstagramメディアコントローラー',
        langTitle: '表示言語',
        langDesc: '使用する言語を選択してください',
        moduleLabel: 'モジュール表示設定',
        timeBar: 'タイムバー',
        timeBarDesc: '再生進行度およびシークバー',
        volBar: '音量バー',
        volBarDesc: '高精度な垂直音量コントローラー',
        kb: 'キーボードショートカット',
        kbDesc: 'M (ミュート), 矢印キー (音量/シーク)',
        previewLabel: 'ライブプレビュー',
        previewTag: 'リアルタイム',
        customLabel: 'カスタマイズ設定',
        themeTitle: 'アクセントカラー / テーマ',
        themeWhite: 'ホワイト',
        themeSunset: 'サンセット',
        themeNeon: 'ネオン',
        themeEmerald: 'エメラルド',
        themeGold: 'ゴールド',
        themeCustom: 'カスタム',
        customColorTitle: 'カスタムアクセントカラー',
        modeSolid: '単色',
        modeGradient: 'グラデーション',
        labelColor: 'カラー',
        labelColor1: '第1カラー',
        labelColor2: '第2カラー',
        animTitle: 'アクセントアニメーション',
        animNone: '静止',
        animPulse: 'パルス (点滅)',
        animWave: 'ウェーブ (波)',
        animShimmer: 'シマー (輝き)',
        opacityTitle: '透明度と枠線の不透明度',
        blurTitle: '背景ブラー強度 (Backdrop Blur)',
        thicknessTitle: 'バーの太さ',
        thickThin: '細い (3px)',
        thickNormal: '標準 (5px)',
        thickThick: '太い (7px)',
        radiusTitle: '角の丸み',
        radiusSharp: 'わずか (6px)',
        radiusModern: 'モダン (12px)',
        radiusPill: 'カプセル (22px)',
        resetBtn: 'デフォルト設定にリセット',
        opacityZero: '%0 (透明)',
        blurZero: '0px (オフ)'
    },
    ko: {
        badgeVersion: 'v3.0 활성',
        tagline: '고급 인스타그램 미디어 컨트롤러',
        langTitle: '인터페이스 언어',
        langDesc: '원하는 언어를 선택하세요',
        moduleLabel: '모듈 표시 설정',
        timeBar: '타임 바',
        timeBarDesc: '재생 진행 및 탐색 바',
        volBar: '볼륨 바',
        volBarDesc: '정밀 수직 볼륨 컨트롤러',
        kb: '키보드 단축키',
        kbDesc: 'M (음소거), 방향키 (볼륨/탐색)',
        previewLabel: '실시간 미리보기',
        previewTag: '실시간',
        customLabel: '사용자 설정 옵션',
        themeTitle: '강조 색상 / 테마',
        themeWhite: '화이트',
        themeSunset: '선셋',
        themeNeon: '네온',
        themeEmerald: '에메랄드',
        themeGold: '골드',
        themeCustom: '사용자 정의',
        customColorTitle: '사용자 정의 강조 색상',
        modeSolid: '단색',
        modeGradient: '그라디언트',
        labelColor: '색상',
        labelColor1: '색상 1',
        labelColor2: '색상 2',
        animTitle: '강조 애니메이션',
        animNone: '정적',
        animPulse: '펄스 (깜빡임)',
        animWave: '웨이브 (물결)',
        animShimmer: '시머 (반짝임)',
        opacityTitle: '유리 투명도 및 테두리 투명도',
        blurTitle: '블러 강도 (Backdrop Blur)',
        thicknessTitle: '바 두께',
        thickThin: '얇게 (3px)',
        thickNormal: '보통 (5px)',
        thickThick: '두껍게 (7px)',
        radiusTitle: '모서리 둥글기',
        radiusSharp: '약간 (6px)',
        radiusModern: '모던 (12px)',
        radiusPill: '캡슐 (22px)',
        resetBtn: '기본 설정으로 초기화',
        opacityZero: '%0 (투명)',
        blurZero: '0px (꺼짐)'
    },
    zh: {
        badgeVersion: 'v3.0 激活',
        tagline: '高级 Instagram 媒体控制器',
        langTitle: '界面语言',
        langDesc: '选择首选语言',
        moduleLabel: '模块显示控制',
        timeBar: '时间进度条',
        timeBarDesc: '播放与快进控制条',
        volBar: '音量条',
        volBarDesc: '精准垂直音量控制器',
        kb: '键盘快捷键',
        kbDesc: 'M (静音), 方向键 (音量/快进)',
        previewLabel: '实时预览',
        previewTag: '实时',
        customLabel: '个性化设置',
        themeTitle: '强调色 / 主题',
        themeWhite: '纯白',
        themeSunset: '落日',
        themeNeon: '霓虹',
        themeEmerald: '翡翠',
        themeGold: '金色',
        themeCustom: '自定义',
        customColorTitle: '自定义强调色',
        modeSolid: '纯色',
        modeGradient: '渐变色',
        labelColor: '颜色',
        labelColor1: '第一颜色',
        labelColor2: '第二颜色',
        animTitle: '强调色动画',
        animNone: '静态',
        animPulse: '脉冲 (呼吸灯)',
        animWave: '波浪 (渐变流)',
        animShimmer: '微光 (闪烁)',
        opacityTitle: '毛玻璃透明度与边框不透明度',
        blurTitle: '模糊强度 (Backdrop Blur)',
        thicknessTitle: '滑块粗细',
        thickThin: '细 (3px)',
        thickNormal: '中 (5px)',
        thickThick: '粗 (7px)',
        radiusTitle: '圆角弧度',
        radiusSharp: '轻微 (6px)',
        radiusModern: '现代 (12px)',
        radiusPill: '胶囊 (22px)',
        resetBtn: '恢复默认设置',
        opacityZero: '%0 (完全透明)',
        blurZero: '0px (关闭)'
    }
};

const DEFAULT_SETTINGS = {
    enableTimeBar: true,
    enableVolumeBar: true,
    enableKeyboard: true,
    theme: 'white',
    lang: 'tr',
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

// DOM Elementleri
const selectLang = document.getElementById('select-lang');
const toggleTimeBar = document.getElementById('toggle-time-bar');
const toggleVolBar = document.getElementById('toggle-vol-bar');
const toggleKeyboard = document.getElementById('toggle-keyboard');

const rangeOpacity = document.getElementById('range-opacity');
const valOpacity = document.getElementById('val-opacity');

const rangeBlur = document.getElementById('range-blur');
const valBlur = document.getElementById('val-blur');

const themeButtons = document.querySelectorAll('.theme-btn');
const thicknessButtons = document.querySelectorAll('#thickness-selector .seg-btn');
const radiusButtons = document.querySelectorAll('#radius-selector .seg-btn');

// Özel Renk Seçici Elementleri
const customColorBox = document.getElementById('custom-color-box');
const btnModeSolid = document.getElementById('btn-mode-solid');
const btnModeGradient = document.getElementById('btn-mode-gradient');
const pickerItem1 = document.getElementById('picker-item-1');
const pickerItem2 = document.getElementById('picker-item-2');
const labelColor1 = document.getElementById('label-color-1');
const labelColor2 = document.getElementById('label-color-2');
const colorPicker1 = document.getElementById('color-picker-1');
const hexColor1 = document.getElementById('hex-color-1');
const colorPicker2 = document.getElementById('color-picker-2');
const hexColor2 = document.getElementById('hex-color-2');
const customThemeDot = document.getElementById('custom-theme-dot');

const btnReset = document.getElementById('btn-reset');

// Önizleme Elementleri
const previewTimeBar = document.getElementById('preview-time-bar');
const previewTimeFill = document.getElementById('preview-time-fill');
const previewTimeThumb = document.getElementById('preview-time-thumb');
const previewVolBar = document.getElementById('preview-vol-bar');
const previewVolFill = document.getElementById('preview-vol-fill');

function applyLanguage(langCode) {
    const lang = I18N[langCode] || I18N.tr;

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el && text !== undefined) el.innerText = text;
    };

    setText('badge-version-text', lang.badgeVersion);
    setText('text-tagline', lang.tagline);
    setText('text-lang-title', lang.langTitle);
    setText('text-lang-desc', lang.langDesc);
    setText('text-module-label', lang.moduleLabel);
    setText('text-time-bar', lang.timeBar);
    setText('text-time-bar-desc', lang.timeBarDesc);
    setText('text-vol-bar', lang.volBar);
    setText('text-vol-bar-desc', lang.volBarDesc);
    setText('text-kb', lang.kb);
    setText('text-kb-desc', lang.kbDesc);
    setText('text-preview-label', lang.previewLabel);
    setText('text-preview-tag', lang.previewTag);
    setText('text-custom-label', lang.customLabel);
    setText('text-theme-title', lang.themeTitle);

    setText('theme-name-white', lang.themeWhite);
    setText('theme-name-sunset', lang.themeSunset);
    setText('theme-name-cyan', lang.themeCyan);
    setText('theme-name-emerald', lang.themeEmerald);
    setText('theme-name-gold', lang.themeGold);
    setText('theme-name-custom', lang.themeCustom);

    setText('text-custom-color-title', lang.customColorTitle);
    setText('btn-mode-solid', lang.modeSolid);
    setText('btn-mode-gradient', lang.modeGradient);

    const isGrad = currentSettings.customType === 'gradient';
    setText('label-color-1', isGrad ? lang.labelColor1 : lang.labelColor);
    setText('label-color-2', lang.labelColor2);


    setText('text-opacity-title', lang.opacityTitle);
    setText('text-blur-title', lang.blurTitle);
    setText('text-thickness-title', lang.thicknessTitle);
    setText('thick-val-3', lang.thickThin);
    setText('thick-val-5', lang.thickNormal);
    setText('thick-val-7', lang.thickThick);

    setText('text-radius-title', lang.radiusTitle);
    setText('radius-val-6', lang.radiusSharp);
    setText('radius-val-12', lang.radiusModern);
    setText('radius-val-22', lang.radiusPill);

    setText('text-reset-btn', lang.resetBtn);

    // Saydamlık ve blur etiketlerini yenile
    if (valOpacity) {
        valOpacity.innerText = currentSettings.bgOpacity === 0 ? lang.opacityZero : `%${currentSettings.bgOpacity}`;
    }
    if (valBlur) {
        valBlur.innerText = currentSettings.blurAmount === 0 ? lang.blurZero : `${currentSettings.blurAmount}px`;
    }

    if (selectLang) {
        selectLang.value = langCode;
    }
}

function getThemeData() {
    if (currentSettings.theme === 'custom') {
        const isGrad = currentSettings.customType === 'gradient';
        const c1 = currentSettings.customColor1 || '#ff007f';
        const c2 = isGrad ? (currentSettings.customColor2 || '#7928ca') : c1;
        const fill = isGrad ? `linear-gradient(45deg, ${c1}, ${c2})` : c1;
        return {
            color: c1,
            fill: fill,
            glow: hexToRgba(c1, 0.75)
        };
    }
    return THEMES[currentSettings.theme] || THEMES.white;
}

function updatePreview() {
    const themeData = getThemeData();
    const isZeroOpacity = currentSettings.bgOpacity === 0;
    const opacityVal = (currentSettings.bgOpacity || 0) / 100;
    const borderAlpha = (opacityVal * 0.25).toFixed(3);
    const bg = isZeroOpacity ? 'transparent' : `rgba(18, 18, 22, ${opacityVal})`;
    const border = isZeroOpacity ? 'none' : `1px solid rgba(255, 255, 255, ${borderAlpha})`;
    const shadow = isZeroOpacity ? 'none' : `0 8px 24px rgba(0, 0, 0, ${(opacityVal * 0.5).toFixed(3)}), inset 0 1px 1px rgba(255, 255, 255, ${(opacityVal * 0.15).toFixed(3)})`;
    const blur = (!isZeroOpacity && currentSettings.blurAmount > 0) ? `blur(${currentSettings.blurAmount}px)` : 'none';
    const radius = `${currentSettings.borderRadius}px`;
    const height = `${currentSettings.thickness}px`;

    // Zaman barı önizleme
    if (previewTimeBar) {
        previewTimeBar.style.display = currentSettings.enableTimeBar ? 'flex' : 'none';
        previewTimeBar.style.background = bg;
        previewTimeBar.style.border = border;
        previewTimeBar.style.boxShadow = shadow;
        previewTimeBar.style.backdropFilter = blur;
        previewTimeBar.style.borderRadius = radius;
        previewTimeBar.style.setProperty('--preview-glow', themeData.glow);

        const track = previewTimeBar.querySelector('.mock-slider-track');
        if (track) track.style.height = height;

        if (previewTimeFill) {
            previewTimeFill.style.background = themeData.fill;
            previewTimeFill.style.backgroundSize = 'auto';
            previewTimeFill.style.animation = 'none';
        }
        if (previewTimeThumb) {
            previewTimeThumb.style.background = '#ffffff';
            previewTimeThumb.style.boxShadow = `0 0 6px ${themeData.glow}`;
            previewTimeThumb.style.animation = 'none';
        }
    }

    // Ses barı önizleme
    if (previewVolBar) {
        previewVolBar.style.display = currentSettings.enableVolumeBar ? 'flex' : 'none';
        previewVolBar.style.background = bg;
        previewVolBar.style.border = border;
        previewVolBar.style.boxShadow = shadow;
        previewVolBar.style.backdropFilter = blur;
        previewVolBar.style.borderRadius = radius;
        previewVolBar.style.setProperty('--preview-glow', themeData.glow);

        if (previewVolFill) {
            previewVolFill.style.background = themeData.fill;
            previewVolFill.style.backgroundSize = 'auto';
            previewVolFill.style.animation = 'none';
        }
    }

    // Özel tema nokta ikonunu güncelle
    if (customThemeDot) {
        const isGrad = currentSettings.customType === 'gradient';
        const c1 = currentSettings.customColor1 || '#ff007f';
        const c2 = currentSettings.customColor2 || '#7928ca';
        customThemeDot.style.background = isGrad ? `linear-gradient(45deg, ${c1}, ${c2})` : c1;
        customThemeDot.style.boxShadow = `0 0 8px ${hexToRgba(c1, 0.7)}`;
    }

    // Özel renk kutusunu vurgula
    if (customColorBox) {
        customColorBox.classList.toggle('active-custom', currentSettings.theme === 'custom');
    }
}

function saveSettings() {
    updatePreview();

    // 1. Chrome storage ve localStorage'a kaydet
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ doxmaxima_settings: currentSettings });
    } else {
        localStorage.setItem('doxmaxima_settings', JSON.stringify(currentSettings));
    }

    // 2. Açık Instagram sekmelerine anında bildir
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        // A) Tüm Instagram sekmelerine yayınla
        chrome.tabs.query({ url: "*://*.instagram.com/*" }, (tabs) => {
            if (tabs && tabs.length > 0) {
                tabs.forEach((t) => {
                    if (t.id) {
                        chrome.tabs.sendMessage(t.id, {
                            type: 'DOX_SETTINGS_UPDATED',
                            settings: currentSettings
                        }).catch(() => {});
                    }
                });
            }
        });

        // B) Aktif sekmeye de gönder
        chrome.tabs.query({ active: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                tabs.forEach((t) => {
                    if (t.id) {
                        chrome.tabs.sendMessage(t.id, {
                            type: 'DOX_SETTINGS_UPDATED',
                            settings: currentSettings
                        }).catch(() => {});
                    }
                });
            }
        });
    }

    // C) Sayfa içi test ve yerel pencere mesajı
    window.postMessage({ type: 'DOX_SETTINGS_UPDATED', settings: currentSettings }, '*');
}

function loadSettings() {
    const applyToUI = (settings) => {
        currentSettings = { ...DEFAULT_SETTINGS, ...settings };

        // Dil ayarını uygula
        applyLanguage(currentSettings.lang || 'tr');

        // Togglelar
        toggleTimeBar.checked = currentSettings.enableTimeBar;
        toggleVolBar.checked = currentSettings.enableVolumeBar;
        toggleKeyboard.checked = currentSettings.enableKeyboard;

        // Opacity (0 olduğunda Şeffaf göster)
        rangeOpacity.value = currentSettings.bgOpacity;

        // Blur (0px olduğunda Kapalı göster)
        rangeBlur.value = currentSettings.blurAmount;

        // Tema butonları
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === currentSettings.theme);
        });

        // Özel renk seçici alanları
        if (colorPicker1) colorPicker1.value = currentSettings.customColor1 || '#ff007f';
        if (hexColor1) hexColor1.innerText = (currentSettings.customColor1 || '#ff007f').toUpperCase();
        if (colorPicker2) colorPicker2.value = currentSettings.customColor2 || '#7928ca';
        if (hexColor2) hexColor2.innerText = (currentSettings.customColor2 || '#7928ca').toUpperCase();

        const isGrad = currentSettings.customType === 'gradient';
        if (btnModeSolid) btnModeSolid.classList.toggle('active', !isGrad);
        if (btnModeGradient) btnModeGradient.classList.toggle('active', isGrad);
        if (pickerItem2) pickerItem2.style.display = isGrad ? 'flex' : 'none';


        // Kalınlık butonları
        thicknessButtons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.val) === currentSettings.thickness);
        });

        // Radius butonları
        radiusButtons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.val) === currentSettings.borderRadius);
        });

        updatePreview();
    };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['doxmaxima_settings'], (result) => {
            if (result && result.doxmaxima_settings) {
                applyToUI(result.doxmaxima_settings);
            } else {
                applyToUI(DEFAULT_SETTINGS);
            }
        });
    } else {
        const local = localStorage.getItem('doxmaxima_settings');
        if (local) {
            try { applyToUI(JSON.parse(local)); } catch (e) { applyToUI(DEFAULT_SETTINGS); }
        } else {
            applyToUI(DEFAULT_SETTINGS);
        }
    }
}

// Olay Dinleyicileri
if (selectLang) {
    selectLang.addEventListener('change', (e) => {
        currentSettings.lang = e.target.value;
        applyLanguage(e.target.value);
        saveSettings();
    });
}

toggleTimeBar.addEventListener('change', (e) => {
    currentSettings.enableTimeBar = e.target.checked;
    saveSettings();
});

toggleVolBar.addEventListener('change', (e) => {
    currentSettings.enableVolumeBar = e.target.checked;
    saveSettings();
});

toggleKeyboard.addEventListener('change', (e) => {
    currentSettings.enableKeyboard = e.target.checked;
    saveSettings();
});

rangeOpacity.addEventListener('input', (e) => {
    currentSettings.bgOpacity = parseInt(e.target.value);
    const lang = I18N[currentSettings.lang] || I18N.tr;
    valOpacity.innerText = currentSettings.bgOpacity === 0 ? lang.opacityZero : `%${currentSettings.bgOpacity}`;
    saveSettings();
});

rangeBlur.addEventListener('input', (e) => {
    currentSettings.blurAmount = parseInt(e.target.value);
    const lang = I18N[currentSettings.lang] || I18N.tr;
    valBlur.innerText = currentSettings.blurAmount === 0 ? lang.blurZero : `${currentSettings.blurAmount}px`;
    saveSettings();
});

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSettings.theme = btn.dataset.theme;
        saveSettings();
    });
});

// Özel Renk Modu Butonları (Tek Renk / Gradyan)
if (btnModeSolid) {
    btnModeSolid.addEventListener('click', () => {
        btnModeSolid.classList.add('active');
        btnModeGradient.classList.remove('active');
        pickerItem2.style.display = 'none';
        const lang = I18N[currentSettings.lang] || I18N.tr;
        if (labelColor1) labelColor1.innerText = lang.labelColor;
        currentSettings.customType = 'solid';
        currentSettings.theme = 'custom';
        themeButtons.forEach(b => b.classList.toggle('active', b.dataset.theme === 'custom'));
        saveSettings();
    });
}

if (btnModeGradient) {
    btnModeGradient.addEventListener('click', () => {
        btnModeGradient.classList.add('active');
        btnModeSolid.classList.remove('active');
        pickerItem2.style.display = 'flex';
        const lang = I18N[currentSettings.lang] || I18N.tr;
        if (labelColor1) labelColor1.innerText = lang.labelColor1;
        currentSettings.customType = 'gradient';
        currentSettings.theme = 'custom';
        themeButtons.forEach(b => b.classList.toggle('active', b.dataset.theme === 'custom'));
        saveSettings();
    });
}

// Renk Seçiciler
if (colorPicker1) {
    colorPicker1.addEventListener('input', (e) => {
        currentSettings.customColor1 = e.target.value;
        if (hexColor1) hexColor1.innerText = e.target.value.toUpperCase();
        currentSettings.theme = 'custom';
        themeButtons.forEach(b => b.classList.toggle('active', b.dataset.theme === 'custom'));
        saveSettings();
    });
}

if (colorPicker2) {
    colorPicker2.addEventListener('input', (e) => {
        currentSettings.customColor2 = e.target.value;
        if (hexColor2) hexColor2.innerText = e.target.value.toUpperCase();
        currentSettings.theme = 'custom';
        themeButtons.forEach(b => b.classList.toggle('active', b.dataset.theme === 'custom'));
        saveSettings();
    });
}


thicknessButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        thicknessButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSettings.thickness = parseInt(btn.dataset.val);
        saveSettings();
    });
});

radiusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        radiusButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSettings.borderRadius = parseInt(btn.dataset.val);
        saveSettings();
    });
});

btnReset.addEventListener('click', () => {
    currentSettings = { ...DEFAULT_SETTINGS };
    loadSettings();
    saveSettings();
});

// Başlat
document.addEventListener('DOMContentLoaded', loadSettings);
