/**
 * LinkSentry — Content Script
 * Injects a floating Grammarly-style shield overlay on every page
 */

(function () {
    // Don't inject on extension pages or browser internal pages
    if (window.location.protocol === 'chrome-extension:' ||
        window.location.protocol === 'chrome:' ||
        window.location.protocol === 'edge:' ||
        window.location.protocol === 'about:') {
        return;
    }

    // Run analysis on current page URL
    const analysis = performEnhancedAnalysis(window.location.href);

    // Determine glow color
    let glowColor, statusIcon, statusText;
    if (analysis.score >= 80) {
        glowColor = '#10b981';
        statusIcon = '✅';
        statusText = 'SAFE';
    } else if (analysis.score >= 60) {
        glowColor = '#f59e0b';
        statusIcon = '⚠️';
        statusText = 'CAUTION';
    } else {
        glowColor = '#ef4444';
        statusIcon = '❌';
        statusText = 'DANGER';
    }

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'linksentry-overlay';
    overlay.innerHTML = `
    <div id="linksentry-fab" title="LinkSentry: Score ${analysis.score}/100 — ${statusText}">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M24 4L6 12V22C6 33.1 13.7 43.3 24 46C34.3 43.3 42 33.1 42 22V12L24 4Z"
              fill="url(#lsg)" stroke="${glowColor}" stroke-width="2.5"/>
        <path d="M20 24L23 27L29 19" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="lsg" x1="6" y1="4" x2="42" y2="46">
            <stop stop-color="#ff2d95"/>
            <stop offset="1" stop-color="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
      <span class="linksentry-score" style="color:${glowColor}">${analysis.score}</span>
    </div>
    <div id="linksentry-tooltip" class="linksentry-hidden">
      <div class="ls-tt-header">
        <strong>LinkSentry</strong>
        <span class="ls-tt-status" style="color:${glowColor}">${statusIcon} ${statusText}</span>
      </div>
      <div class="ls-tt-score">Safety Score: <strong style="color:${glowColor}">${analysis.score}/100</strong></div>
      <div class="ls-tt-checks">
        ${analysis.checks.map(c => {
        const ico = c.status === 'safe' ? '✅' : c.status === 'warning' ? '⚠️' : '❌';
        return `<div class="ls-tt-chk"><span>${ico}</span> ${c.name}</div>`;
    }).join('')}
      </div>
      ${analysis.threats.length > 0 ? `
        <div class="ls-tt-threats">
          ${analysis.threats.slice(0, 3).map(t => `
            <div class="ls-tt-threat">
              <span class="ls-tt-sev ls-sev-${t.severity}">${t.severity.toUpperCase()}</span>
              ${t.type}: ${t.message}
            </div>
          `).join('')}
          ${analysis.threats.length > 3 ? `<div class="ls-tt-more">+${analysis.threats.length - 3} more…</div>` : ''}
        </div>
      ` : '<div class="ls-tt-safe">No threats detected</div>'}
    </div>
  `;

    document.body.appendChild(overlay);

    // Toggle tooltip on click
    const fab = document.getElementById('linksentry-fab');
    const tooltip = document.getElementById('linksentry-tooltip');

    fab.addEventListener('click', (e) => {
        e.stopPropagation();
        tooltip.classList.toggle('linksentry-hidden');
    });

    document.addEventListener('click', () => {
        tooltip.classList.add('linksentry-hidden');
    });

    tooltip.addEventListener('click', (e) => e.stopPropagation());
})();
