/**
 * Service Worker per YouTube No-Cookie Redirect Extension
 * Intercetta i reindirizzamenti e converte gli URL dei video YouTube
 * alla versione no-cookie (yout-ube.com)
 */

console.log('[YT-NoC] Service Worker inizializzato');

// Traccia gli URL già reindirizzati per evitare loop infiniti
const redirectedUrls = new Map();

// Ascolta i tab creati (NEW TABS)
chrome.tabs.onCreated.addListener((tab) => {
  console.log('[YT-NoC] Tab creato:', tab.url);
  if (tab.url) {
    handleYouTubeUrl(tab.id, tab.url);
  }
});

// Ascolta gli aggiornamenti della scheda (NAVIGATION)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Reindirizza quando l'URL cambia
  if (changeInfo.url && !redirectedUrls.has(changeInfo.url)) {
    console.log('[YT-NoC] URL aggiornato in tab', tabId, ':', changeInfo.url);
    handleYouTubeUrl(tabId, changeInfo.url);
  }
});

/**
 * Gestisce il reindirizzamento dell'URL di YouTube
 * @param {number} tabId - ID della scheda
 * @param {string} url - URL della pagina
 */
function handleYouTubeUrl(tabId, url) {
  // Controlla se l'estensione è abilitata (DEFAULT: TRUE)
  chrome.storage.local.get({ extensionEnabled: true }, (data) => {
    const isEnabled = data.extensionEnabled;
    console.log('[YT-NoC] Estensione abilitata:', isEnabled);
    
    if (!isEnabled) {
      console.log('[YT-NoC] Estensione disabilitata, skip');
      return;
    }

    const redirectUrl = convertToNoCookieUrl(url);
    
    if (redirectUrl && redirectUrl !== url) {
      console.log('[YT-NoC] Reindirizzamento:', url, '→', redirectUrl);
      
      // Marca questo URL come reindirizzato per evitare il loop
      redirectedUrls.set(url, true);
      redirectedUrls.set(redirectUrl, true);
      
      // Limita la dimensione della Map a 200 URL
      if (redirectedUrls.size > 200) {
        const firstKey = redirectedUrls.keys().next().value;
        redirectedUrls.delete(firstKey);
      }
      
      chrome.tabs.update(tabId, { url: redirectUrl });
    } else {
      console.log('[YT-NoC] Nessun reindirizzamento necessario per:', url);
    }
  });
}

/**
 * Converte un URL YouTube alla versione no-cookie
 * Esclude gli Shorts
 * @param {string} url - URL da convertire
 * @returns {string|null} URL convertito o null se non applicabile
 */
function convertToNoCookieUrl(url) {
  try {
    // Non reindirizzare gli Shorts
    if (url.includes('/shorts/')) {
      console.log('[YT-NoC] È uno Short, skip');
      return null;
    }

    // Non reindirizzare se già su yout-ube.com
    if (url.includes('yout-ube.com')) {
      console.log('[YT-NoC] Già su yout-ube.com, skip');
      return null;
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    console.log('[YT-NoC] Hostname:', hostname);

    // Gestisci youtube.com
    if (hostname === 'www.youtube.com' || hostname === 'youtube.com') {
      // Verifica se è un URL di un video
      const videoId = extractVideoId(url);
      
      console.log('[YT-NoC] Video ID estratto:', videoId);
      
      if (videoId && urlObj.pathname.startsWith('/watch')) {
        // Converti a yout-ube.com
        const noCookieUrl = `https://www.yout-ube.com/watch?v=${videoId}`;
        console.log('[YT-NoC] URL da reindirizzare:', noCookieUrl);
        return noCookieUrl;
      }
    }

    // Gestisci youtu.be (URL brevi)
    if (hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1).split('?')[0];
      
      console.log('[YT-NoC] youtu.be Video ID:', videoId);
      
      if (videoId && videoId.length > 0) {
        // Converti a yout-ube.com
        const noCookieUrl = `https://www.yout-ube.com/watch?v=${videoId}`;
        return noCookieUrl;
      }
    }

    return null;
  } catch (e) {
    console.error('[YT-NoC] Errore nella conversione URL:', e);
    return null;
  }
}

/**
 * Estrae l'ID del video da un URL YouTube
 * @param {string} url - URL YouTube
 * @returns {string|null} ID del video o null
 */
function extractVideoId(url) {
  try {
    const urlObj = new URL(url);
    
    // Da youtube.com/watch?v=ID
    if (urlObj.searchParams.has('v')) {
      const videoId = urlObj.searchParams.get('v');
      console.log('[YT-NoC] Video ID da searchParams:', videoId);
      return videoId;
    }
    
    // Da youtu.be/ID
    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')[1];
      const videoId = parts ? parts.split('?')[0] : null;
      console.log('[YT-NoC] Video ID da youtu.be:', videoId);
      return videoId;
    }
    
    console.log('[YT-NoC] Video ID non trovato');
    return null;
  } catch (e) {
    console.error('[YT-NoC] Errore nell\'estrazione dell\'ID video:', e);
    return null;
  }
}

// Log di attivazione dell'estensione
console.log('[YT-NoC] YouTube No-Cookie Redirect Extension v1.0.1 caricata');
