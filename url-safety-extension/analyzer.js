/**
 * LinkSentry — URL Safety Scanner Analysis Engine
 * Implements Google Safe Browsing's 5-parameter methodology
 * 12 comprehensive security checks with educational feedback
 * 
 * Developed by Dyutiman Bharadwaj & Aayush Saha
 * K.A.V.A.C.H Club | Peckington University Cybersecurity Bootcamp
 */

// ─── Brand Database (Typosquatting) ──────────────────────────────────────────
const POPULAR_DOMAINS = {
  google:    ['gooogle', 'googel', 'g00gle', 'gogle', 'googlle', 'g0ogle', 'goggle'],
  facebook:  ['faceb00k', 'facebok', 'faceboook', 'facebk', 'facbook', 'faceebook'],
  paypal:    ['paypa1', 'paypai', 'paypol', 'payp4l', 'paypall', 'paypa11'],
  amazon:    ['amaz0n', 'amazn', 'amazone', 'amzon', 'amazzon', 'aamazon'],
  microsoft: ['micr0soft', 'mircosoft', 'microsft', 'microsoftt', 'micosoft'],
  apple:     ['app1e', 'applle', 'aple', 'appel', 'appl3', 'appie'],
  netflix:   ['netf1ix', 'netfliix', 'netfl1x', 'netfilx', 'nettflix'],
  instagram: ['1nstagram', 'instagran', 'instagrem', 'isnstagram', 'insragram'],
  twitter:   ['twiter', 'twiiter', 'tw1tter', 'twltter', 'twtter'],
  linkedin:  ['l1nkedin', 'linkedn', 'linkdin', 'linkediin', 'linkeadin']
};

// ─── Phishing Keywords ──────────────────────────────────────────────────────
const PHISHING_KEYWORDS = [
  'verify', 'account', 'suspend', 'confirm', 'urgent', 'security',
  'update', 'login', 'signin', 'banking', 'password', 'secure',
  'alert', 'unusual', 'activity', 'blocked', 'limited', 'restore'
];

// ─── High-Risk TLDs ─────────────────────────────────────────────────────────
const HIGH_RISK_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.xyz',
  '.work', '.date', '.click', '.loan'
];

// ─── URL Shortener Services ─────────────────────────────────────────────────
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
  'short.link', 'buff.ly', 'is.gd', 'tiny.cc'
];

// ─── Deceptive Ad Keywords ──────────────────────────────────────────────────
const DECEPTIVE_KEYWORDS = [
  'pop-up', 'popup', 'click-here', 'free-download',
  'winner', 'prize', 'claim'
];

// ─── Download Extensions ────────────────────────────────────────────────────
const DANGEROUS_EXTENSIONS = [
  '.exe', '.apk', '.bat', '.cmd', '.scr', '.vbs', '.jar',
  '.msi', '.ps1', '.dll'
];

// ─── Suspicious Characters ──────────────────────────────────────────────────
const SUSPICIOUS_CHARS = ['@', '..', '--', '%%', '@@', '/-/', '/..', '\\'];

// ─── Google Safe Browsing Threat Categories ─────────────────────────────────
const THREAT_CATEGORIES = {
  SOCIAL_ENGINEERING:              'Social Engineering',
  MALWARE:                         'Malware',
  UNWANTED_SOFTWARE:               'Unwanted Software',
  POTENTIALLY_HARMFUL_APPLICATION: 'Potentially Harmful Application',
  THREAT_TYPE_UNSPECIFIED:         'Unspecified Threat',
  CREDENTIAL_SECURITY:             'Credential Security'
};

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

/** 1. Typosquatting Detection */
function checkTyposquatting(url) {
  const lowerUrl = url.toLowerCase();
  const detected = [];

  for (const [legit, variants] of Object.entries(POPULAR_DOMAINS)) {
    // Skip if the URL contains the legitimate domain itself
    if (lowerUrl.includes(legit + '.')) continue;
    for (const variant of variants) {
      if (lowerUrl.includes(variant)) {
        detected.push(legit);
        break;
      }
    }
  }
  return detected;
}

/** 2. Homograph / Punycode Attack Detection */
function checkHomographAttack(url) {
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('xn--');
}

/** 3. High-Risk TLD Analysis */
function checkHighRiskTLD(url) {
  const lowerUrl = url.toLowerCase();
  try {
    let hostname;
    if (lowerUrl.includes('://')) {
      hostname = new URL(lowerUrl).hostname;
    } else {
      hostname = lowerUrl.split('/')[0];
    }
    for (const tld of HIGH_RISK_TLDS) {
      if (hostname.endsWith(tld)) return tld;
    }
  } catch {
    for (const tld of HIGH_RISK_TLDS) {
      if (lowerUrl.includes(tld + '/') || lowerUrl.endsWith(tld)) return tld;
    }
  }
  return null;
}

/** 4. Automatic Download / Malware Detection */
function checkDownloadPatterns(url) {
  const lowerUrl = url.toLowerCase();
  const found = [];
  for (const ext of DANGEROUS_EXTENSIONS) {
    if (lowerUrl.includes(ext)) found.push(ext);
  }
  if (lowerUrl.includes('/download') || lowerUrl.includes('/get-file')) {
    found.push('/download path');
  }
  return found;
}

/** 5. Domain Pattern Analysis (suspicious number sequences) */
function checkDomainPatterns(url) {
  return /\d{4,}/.test(url);
}

/** 6. Phishing Keyword Scanning */
function checkPhishingKeywords(url) {
  const lowerUrl = url.toLowerCase();
  return PHISHING_KEYWORDS.filter(kw => lowerUrl.includes(kw));
}

/** 7. HTTPS Encryption Check */
function checkHTTPS(url) {
  const lowerUrl = url.toLowerCase().trim();
  return lowerUrl.startsWith('https://');
}

/** 8. URL Length Analysis */
function checkURLLength(url) {
  return url.length > 75;
}

/** 9. Character Anomaly Detection */
function checkCharacterAnomalies(url) {
  const found = [];
  for (const ch of SUSPICIOUS_CHARS) {
    if (url.includes(ch)) found.push(ch);
  }
  return found;
}

/** 10. IP Address Detection */
function checkIPAddress(url) {
  return /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(url);
}

/** 11. URL Shortener Detection */
function checkURLShortener(url) {
  const lowerUrl = url.toLowerCase();
  for (const svc of URL_SHORTENERS) {
    if (lowerUrl.includes(svc)) return svc;
  }
  return null;
}

/** 12. Deceptive Advertising Detection */
function checkDeceptiveAds(url) {
  const lowerUrl = url.toLowerCase();
  return DECEPTIVE_KEYWORDS.filter(kw => lowerUrl.includes(kw));
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN ANALYSIS FUNCTION
// ═════════════════════════════════════════════════════════════════════════════

function performEnhancedAnalysis(url) {
  const results = {
    url,
    threats: [],
    score: 100,
    isSafe: true,
    checks: [],
    threatTypes: []
  };

  // Helper to add a check result
  function addCheck(name, status, label) {
    results.checks.push({ name, status, label: label || status });
  }

  // Helper to add threat type without duplicates
  function addThreatType(type) {
    if (!results.threatTypes.includes(type)) results.threatTypes.push(type);
  }

  // ── 1. Typosquatting ────────────────────────────────────────────────────
  const typoResults = checkTyposquatting(url);
  if (typoResults.length > 0) {
    results.threats.push({
      type: 'Typosquatting',
      severity: 'high',
      message: 'Possible brand impersonation detected',
      detail: `This URL contains characters resembling "${typoResults.join(', ')}" but with subtle differences. Attackers register domains like "paypa1.com" (using the digit 1 instead of the letter l) to trick you into entering credentials on a fake site.`,
      googleCategory: THREAT_CATEGORIES.SOCIAL_ENGINEERING
    });
    results.score -= 35;
    addCheck('Typosquatting', 'danger', `Impersonating: ${typoResults.join(', ')}`);
    addThreatType(THREAT_CATEGORIES.SOCIAL_ENGINEERING);
  } else {
    addCheck('Typosquatting', 'safe');
  }

  // ── 2. Homograph Attack ─────────────────────────────────────────────────
  if (checkHomographAttack(url)) {
    results.threats.push({
      type: 'Homograph Attack',
      severity: 'high',
      message: 'Punycode / internationalized domain detected',
      detail: 'This URL uses Punycode (xn-- prefix), which encodes non-Latin characters that can look identical to common Latin letters. For example, the Cyrillic "а" looks the same as the Latin "a" but points to a completely different domain. Always verify the actual domain in your browser\'s address bar.',
      googleCategory: THREAT_CATEGORIES.SOCIAL_ENGINEERING
    });
    results.score -= 40;
    addCheck('Homograph', 'danger', 'Punycode domain detected');
    addThreatType(THREAT_CATEGORIES.SOCIAL_ENGINEERING);
  } else {
    addCheck('Homograph', 'safe');
  }

  // ── 3. High-Risk TLD ────────────────────────────────────────────────────
  const riskyTLD = checkHighRiskTLD(url);
  if (riskyTLD) {
    results.threats.push({
      type: 'High-Risk TLD',
      severity: 'medium',
      message: `Domain uses high-risk extension: ${riskyTLD}`,
      detail: `The top-level domain "${riskyTLD}" is frequently associated with phishing and malware campaigns because it offers free or extremely cheap registration with minimal verification. While not all sites on this TLD are malicious, exercise extra caution.`,
      googleCategory: THREAT_CATEGORIES.THREAT_TYPE_UNSPECIFIED
    });
    results.score -= 25;
    addCheck('TLD Risk', 'warning', `Risky TLD: ${riskyTLD}`);
    addThreatType(THREAT_CATEGORIES.THREAT_TYPE_UNSPECIFIED);
  } else {
    addCheck('TLD Risk', 'safe');
  }

  // ── 4. Download Patterns ────────────────────────────────────────────────
  const downloads = checkDownloadPatterns(url);
  if (downloads.length > 0) {
    results.threats.push({
      type: 'Malware Download',
      severity: 'high',
      message: 'Potential dangerous file download detected',
      detail: `This URL contains references to executable or downloadable file types (${downloads.join(', ')}). These files can install malware, ransomware, or trojans on your device. Never download files from untrusted sources.`,
      googleCategory: THREAT_CATEGORIES.MALWARE
    });
    results.score -= 30;
    addCheck('Downloads', 'danger', `Patterns: ${downloads.join(', ')}`);
    addThreatType(THREAT_CATEGORIES.MALWARE);
  } else {
    addCheck('Downloads', 'safe');
  }

  // ── 5. Domain Patterns ──────────────────────────────────────────────────
  if (checkDomainPatterns(url)) {
    results.threats.push({
      type: 'Suspicious Domain',
      severity: 'low',
      message: 'Suspicious number sequence in URL',
      detail: 'Long number sequences (4+ digits) in a URL often indicate automatically generated or temporary domains. These are commonly used by attackers to create disposable phishing pages that are harder to block.',
      googleCategory: THREAT_CATEGORIES.THREAT_TYPE_UNSPECIFIED
    });
    results.score -= 15;
    addCheck('Domain Pattern', 'warning', 'Number sequence detected');
    addThreatType(THREAT_CATEGORIES.THREAT_TYPE_UNSPECIFIED);
  } else {
    addCheck('Domain Pattern', 'safe');
  }

  // ── 6. Phishing Keywords ────────────────────────────────────────────────
  const keywords = checkPhishingKeywords(url);
  if (keywords.length > 0) {
    results.threats.push({
      type: 'Phishing Keywords',
      severity: keywords.length >= 3 ? 'high' : 'medium',
      message: `${keywords.length} phishing keyword${keywords.length > 1 ? 's' : ''} detected`,
      detail: `Found: "${keywords.join('", "')}". Attackers embed urgency-inducing words like "verify", "urgent", and "suspended" in URLs to trick users into acting quickly without thinking. Legitimate services rarely include these terms in their URLs.`,
      googleCategory: THREAT_CATEGORIES.SOCIAL_ENGINEERING
    });
    results.score -= keywords.length * 12;
    addCheck('Keywords', keywords.length >= 3 ? 'danger' : 'warning', `Found: ${keywords.join(', ')}`);
    addThreatType(THREAT_CATEGORIES.SOCIAL_ENGINEERING);
  } else {
    addCheck('Keywords', 'safe');
  }

  // ── 7. HTTPS Check ──────────────────────────────────────────────────────
  if (!checkHTTPS(url)) {
    results.threats.push({
      type: 'No HTTPS',
      severity: 'high',
      message: 'Connection is not encrypted (HTTP)',
      detail: 'This URL does not use HTTPS encryption. Any data you send — passwords, credit card numbers, personal information — can be intercepted by anyone on the same network. Always look for the padlock icon in your browser\'s address bar.',
      googleCategory: THREAT_CATEGORIES.CREDENTIAL_SECURITY
    });
    results.score -= 30;
    addCheck('HTTPS', 'danger', 'Not encrypted');
    addThreatType(THREAT_CATEGORIES.CREDENTIAL_SECURITY);
  } else {
    addCheck('HTTPS', 'safe');
  }

  // ── 8. URL Length ───────────────────────────────────────────────────────
  if (checkURLLength(url)) {
    results.threats.push({
      type: 'URL Obfuscation',
      severity: 'low',
      message: `Unusually long URL (${url.length} characters)`,
      detail: 'Extremely long URLs are a common obfuscation technique. Attackers pad URLs with random characters to hide suspicious elements so they extend beyond what\'s visible in the address bar. If a URL seems unusually long, take a closer look before clicking.',
      googleCategory: THREAT_CATEGORIES.THREAT_TYPE_UNSPECIFIED
    });
    results.score -= 20;
    addCheck('URL Length', 'warning', `${url.length} chars`);
  } else {
    addCheck('URL Length', 'safe');
  }

  // ── 9. Character Anomalies ──────────────────────────────────────────────
  const anomalies = checkCharacterAnomalies(url);
  if (anomalies.length > 0) {
    results.threats.push({
      type: 'Character Anomalies',
      severity: 'medium',
      message: 'Suspicious characters detected in URL',
      detail: `Found patterns: "${anomalies.join('", "')}". Characters like "@" can redirect you to a different domain than what appears before the symbol. Double dots, path traversal patterns ("/../"), and backslashes are often used for URL obfuscation and server exploits.`,
      googleCategory: THREAT_CATEGORIES.SOCIAL_ENGINEERING
    });
    results.score -= 25;
    addCheck('Char Anomalies', 'danger', `Found: ${anomalies.join(', ')}`);
    addThreatType(THREAT_CATEGORIES.SOCIAL_ENGINEERING);
  } else {
    addCheck('Char Anomalies', 'safe');
  }

  // ── 10. IP Address ─────────────────────────────────────────────────────
  if (checkIPAddress(url)) {
    results.threats.push({
      type: 'IP Address URL',
      severity: 'high',
      message: 'URL uses direct IP address instead of domain name',
      detail: 'Legitimate websites use domain names (e.g., google.com), not raw IP addresses (e.g., 192.168.1.1). Attackers use IP addresses to bypass domain-based security filters and hide the true origin of a phishing page.',
      googleCategory: THREAT_CATEGORIES.SOCIAL_ENGINEERING
    });
    results.score -= 35;
    addCheck('IP Address', 'danger', 'Direct IP detected');
    addThreatType(THREAT_CATEGORIES.SOCIAL_ENGINEERING);
  } else {
    addCheck('IP Address', 'safe');
  }

  // ── 11. URL Shortener ──────────────────────────────────────────────────
  const shortener = checkURLShortener(url);
  if (shortener) {
    results.threats.push({
      type: 'URL Shortener',
      severity: 'low',
      message: `Shortened URL detected (${shortener})`,
      detail: `This URL uses the shortening service "${shortener}" which hides the actual destination. While URL shorteners have legitimate uses, attackers frequently exploit them to disguise malicious links. Use a URL expander service to reveal the true destination before clicking.`,
      googleCategory: THREAT_CATEGORIES.POTENTIALLY_HARMFUL_APPLICATION
    });
    results.score -= 20;
    addCheck('Shortener', 'warning', `Service: ${shortener}`);
    addThreatType(THREAT_CATEGORIES.POTENTIALLY_HARMFUL_APPLICATION);
  } else {
    addCheck('Shortener', 'safe');
  }

  // ── 12. Deceptive Ads ──────────────────────────────────────────────────
  const deceptive = checkDeceptiveAds(url);
  if (deceptive.length > 0) {
    results.threats.push({
      type: 'Deceptive Content',
      severity: 'low',
      message: 'Deceptive advertising patterns detected',
      detail: `Found terms: "${deceptive.join('", "')}". These keywords are commonly associated with scareware pop-ups, fake prize notifications, and forced download prompts. Legitimate websites do not use these tactics in their URLs.`,
      googleCategory: THREAT_CATEGORIES.UNWANTED_SOFTWARE
    });
    results.score -= 15;
    addCheck('Deceptive Ads', 'warning', `Found: ${deceptive.join(', ')}`);
    addThreatType(THREAT_CATEGORIES.UNWANTED_SOFTWARE);
  } else {
    addCheck('Deceptive Ads', 'safe');
  }

  // ── Final Scoring ──────────────────────────────────────────────────────
  results.score = Math.max(0, Math.min(100, results.score));
  results.isSafe = results.score >= 70;

  return results;
}

// ─── Score Gradient Helper ──────────────────────────────────────────────────
function getScoreGradient(score) {
  if (score >= 80) return { from: '#10b981', to: '#34d399', label: 'SAFE' };
  if (score >= 60) return { from: '#f59e0b', to: '#fb923c', label: 'WARNING' };
  return { from: '#ef4444', to: '#f87171', label: 'DANGEROUS' };
}

// ─── Score Status Text ──────────────────────────────────────────────────────
function getScoreStatus(score) {
  if (score >= 80) return 'SAFE';
  if (score >= 60) return 'CAUTION';
  return 'SUSPICIOUS';
}
