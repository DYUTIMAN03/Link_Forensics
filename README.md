<div align="center">
# 🛡️ LinkForensics
### Real-Time URL Threat Intelligence — Chrome Extension
[![Chrome MV3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.1-blue.svg)]()
**12 security checks • Zero API calls • 100% client-side • Privacy-first**
*Detects phishing, typosquatting, homograph attacks, malware patterns, and more — directly in your browser.*
[Features](#-features) · [Installation](#-installation) · [How It Works](#-how-it-works) · [Security Checks](#-12-security-checks) · [Tech Stack](#-tech-stack) · [Contributing](#-contributing)
</div>
---
## ✨ Features
🔍 **Real-Time Scanning** — Every page you visit is automatically analyzed in < 50ms  
🛡️ **Floating Shield Overlay** — A draggable shield icon on every page shows safety status at a glance  
🔎 **Google Search Badges** — Safety indicators (✅ Safe / ⚠️ Risky / ❌ Unsafe) appear directly on search results  
⚡ **Popup Scanner** — On-demand URL scanner accessible from the extension icon  
🚨 **Interstitial Warning Page** — Full-screen threat warning blocks dangerous URLs before they load  
🧠 **Educational Feedback** — Every threat includes detailed explanations to help users learn  
🔒 **100% Privacy** — All analysis runs locally; no URLs are ever sent to external servers  
� **Offline Capable** — Works without an internet connection  
---
## 📸 UI Touchpoints
LinkForensics provides four integrated security feedback channels:
| Touchpoint | Description |
|:---:|---|
| 🟢 **Floating Shield** | A Grammarly-style floating action button (FAB) on every page. Green = safe, amber = caution, red = dangerous. Click to see all 12 check results. |
| 🔎 **Search Badges** | Safety badges injected next to Google Search results. Instant classification using a curated database of 55+ safe and 40+ unsafe domains. |
| 📊 **Popup Scanner** | A cyberpunk-themed popup with an animated score ring, 12-check grid, and detailed threat cards. Paste any URL to scan on demand. |
| 🚨 **Warning Page** | Full-screen interstitial for URLs scoring ≤ 40. Displays threats, safety score, and options to go back or proceed with a one-time bypass. |
---
## 🚀 Installation
### From Source (Developer Mode)
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/LinkForensics.git
   cd LinkForensics
   ```
2. **Open Chrome Extensions page**
   ```
   chrome://extensions/
   ```
3. **Enable Developer Mode** (toggle in the top-right corner)
4. **Click "Load unpacked"** and select the `url-safety-extension/` folder
5. **Pin the extension** — Click the puzzle piece icon in Chrome's toolbar and pin LinkForensics
> **Note:** The extension works on all Chromium-based browsers — Chrome, Edge, Brave, and Opera.
---
## ⚙️ How It Works
```
  User visits a URL
         │
         ▼
  ┌──────────────────┐
  │  URL Intercepted │ ← webNavigation API / page load
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐     ┌─────────────────┐
  │  Domain Database │     │  12 Security    │
  │  (whitelist /    │     │  Checks         │
  │   blacklist)     │     │  (analyzer.js)  │
  └────────┬─────────┘     └────────┬────────┘
           │                        │
           └───────────┬────────────┘
                       ▼
              ┌─────────────────┐
              │ Score: 0 – 100  │
              │ + Threat Report │
              └────────┬────────┘
                       │
         ┌─────────┬───┴────┬────────────┐
         ▼         ▼        ▼            ▼
     Floating   Search    Popup     Warning Page
     Overlay    Badges    Panel     (if score ≤ 40)
```
### Scoring System
| Score Range | Status | Color | Action |
|:-----------:|:------:|:-----:|--------|
| **80 – 100** | ✅ Safe | 🟢 Green | Normal browsing |
| **60 – 79** | ⚠️ Caution | 🟡 Amber | User notified |
| **0 – 59** | ❌ Dangerous | 🔴 Red | Alert shown |
| **≤ 40** | 🚨 Blocked | 🔴 Red | Interstitial warning |
---
## 🔬 12 Security Checks
Each check maps to one of [Google Safe Browsing's](https://developers.google.com/safe-browsing) 5 threat categories:
| # | Check | Detects | Severity |
|:-:|-------|---------|:--------:|
| 1 | **Typosquatting Detection** | Domains mimicking popular sites (e.g., `gogle.com`) | 🔴 High |
| 2 | **Homograph / Punycode Attack** | Unicode chars masquerading as ASCII (e.g., Cyrillic `о` in `gооgle.com`) | 🔴 High |
| 3 | **High-Risk TLD Analysis** | Dangerous extensions like `.zip`, `.tk`, `.xyz`, `.top` | 🟡 Medium |
| 4 | **Download Pattern Detection** | Auto-download URLs (`.exe`, `.apk`, `.bat`, `.scr`) | 🔴 High |
| 5 | **Domain Pattern Analysis** | Suspicious number sequences & randomized domains | 🟡 Medium |
| 6 | **Phishing Keyword Scanning** | Bait words: `verify`, `suspend`, `account`, `password` | 🟡 Medium |
| 7 | **HTTPS Encryption Check** | Missing SSL/TLS encryption | 🟡 Medium |
| 8 | **URL Length Analysis** | Abnormally long URLs (> 75 chars) | 🟢 Low |
| 9 | **Character Anomaly Detection** | Excessive special chars (`@`, `//`, dashes, dots) | 🟡 Medium |
| 10 | **IP Address Detection** | Raw IP addresses instead of domain names | 🔴 High |
| 11 | **URL Shortener Detection** | `bit.ly`, `tinyurl.com`, etc. masking true destination | 🟢 Low |
| 12 | **Deceptive Ad Detection** | Click-jacking & ad-fraud patterns | 🟡 Medium |
---
## 📁 Project Structure
```
LinkForensics/
├── DEMO.html                    # Standalone demo page
├── demo.css                     # Demo page styles
├── analyzer.js                  # Analysis engine (shared)
├── generate-icons.js            # SVG icon generation script
├── PROJECT_REPORT.md            # Detailed project report
├── README.md                    # This file
│
└── url-safety-extension/        # � Chrome Extension (load this folder)
    ├── manifest.json            # MV3 manifest
    ├── sw-loader.js             # Service worker loader
    ├── background.js            # Navigation monitoring & interstitial logic
    ├── analyzer.js              # Analysis engine (12 checks)
    ├── content.js               # Floating shield overlay
    ├── content.css              # Overlay styles
    ├── google-search.js         # Google Search safety badges
    ├── google-search.css        # Badge styles
    ├── domains.js               # Domain whitelist (55+) / blacklist (40+)
    ├── popup.html               # Extension popup
    ├── popup.js                 # Popup scanner logic
    ├── popup.css                # Cyberpunk popup styles
    ├── warning.html             # Interstitial warning page
    ├── warning.js               # Warning page logic
    └── icons/                   # Extension icons (SVG)
        ├── icon16.svg
        ├── icon48.svg
        ├── icon128.svg
        ├── badge-safe.png
        ├── badge-risky.png
        └── badge-unsafe.png
```
---
## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| **Platform** | Chrome Extension — Manifest V3 |
| **Language** | JavaScript (ES6+) |
| **Markup** | HTML5 |
| **Styling** | CSS3 — Glassmorphism, pixel-art, neon cyberpunk aesthetic |
| **Fonts** | [Orbitron](https://fonts.google.com/specimen/Orbitron), [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono), [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) |
| **Chrome APIs** | `webNavigation`, `tabs`, `storage`, `scripting`, `activeTab` |
| **Architecture** | Event-driven Service Worker (MV3) |
### Why Zero External APIs?
| | |
|---|---|
| 🔒 **Privacy** | URLs never leave your device |
| ⚡ **Speed** | No network latency — analysis in < 50ms |
| � **Offline** | Works without internet |
| � **Free** | Zero API costs, no rate limits |
| 🧩 **Simple** | No server infrastructure or API keys |
---
## 🌐 Browser Compatibility
| Browser | Version | Status |
|:-------:|:-------:|:------:|
| Google Chrome | 120+ | ✅ Supported |
| Microsoft Edge | 120+ | ✅ Supported |
| Brave | 1.60+ | ✅ Supported |
| Opera | 106+ | ⚠️ Untested |
| Firefox | — | ❌ Incompatible |
---
## 🎨 Design Philosophy
LinkForensics features a **cyberpunk / retro-futuristic** UI:
- 🌑 **Dark theme** (`#0a0a1a`) for reduced eye strain  
- 🪟 **Glassmorphism** panels with `backdrop-filter: blur()`  
- 💜 **Neon accents** — Pink `#ff2d95`, Purple `#8b5cf6`, Cyan `#06b6d4`  
- 🏙️ **Pixel-art cityscapes** with procedurally generated buildings  
- 🔤 **Monospace typography** for the hacker aesthetic  
- ✨ **Micro-animations** — score ring animation, spinners, smooth transitions  
---
## � Roadmap
- [ ] 🧠 **ML-based URL detection** — CNN/LSTM model trained on URL character sequences  
- [ ] 🌐 **Google Safe Browsing API** — Optional cloud reputation checks  
- [ ] � **Link hover preview** — Safety badge on hover _before_ clicking
- [ ] 📧 **Email client integration** — Scan links inside Gmail / Outlook  
- [ ] 👥 **Crowdsourced reporting** — Community-driven threat database  
- [ ] ⚙️ **Configurable thresholds** — Custom score thresholds for warnings  
- [ ] 🌍 **Multi-language support** — Hindi, Spanish, French, and more  
- [ ] 🦊 **Firefox port** — WebExtension API adaptation  
- [ ] � **Dashboard & analytics** — Track scans and threats over time  
- [ ] � **WHOIS & SSL checks** — Domain age and certificate verification  
---
## 🤝 Contributing
Contributions are welcome! Here's how to get started:
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request
---
## 👥 Team
| | |
|---|---|
| **Dyutiman Bharadwaj** | Developer |
| **Aayush Saha** | Developer |
Built for **K.A.V.A.C.H Club** · February 2026
---
## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
---
<div align="center">
**LINKFORENSICS v2.1** · Built with ❤️ for a safer web
*"Making the web safer, one URL at a time."*
</div>
