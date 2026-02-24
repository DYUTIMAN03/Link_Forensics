/**
 * LinkSentry — Extension Popup Script
 */

const urlInput = document.getElementById('urlInput');
const scanBtn = document.getElementById('scanBtn');
const spinnerEl = document.getElementById('spinner');
const resultsEl = document.getElementById('results');
const scoreVal = document.getElementById('scoreVal');
const scoreLabel = document.getElementById('scoreLabel');
const scoreUrl = document.getElementById('scoreUrl');
const fgRing = document.getElementById('fgRing');
const catsEl = document.getElementById('cats');
const checksEl = document.getElementById('checks');
const threatsEl = document.getElementById('threats');
const safeMsgEl = document.getElementById('safeMsg');

// Generate mini cityscape
(function buildBg() {
    const strip = document.getElementById('bgStrip');
    for (let i = 0; i < 20; i++) {
        const b = document.createElement('div');
        b.className = 'mini-building';
        const w = 10 + Math.random() * 16;
        const h = 15 + Math.random() * 50;
        b.style.width = w + 'px';
        b.style.height = h + 'px';
        b.style.left = (i * 5 + Math.random() * 2) + '%';
        for (let r = 0; r < Math.floor(h / 10); r++) {
            for (let c = 0; c < Math.floor(w / 8); c++) {
                if (Math.random() > 0.5) {
                    const win = document.createElement('div');
                    win.className = 'mini-window';
                    win.style.left = (2 + c * 6) + 'px';
                    win.style.top = (3 + r * 8) + 'px';
                    win.style.animationDelay = (Math.random() * 4).toFixed(1) + 's';
                    b.appendChild(win);
                }
            }
        }
        strip.appendChild(b);
    }
})();

// Auto-analyze current tab on popup open
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
        const tabUrl = tabs[0].url;
        if (!tabUrl.startsWith('chrome://') && !tabUrl.startsWith('chrome-extension://') &&
            !tabUrl.startsWith('edge://') && !tabUrl.startsWith('about:')) {
            urlInput.value = tabUrl;
            runScan(tabUrl);
        }
    }
});

scanBtn.addEventListener('click', () => {
    const val = urlInput.value.trim();
    if (val.length >= 4) runScan(val);
});

urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = urlInput.value.trim();
        if (val.length >= 4) runScan(val);
    }
});

let debounce;
urlInput.addEventListener('input', () => {
    clearTimeout(debounce);
    const val = urlInput.value.trim();
    if (val.length < 4) { resultsEl.classList.remove('active'); return; }
    debounce = setTimeout(() => runScan(val), 500);
});

function runScan(url) {
    spinnerEl.classList.add('active');
    resultsEl.classList.remove('active');

    setTimeout(() => {
        const analysis = performEnhancedAnalysis(url);
        spinnerEl.classList.remove('active');
        render(analysis);
    }, 600);
}

function render(a) {
    resultsEl.classList.add('active');

    const g = getScoreGradient(a.score);
    const circ = 2 * Math.PI * 34;
    fgRing.style.stroke = g.from;
    fgRing.style.strokeDashoffset = circ - (a.score / 100) * circ;

    scoreVal.textContent = a.score;
    scoreVal.style.color = g.from;

    const status = getScoreStatus(a.score);
    scoreLabel.textContent = status;
    scoreLabel.style.color = g.from;
    scoreUrl.textContent = a.url;

    // Categories
    catsEl.innerHTML = '';
    a.threatTypes.forEach(cat => {
        const b = document.createElement('span');
        b.className = 'cat-badge';
        b.textContent = cat;
        catsEl.appendChild(b);
    });

    // Checks
    checksEl.innerHTML = '';
    a.checks.forEach(c => {
        const div = document.createElement('div');
        div.className = 'chk';
        div.setAttribute('data-s', c.status);
        const ico = c.status === 'safe' ? '✅' : c.status === 'warning' ? '⚠️' : '❌';
        div.innerHTML = `<span class="chk-icon">${ico}</span>${c.name}`;
        checksEl.appendChild(div);
    });

    // Threats
    threatsEl.innerHTML = '';
    if (a.threats.length > 0) {
        safeMsgEl.style.display = 'none';
        a.threats.forEach(t => {
            const card = document.createElement('div');
            card.className = `t-card sev-${t.severity}`;
            card.innerHTML = `
        <div class="t-head">
          <span class="t-sev ${t.severity}">${t.severity.toUpperCase()}</span>
          <span class="t-name">${t.type}</span>
        </div>
        <div class="t-msg">${t.message}</div>
        <div class="t-detail">${t.detail}</div>
      `;
            threatsEl.appendChild(card);
        });
    } else {
        safeMsgEl.style.display = 'block';
    }
}
