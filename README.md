# Instagram Voice and Time Bar

An advanced Chrome Extension designed to enhance your Instagram video experience by adding high-precision volume and progress control bars to every video on the platform.

## Features

- **Persistent Volume Control:** Automatically saves your volume preference across videos and sessions.
- **Hard-Lock Volume:** Prevents Instagram from auto-resetting or changing your volume unexpectedly.
- **Visual Progress Bar:** A sleek, top-positioned horizontal slider to easily track and seek video progress.
- **Glassmorphism UI:** Modern, blurred-background interface that looks premium and integrates seamlessly with Instagram's aesthetic.
- **Infinite Scroll Support:** Automatically applies the UI to new videos as you scroll through your feed.
- **Intuitive Interaction:** Controls appear only when you hover over the video, keeping the interface clean.

## UI Components

1. **Time Panel (Top Left):** Shows the current timestamp and provides a horizontal seeking bar.
2. **Volume Panel (Right Side):** A vertical slider to precisely adjust audio levels (from 0% to 100%).

## Installation

To install this extension as a developer/unpacked version in Chrome:

1. **Download/Clone the Source Code:**
   - Download the project files as a ZIP and extract them, or clone the repository using `git clone`.

2. **Open Chrome Extensions Page:**
   - Open Google Chrome and navigate to `chrome://extensions/`.

3. **Enable Developer Mode:**
   - In the top-right corner, toggle the **Developer mode** switch to **ON**.

4. **Load Unpacked Extension:**
   - Click the **Load unpacked** button that appears in the top-left corner.
   - In the file dialog, navigate to and select the folder containing the project files (the folder with `manifest.json`).

5. **Pin for Easy Access (Optional):**
   - Click the "Extensions" (puzzle icon) in the Chrome toolbar and pin "Instagram Voice and Time Bar" if needed.

## Development

- **manifest.json:** Extension configuration and permissions.
- **content.js:** The core logic for injecting the UI, handling audio "Hard-Lock", and progress tracking.
- **images/icon.png:** The extension icon.

## License

MIT License - feel free to contribute and improve!
