/**
 * LinkSentry — Google Search Result Overlay
 * Inline SVG magnifying glass icons — no background, consistent style.
 * Green = Safe, Amber = Risky, Red = Unsafe.
 * Hover for animated glow + detailed tooltip.
 */

(function () {
  'use strict';

  if (window.__linkSentrySearchInjected) return;
  window.__linkSentrySearchInjected = true;

  // ═══ SVG Icon Builder ═══════════════════════════════════════════════════
  // Pixel-art magnifying glass with chain link. Only the chain color changes.

  function buildSVG(chainColor) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff2d95"/>
      <stop offset="100%" stop-color="#06d6d0"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Lens outer ring -->
  <circle cx="28" cy="26" r="18" fill="none" stroke="url(#frame)" stroke-width="5" opacity="0.9"/>
  <!-- Lens inner fill (dark) -->
  <circle cx="28" cy="26" r="14" fill="#0f172a" opacity="0.85"/>
  <!-- Handle -->
  <rect x="40" y="40" width="6" height="18" rx="2" transform="rotate(-45 43 49)" fill="url(#frame)" opacity="0.85"/>
  <!-- Chain link (status colored) -->
  <g filter="url(#glow)" transform="translate(28,26)">
    <path d="M-6,-2 C-6,-5 -3,-7 0,-7 C3,-7 5,-5 5,-2" fill="none" stroke="${chainColor}" stroke-width="3" stroke-linecap="round"/>
    <path d="M-5,2 C-5,5 -2,7 1,7 C4,7 6,5 6,2" fill="none" stroke="${chainColor}" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`;
  }

  function svgToDataURI(svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  }

  // ═══ Status Config ══════════════════════════════════════════════════════

  const STATUS = {
    safe: {
      icon: svgToDataURI(buildSVG('#10b981')),
      label: 'Safe',
      emoji: '✅',
      glowColor: '16, 185, 129',
      statusClass: 'ls-tt-safe',
    },
    risky: {
      icon: svgToDataURI(buildSVG('#f59e0b')),
      label: 'Risky',
      emoji: '⚠️',
      glowColor: '245, 158, 11',
      statusClass: 'ls-tt-risky',
    },
    unsafe: {
      icon: svgToDataURI(buildSVG('#ef4444')),
      label: 'Unsafe',
      emoji: '❌',
      glowColor: '239, 68, 68',
      statusClass: 'ls-tt-unsafe',
    }
  };

  // ═══ Shared Tooltip (body-level, fixed position) ════════════════════════

  const tooltip = document.createElement('div');
  tooltip.id = 'ls-hover-tooltip';
  tooltip.innerHTML = `
        <div id="ls-tt-header">
            <span id="ls-tt-brand">LINKSENTRY</span>
            <span id="ls-tt-status"></span>
        </div>
        <div id="ls-tt-domain"></div>
        <div id="ls-tt-reason"></div>
        <div id="ls-tt-meta">
            <span id="ls-tt-category"></span>
            <span id="ls-tt-score"></span>
        </div>
    `;
  document.body.appendChild(tooltip);

  // Inject tooltip styles
  const style = document.createElement('style');
  style.textContent = `
        #ls-hover-tooltip {
            position: fixed !important;
            z-index: 2147483647 !important;
            width: 280px !important;
            background: linear-gradient(145deg, #111827 0%, #0f172a 100%) !important;
            border: 1px solid rgba(148, 163, 184, 0.18) !important;
            border-radius: 12px !important;
            padding: 14px 16px !important;
            box-shadow: 0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            pointer-events: none !important;
            opacity: 0 !important;
            transform: translateY(6px) scale(0.97) !important;
            transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1),
                        transform 0.25s cubic-bezier(0.4,0,0.2,1) !important;
            direction: ltr !important;
            writing-mode: horizontal-tb !important;
            text-align: left !important;
            box-sizing: border-box !important;
        }
        #ls-hover-tooltip.ls-tt-show {
            opacity: 1 !important;
            transform: translateY(0) scale(1) !important;
        }
        #ls-tt-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            margin-bottom: 8px !important;
            padding-bottom: 8px !important;
            border-bottom: 1px solid rgba(148,163,184,0.1) !important;
        }
        #ls-tt-brand {
            font-size: 10px !important;
            font-weight: 800 !important;
            letter-spacing: 2px !important;
            background: linear-gradient(135deg, #ff2d95, #8b5cf6) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
        }
        #ls-tt-status {
            font-size: 11px !important;
            font-weight: 700 !important;
            letter-spacing: 1px !important;
            text-transform: uppercase !important;
        }
        #ls-tt-status.ls-tt-safe   { color: #10b981 !important; }
        #ls-tt-status.ls-tt-risky  { color: #f59e0b !important; }
        #ls-tt-status.ls-tt-unsafe { color: #ef4444 !important; }

        #ls-tt-domain {
            font-size: 11px !important;
            color: #64748b !important;
            margin-bottom: 6px !important;
            word-break: break-all !important;
            font-family: 'SF Mono', 'Consolas', monospace !important;
        }
        #ls-tt-reason {
            font-size: 12.5px !important;
            color: #cbd5e1 !important;
            line-height: 1.5 !important;
            margin-bottom: 10px !important;
        }
        #ls-tt-meta {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        #ls-tt-category {
            font-size: 9px !important;
            font-weight: 700 !important;
            letter-spacing: 0.8px !important;
            text-transform: uppercase !important;
            padding: 2px 8px !important;
            border-radius: 4px !important;
            background: rgba(148,163,184,0.1) !important;
            color: #94a3b8 !important;
        }
        #ls-tt-score {
            font-size: 10px !important;
            color: #64748b !important;
            margin-left: auto !important;
        }
    `;
  document.head.appendChild(style);

  let tooltipTimer = null;

  function showTooltip(badge, data) {
    clearTimeout(tooltipTimer);

    const cfg = STATUS[data.status];
    const statusEl = tooltip.querySelector('#ls-tt-status');
    statusEl.textContent = `${cfg.emoji} ${cfg.label}`;
    statusEl.className = cfg.statusClass;

    tooltip.querySelector('#ls-tt-domain').textContent = data.hostname;
    tooltip.querySelector('#ls-tt-reason').textContent = data.reason;
    tooltip.querySelector('#ls-tt-category').textContent = data.category || 'unknown';

    const scoreEl = tooltip.querySelector('#ls-tt-score');
    scoreEl.textContent = data.score !== null ? `Score: ${data.score}/100` : '';

    const rect = badge.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - 140;
    let top = rect.bottom + 10;

    if (left < 8) left = 8;
    if (left + 280 > window.innerWidth - 8) left = window.innerWidth - 288;
    if (top + 180 > window.innerHeight) top = rect.top - 180;

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';

    requestAnimationFrame(() => tooltip.classList.add('ls-tt-show'));
  }

  function hideTooltip() {
    tooltipTimer = setTimeout(() => tooltip.classList.remove('ls-tt-show'), 120);
  }

  // ═══ Badge Creation ═════════════════════════════════════════════════════

  function createBadge(classification, hostname, analysisScore) {
    const cfg = STATUS[classification.status];

    const img = document.createElement('img');
    img.src = cfg.icon;
    img.alt = `LinkSentry: ${cfg.label}`;
    img.setAttribute('data-ls-badge', classification.status);

    img.style.cssText = [
      'display:inline-block',
      'width:22px',
      'height:22px',
      'margin-left:8px',
      'vertical-align:middle',
      'cursor:pointer',
      'user-select:none',
      'object-fit:contain',
      `filter:drop-shadow(0 0 3px rgba(${cfg.glowColor},0.6)) drop-shadow(0 0 6px rgba(${cfg.glowColor},0.3))`,
      'transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease',
    ].join(';');

    const tooltipData = {
      status: classification.status,
      hostname,
      reason: classification.reason,
      category: classification.category || 'unknown',
      score: analysisScore,
    };

    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.35)';
      img.style.filter = [
        `drop-shadow(0 0 5px rgba(${cfg.glowColor},0.8))`,
        `drop-shadow(0 0 10px rgba(${cfg.glowColor},0.5))`,
        `drop-shadow(0 0 20px rgba(${cfg.glowColor},0.3))`,
      ].join(' ');
      showTooltip(img, tooltipData);
    });

    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
      img.style.filter = `drop-shadow(0 0 3px rgba(${cfg.glowColor},0.6)) drop-shadow(0 0 6px rgba(${cfg.glowColor},0.3))`;
      hideTooltip();
    });

    return img;
  }

  // ═══ Result Scanning ════════════════════════════════════════════════════

  function extractHostname(href) {
    try {
      const url = new URL(href);
      if (url.hostname.includes('google') && url.pathname === '/url') {
        const q = url.searchParams.get('q');
        if (q) return new URL(q).hostname;
      }
      return url.hostname;
    } catch {
      return null;
    }
  }

  function processResult(resultEl) {
    if (resultEl.hasAttribute('data-ls-processed')) return;
    resultEl.setAttribute('data-ls-processed', '1');

    const link = resultEl.querySelector('a[href]:not([href^="javascript"]):not([href^="#"])');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('/search') || href.startsWith('/advanced_search')) return;

    const hostname = extractHostname(href);
    if (!hostname) return;

    if (hostname.includes('google.com') || hostname.includes('google.co.')) return;

    const classification = classifyDomain(hostname);

    let analysisScore = null;
    if (classification.status === 'risky') {
      try {
        const fullAnalysis = performEnhancedAnalysis(href);
        analysisScore = fullAnalysis.score;

        if (fullAnalysis.score <= 40) {
          classification.status = 'unsafe';
          classification.reason = 'Multiple security risks detected by LinkSentry analysis engine';
          classification.category = 'malware';
        } else if (fullAnalysis.score >= 85) {
          classification.status = 'safe';
          classification.reason = 'No threats detected by LinkSentry analysis engine';
          classification.category = 'trusted';
        } else {
          const threatCount = fullAnalysis.threats.length;
          if (threatCount > 0) {
            classification.reason = `${threatCount} potential issue${threatCount > 1 ? 's' : ''} detected — ${fullAnalysis.threats[0].message}`;
          }
        }
      } catch (e) { /* keep risky */ }
    }

    const heading = resultEl.querySelector('h3');
    const target = heading || link;
    target.after(createBadge(classification, hostname, analysisScore));
  }

  function scanResults() {
    const selectors = ['div.g', 'div[data-hveid]', 'div.xpd', 'div.hlcw0c', 'div[data-content-feature]'];
    document.querySelectorAll(selectors.join(', ')).forEach(processResult);
  }

  // ═══ Init + Observer ════════════════════════════════════════════════════

  scanResults();

  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const m of mutations) {
      if (m.addedNodes.length > 0) { shouldScan = true; break; }
    }
    if (shouldScan) {
      clearTimeout(observer._timer);
      observer._timer = setTimeout(scanResults, 300);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
