<!-- omit in toc -->
# 🎥 YouTube No-Cookie Redirect

Un'estensione per browser Chromium che reindirizza automaticamente i video YouTube alla versione no-cookie di **yout-ube.com**, escludendo gli Shorts.

## ✨ Caratteristiche

- ✅ **Reindirizzamento automatico** di tutti i video YouTube (eccetto Shorts) a yout-ube.com
- ✅ **Supporto URL brevi** (youtu.be → yout-ube.com)
- ✅ **Esclude gli Shorts** per mantenere l'esperienza originale
- ✅ **Toggle enable/disable** dall'interfaccia popup
- ✅ **Zero configurazione** - funziona subito dopo l'installazione
- ✅ **Leggera e veloce** - usa il Service Worker di Manifest V3

## 📋 Funzionalità

### Supporto URL

| URL Originale | URL Convertito | Azione |
|---|---|---|
| `youtube.com/watch?v=dQw4w9WgXcQ` | `yout-ube.com/watch?v=dQw4w9WgXcQ` | ✅ Reindirizza |
| `youtu.be/dQw4w9WgXcQ` | `yout-ube.com/watch?v=dQw4w9WgXcQ` | ✅ Reindirizza |
| `youtube.com/shorts/ABC123` | `youtube.com/shorts/ABC123` | ❌ Non modifica |
| `youtube.com/channel/...` | `youtube.com/channel/...` | ❌ Non modifica |

## 🚀 Installazione

### Metodo 1: Caricamento in modalità sviluppatore

1. Salva i file dell'estensione in una cartella locale
2. Apri `chrome://extensions/` nel tuo browser Chromium
3. Attiva il toggle **"Modalità sviluppatore"** (angolo alto-destra)
4. Clicca su **"Carica estensione non pacchettizzata"**
5. Seleziona la cartella con i file dell'estensione
6. L'estensione è ora pronta all'uso!

### Metodo 2: Pacchetto CRX (per distribuzione)

```bash
# Crea un pacchetto CRX dell'estensione
# Vedi: https://developer.chrome.com/docs/extensions/mv3/publish/
```

## 📂 Struttura dei file

```
youtube-no-cookie-redirect/
├── manifest.json          # Configurazione dell'estensione
├── background.js          # Service Worker (logica di reindirizzamento)
├── popup.html             # UI del popup
├── popup.js               # Logica del popup
├── styles.css             # Stili del popup
├── images/                # Icone dell'estensione
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md              # Questo file
```

## 🛠️ Configurazione tecnica

### Manifest V3

L'estensione utilizza **Manifest V3**, lo standard attuale per le estensioni Chrome/Chromium:

```json
{
  "manifest_version": 3,
  "permissions": ["webRequest", "tabs"],
  "host_permissions": ["https://*.youtube.com/*", "https://*.youtu.be/*"]
}
```

### Service Worker

Il file `background.js` implementa:

- Intercettazione degli aggiornamenti della scheda (`onUpdated`)
- Estrazione dell'ID video
- Conversione dell'URL
- Reindirizzamento automatico

## 🔧 Personalizzazione

### Modifica il dominio di destinazione

In `background.js`, linea ~47:

```javascript
const noCookieUrl = `https://www.yout-ube.com/watch?v=${videoId}`;
```

Cambia `yout-ube.com` con il dominio desiderato.

### Abilita il reindirizzamento degli Shorts

Rimuovi il controllo all'inizio di `convertToNoCookieUrl()`:

```javascript
// Commenta o rimuovi queste righe:
if (url.includes('/shorts/')) {
  return null;
}
```

## 📝 Note importanti

- **No-cookie**: yout-ube.com è un'istanza embed-only di YouTube che non imposta cookie di tracciamento
- **Privacy**: L'estensione non raccoglie dati sui tuoi comportamenti
- **Compatibilità**: Supporta Chrome, Chromium, Edge e altri browser basati su Chromium
- **Offline**: Non richiede connessione a server esterni

## ⚙️ Supporto browser

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Brave Browser
- ✅ Vivaldi
- ✅ Opera (con Chromium)

## 🐛 Risoluzione dei problemi

### L'estensione non reindirizza

1. Verifica che sia **abilitata** nel popup
2. Controlla che il sito sia `youtube.com` o `youtu.be`
3. Ricarica la scheda (F5 o Ctrl+R)
4. Controlla la console (`F12` → Console) per errori

### yout-ube.com non carica il video

- `yout-ube.com` potrebbe avere limitazioni di disponibilità
- Verifica la connessione internet
- Prova con un video pubblico diverso

### L'estensione è disattivata

- Clicca sull'icona dell'estensione
- Attiva il toggle "Estensione abilitata"

## 📄 Licenza

Questa estensione è fornita come-è. Sentiti libero di modificarla secondo le tue necessità.

## 🔗 Risorse utili

- [Documentazione Chrome Extensions](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Service Workers su Chrome](https://developer.chrome.com/docs/extensions/mv3/service_workers/)

---

**Creato per la privacy online** 🛡️
