/**
 * Service Worker per YouTube No-Cookie Redirect Extension
 * Intercetta i reindirizzamenti e converte gli URL dei video YouTube
 * alla versione no-cookie (yout-ube.com)
 */

// Ascoltta i tab aggiornati
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    handleYouTubeUrl(tabId, tab.url);
  }
});

// Ascolta i tab creati
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url) {
    handleYouTubeUrl(tab.id, tab.url);
  }
});

/**
 * Gestisce il reindirizzamento dell'URL di YouTube
 * @param {number} tabId - ID della scheda
 * @param {string} url - URL della pagina
 */
function handleYouTubeUrl(tabId, url) {
  const redirectUrl = convertToNoCookieUrl(url);
  
  if (redirectUrl && redirectUrl !== url) {
    chrome.tabs.update(tabId, { url: redirectUrl });
  }
}

/**
 * Converte un URL YouTube alla versione no-cookie
 * Esclude gli Shorts
 * @param {string} url - URL da convertire
 * @returns {string|null} URL convertito o null se non applicabile
 */
function convertToNoCookieUrl(url) {
  // Non reindirizzare gli Shorts
  if (url.includes('/shorts/')) {
    return null;
  }

  const urlObj = new URL(url);
  const hostname = urlObj.hostname;

  // Gestisci youtube.com
  if (hostname === 'www.youtube.com' || hostname === 'youtube.com') {
    // Verifica se è un URL di un video
    const videoId = extractVideoId(url);
    
    if (videoId && urlObj.pathname.startsWith('/watch')) {
      // Converti a yout-ube.com
      const noCookieUrl = `https://www.yout-ube.com/watch?v=${videoId}`;
      return noCookieUrl;
    }
  }

  // Gestisci youtu.be (URL brevi)
  if (hostname === 'youtu.be') {
    const videoId = urlObj.pathname.slice(1).split('?')[0];
    
    if (videoId && videoId.length > 0) {
      // Converti a yout-ube.com
      const noCookieUrl = `https://www.yout-ube.com/watch?v=${videoId}`;
      return noCookieUrl;
    }
  }

  return null;
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
      return urlObj.searchParams.get('v');
    }
    
    // Da youtu.be/ID
    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')[1];
      return parts ? parts.split('?')[0] : null;
    }
    
    return null;
  } catch (e) {
    console.error('Errore nell\'estrazione dell\'ID video:', e);
    return null;
  }
}

// Log di attivazione dell'estensione
console.log('YouTube No-Cookie Redirect Extension caricata');
