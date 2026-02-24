/**
 * LinkSentry — Background Service Worker
 * Monitors navigation and intercepts dangerous URLs
 * Note: analyzer.js is loaded before this file by sw-loader.js
 */

// Analyze URL on navigation and redirect to warning page if score <= 40
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    // Only analyze main frame navigations
    if (details.frameId !== 0) return;

    const url = details.url;

    // Skip internal URLs
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') ||
        url.startsWith('edge://') || url.startsWith('brave://') ||
        url.startsWith('about:') || url.startsWith('data:')) {
        return;
    }

    // Check if user chose to bypass this URL
    try {
        const { bypassUrls = [] } = await chrome.storage.session.get('bypassUrls');
        if (bypassUrls.includes(url)) {
            // Remove from bypass list (one-time bypass)
            const updated = bypassUrls.filter(u => u !== url);
            await chrome.storage.session.set({ bypassUrls: updated });
            return;
        }
    } catch (e) {
        // storage.session may not be available in all contexts
    }

    // Run analysis
    const analysis = performEnhancedAnalysis(url);

    // Store result for popup/content script
    try {
        await chrome.storage.session.set({
            ['analysis_' + details.tabId]: analysis
        });
    } catch (e) { }

    // If dangerous (score <= 40), redirect to warning page
    if (analysis.score <= 40) {
        const warningUrl = chrome.runtime.getURL('warning.html') +
            '?url=' + encodeURIComponent(url) +
            '&score=' + analysis.score +
            '&threats=' + encodeURIComponent(JSON.stringify(analysis.threats.map(t => ({
                type: t.type,
                severity: t.severity,
                message: t.message,
                detail: t.detail,
                googleCategory: t.googleCategory
            }))));

        chrome.tabs.update(details.tabId, { url: warningUrl });
    }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'analyze') {
        const analysis = performEnhancedAnalysis(message.url);
        sendResponse(analysis);
        return true;
    }

    if (message.type === 'getAnalysis') {
        chrome.storage.session.get('analysis_' + message.tabId).then(result => {
            sendResponse(result['analysis_' + message.tabId] || null);
        }).catch(() => sendResponse(null));
        return true;
    }

    if (message.type === 'bypass') {
        // Add URL to bypass list so the next navigation won't be blocked
        chrome.storage.session.get('bypassUrls').then(({ bypassUrls = [] }) => {
            bypassUrls.push(message.url);
            chrome.storage.session.set({ bypassUrls });
            sendResponse({ ok: true });
        }).catch(() => sendResponse({ ok: false }));
        return true;
    }
});
