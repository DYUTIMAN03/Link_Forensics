/**
 * LinkSentry — Domain Classification Database
 * Whitelist / Blacklist + classification logic for Google Search overlay
 */

// ═══ SAFE (Whitelisted) Domains ═════════════════════════════════════════════
const SAFE_DOMAINS = new Set([
    // Search & Tech
    'google.com', 'google.co.in', 'google.co.uk',
    'bing.com', 'duckduckgo.com',
    'youtube.com', 'youtu.be',
    'github.com', 'gitlab.com', 'bitbucket.org',
    'stackoverflow.com', 'stackexchange.com',
    'medium.com', 'dev.to', 'hashnode.dev',

    // Social
    'reddit.com', 'twitter.com', 'x.com',
    'facebook.com', 'instagram.com', 'linkedin.com',
    'threads.net', 'mastodon.social',

    // Reference & News
    'wikipedia.org', 'wikimedia.org', 'wiktionary.org',
    'bbc.com', 'bbc.co.uk', 'cnn.com', 'reuters.com',
    'nytimes.com', 'theguardian.com', 'washingtonpost.com',

    // Shopping & Services
    'amazon.com', 'amazon.in', 'amazon.co.uk',
    'ebay.com', 'etsy.com', 'walmart.com', 'flipkart.com',
    'apple.com', 'microsoft.com', 'adobe.com',

    // App Stores
    'play.google.com', 'apps.apple.com',
    'chromewebstore.google.com',

    // Cloud & Productivity
    'dropbox.com', 'drive.google.com', 'onedrive.live.com',
    'notion.so', 'figma.com', 'canva.com',
    'zoom.us', 'slack.com', 'discord.com',

    // Education & Government
    'coursera.org', 'udemy.com', 'khanacademy.org',
    'edu', 'gov', 'gov.in', 'gov.uk',

    // Security / Tools
    'virustotal.com', 'haveibeenpwned.com',
    'cloudflare.com', 'letsencrypt.org',

    // Other common trusted
    'quora.com', 'pinterest.com', 'tumblr.com',
    'archive.org', 'imdb.com', 'rottentomatoes.com',
    'spotify.com', 'soundcloud.com',
    'twitch.tv', 'steam.com', 'steampowered.com',
    'paypal.com', 'stripe.com',
    'npmjs.com', 'pypi.org', 'crates.io',
]);

// ═══ UNSAFE (Blacklisted) Domains ═══════════════════════════════════════════
// Each entry: domain → { reason, category }
const UNSAFE_DOMAINS = {
    // Piracy
    'fitgirl-repacks.site': { reason: 'Known piracy / cracked game distribution site', category: 'piracy' },
    'fitgirl-repacks.cc': { reason: 'Fake clone of piracy site — may contain malware', category: 'piracy' },
    '1337x.to': { reason: 'Torrent index — pirated content & malware risk', category: 'piracy' },
    '1337x.st': { reason: 'Torrent index mirror — pirated content', category: 'piracy' },
    'thepiratebay.org': { reason: 'Torrent site — piracy & malware-laden ads', category: 'piracy' },
    'piratebay.party': { reason: 'Pirate Bay mirror — high malware risk', category: 'piracy' },
    'rarbg.to': { reason: 'Torrent index — piracy & malicious ads', category: 'piracy' },
    'yts.mx': { reason: 'Movie torrent site — piracy & ad-injected malware', category: 'piracy' },
    'fmovies.to': { reason: 'Illegal streaming — intrusive ads & malware', category: 'piracy' },
    'fmovies.ps': { reason: 'Illegal streaming mirror — malware risk', category: 'piracy' },
    'soap2day.to': { reason: 'Illegal streaming — aggressive popups & tracking', category: 'piracy' },
    'soap2day.ac': { reason: 'Illegal streaming mirror — malware risk', category: 'piracy' },
    '123movies.to': { reason: 'Illegal streaming — ad-injected malware', category: 'piracy' },
    'putlocker.vip': { reason: 'Illegal streaming — known for drive-by downloads', category: 'piracy' },
    'torrentz2.eu': { reason: 'Torrent meta-search — piracy aggregator', category: 'piracy' },
    'nyaa.si': { reason: 'Anime torrent tracker — copyright infringement', category: 'piracy' },
    'steamunlocked.net': { reason: 'Cracked games — malware bundled with downloads', category: 'piracy' },
    'oceanofgames.com': { reason: 'Cracked games — known malware distribution', category: 'piracy' },
    'igg-games.com': { reason: 'Cracked games — DRM-stripped with embedded malware', category: 'piracy' },
    'skidrowreloaded.com': { reason: 'Fake cracking group site — bundled malware', category: 'piracy' },

    // Phishing / Scam
    'grabify.link': { reason: 'IP grabber / tracking link service', category: 'phishing' },
    'iplogger.org': { reason: 'IP logger — used for social engineering', category: 'phishing' },
    'blasze.tk': { reason: 'Known IP-logging / phishing domain', category: 'phishing' },

    // Fake download / malware hosts
    'softonic.com': { reason: 'Bundleware — wraps downloads with adware/PUPs', category: 'malware' },
    'download.cnet.com': { reason: 'Bundleware — installer includes unwanted software', category: 'malware' },
    'filehippo.com': { reason: 'Third-party download site — occasionally bundles adware', category: 'malware' },

    // Scam / Fake services
    'free-robux.com': { reason: 'Scam site — no legitimate Robux giveaways', category: 'scam' },
    'free-vbucks.com': { reason: 'Scam site — credential harvesting', category: 'scam' },
    'earnbux.today': { reason: 'Reward scam — collects personal info', category: 'scam' },
    'get-followers-free.com': { reason: 'Social media scam — phishing for credentials', category: 'scam' },
    'youlikehits.com': { reason: 'Account-sharing scam — credential theft risk', category: 'scam' },

    // Crypto scam
    'doubleyourbitcoin.com': { reason: 'Cryptocurrency scam — funds theft', category: 'scam' },
    'bitcoindoubler.club': { reason: 'Cryptocurrency scam site', category: 'scam' },

    // URL shortener abuse (additional)
    'adf.ly': { reason: 'Ad-heavy shortener — malicious redirects common', category: 'malware' },
    'bc.vc': { reason: 'Shortener monetizer — forced ads & tracking', category: 'malware' },
    'ouo.io': { reason: 'Link shortener — aggressive interstitial ads', category: 'malware' },
    'shrink.pe': { reason: 'Pay-per-click shortener — scam ads', category: 'malware' },
};

// ═══ Classification Logic ═══════════════════════════════════════════════════

/**
 * Classify a hostname as safe / risky / unsafe.
 * @param {string} hostname — e.g. "en.wikipedia.org"
 * @returns {{ status: 'safe'|'risky'|'unsafe', reason: string, category?: string }}
 */
function classifyDomain(hostname) {
    const host = hostname.toLowerCase().replace(/^www\./, '');

    // Check unsafe list first (exact match or parent domain)
    for (const [domain, info] of Object.entries(UNSAFE_DOMAINS)) {
        if (host === domain || host.endsWith('.' + domain)) {
            return { status: 'unsafe', reason: info.reason, category: info.category };
        }
    }

    // Check safe list (exact or parent domain)
    for (const safeDomain of SAFE_DOMAINS) {
        if (host === safeDomain || host.endsWith('.' + safeDomain)) {
            return { status: 'safe', reason: 'Trusted, well-known website', category: 'trusted' };
        }
    }

    // Everything else is risky
    return { status: 'risky', reason: 'Unverified domain — exercise caution', category: 'unknown' };
}
