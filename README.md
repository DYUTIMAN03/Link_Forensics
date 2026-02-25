<div align="center">

# 🛡️ LinkForensics  
### Real-Time URL Threat Intelligence — Chrome Extension  

[![Chrome MV3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)  
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
[![Version](https://img.shields.io/badge/Version-2.1-blue.svg)]()  

**12 security checks • Zero API calls • 100% client-side • Privacy-first**

*Detects phishing, typosquatting, homograph attacks, malware patterns, and more — directly in your browser.*

[Features](#-features) · [Installation](#-installation) · [How-It-Works](#-how-it-works) · [Security-Checks](#-12-security-checks) · [Tech-Stack](#-tech-stack) · [Contributing](#-contributing)

</div>

---

## ✨ Features

🔍 **Real-Time Scanning** — Every page you visit is analyzed in under 50ms  
🛡️ **Floating Shield Overlay** — Grammarly-style floating safety indicator  
🔎 **Google Search Badges** — Safety labels directly in search results  
⚡ **Popup Scanner** — Scan any pasted URL instantly  
🚨 **Interstitial Warning Page** — Blocks dangerous links before load  
🧠 **Educational Feedback** — Explains every detected threat  
🔒 **100% Privacy** — All logic runs locally  
📴 **Offline Capable** — Works without internet  

---

## 📸 UI Touchpoints

LinkForensics provides four integrated security feedback channels:

| Touchpoint | Description |
|:--:|---|
| 🟢 Floating Shield | Draggable overlay on every page showing safety status |
| 🔎 Search Badges | Safety labels injected into Google search results |
| 📊 Popup Scanner | Cyberpunk-themed popup with detailed threat breakdown |
| 🚨 Warning Page | Full-screen interstitial for dangerous URLs |

---

## 🚀 Installation

### From Source (Developer Mode)

```bash
git clone https://github.com/DYUTIMAN03/Link_Forensics.git
cd Link_Forensics

Open chrome://extensions/

Enable Developer Mode

Click Load unpacked

Select url-safety-extension/

Pin the extension

Works on Chrome, Edge, Brave, Opera

⚙️ How It Works
User opens URL
      │
      ▼
Intercept via webNavigation
      │
      ▼
Domain DB + 12 Security Checks
      │
      ▼
Safety Score (0–100)
      │
      ▼
Overlay • Search Badges • Popup • Warning Page
Scoring
Score	Status	Action
80–100	Safe	Normal browsing
60–79	Caution	Warning shown
0–59	Dangerous	Alert
≤ 40	Blocked	Interstitial
🔬 12 Security Checks
#	Check	Detects	Risk
1	Typosquatting	Fake domains	🔴
2	Homograph	Unicode spoofing	🔴
3	High-Risk TLD	.zip, .tk, .xyz	🟡
4	Download Trap	.exe, .apk	🔴
5	Domain Patterns	Random strings	🟡
6	Phishing Words	"verify", "login"	🟡
7	HTTPS Check	Missing SSL	🟡
8	Long URLs	Obfuscation	🟢
9	Special Chars	@, // abuse	🟡
10	IP URLs	Raw IP usage	🔴
11	URL Shorteners	Hidden targets	🟢
12	Deceptive Ads	Click fraud	🟡
📁 Project Structure
LinkForensics/
├── DEMO.html
├── analyzer.js
└── url-safety-extension/
    ├── manifest.json
    ├── background.js
    ├── content.js
    ├── google-search.js
    ├── popup.html
    ├── warning.html
    └── icons/
🛠️ Tech Stack
Layer	Tech
Platform	Chrome MV3
Language	JavaScript (ES6+)
UI	HTML + CSS
APIs	webNavigation, tabs, storage
Architecture	Event-driven service worker
Why Zero APIs?

✔ Privacy
✔ Speed
✔ Offline
✔ Free
✔ No backend

🌐 Browser Support
Browser	Status
Chrome	✅
Edge	✅
Brave	✅
Opera	⚠️ Untested
Firefox	❌
🗺️ Roadmap

ML-based URL classifier

Safe Browsing API (optional)

Hover safety preview

Gmail link scanning

Crowdsourced threat DB

Firefox support

🤝 Contributing
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature

Open a PR 🚀

👥 Team
Name	Role
Dyutiman Bharadwaj	Developer
Aayush Saha	Developer

Built for K.A.V.A.C.H Club · Feb 2026

📄 License

MIT License

<div align="center">

LINKFORENSICS v2.1
Making the web safer, one URL at a time 🛡️

</div> ```
