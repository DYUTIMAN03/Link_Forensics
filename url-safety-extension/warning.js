/**
 * LinkSentry — Warning Page Script
 * Reads blocked URL + threats from query params and renders them
 */

(function () {
    const params = new URLSearchParams(window.location.search);
    const blockedUrl = params.get('url') || 'Unknown URL';
    const score = parseInt(params.get('score') || '0', 10);
    let threats = [];

    try {
        threats = JSON.parse(params.get('threats') || '[]');
    } catch (e) {
        threats = [];
    }

    // Render
    document.getElementById('blockedUrl').textContent = blockedUrl;
    document.getElementById('scoreDisplay').textContent = score;

    const list = document.getElementById('threatsList');
    threats.forEach(t => {
        const el = document.createElement('div');
        el.className = `w-threat sev-${t.severity}`;
        el.innerHTML = `
      <div class="w-threat-head">
        <span class="w-sev ${t.severity}">${t.severity.toUpperCase()}</span>
        <span class="w-threat-name">${t.type}</span>
      </div>
      <div class="w-threat-msg">${t.message}</div>
      <div class="w-threat-detail">${t.detail}</div>
    `;
        list.appendChild(el);
    });

    // Store blocked URL for proceed action
    window._blockedUrl = blockedUrl;
})();

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.close();
    }
}

function proceedAnyway() {
    const url = window._blockedUrl;
    if (!url) return;

    // Tell background to bypass this URL on next navigation
    if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'bypass', url }, () => {
            window.location.href = url;
        });
    } else {
        window.location.href = url;
    }
}
