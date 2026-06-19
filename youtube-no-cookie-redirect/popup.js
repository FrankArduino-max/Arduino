/**
 * Script per il popup dell'estensione
 */

// Inizializza il popup al caricamento
document.addEventListener('DOMContentLoaded', initializePopup);

function initializePopup() {
  const enableToggle = document.getElementById('enable-toggle');
  const statusText = document.getElementById('status-text');

  // Carica le impostazioni salvate
  chrome.storage.local.get('extensionEnabled', (data) => {
    const isEnabled = data.extensionEnabled !== false;
    enableToggle.checked = isEnabled;
    updateStatus(isEnabled);
  });

  // Ascolta i cambiamenti del toggle
  enableToggle.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    // Salva immediatamente nello storage
    chrome.storage.local.set({ extensionEnabled: enabled }, () => {
      updateStatus(enabled);
      console.log('Estensione ' + (enabled ? 'abilitata' : 'disabilitata'));
    });
  });
}

function updateStatus(enabled) {
  const statusText = document.getElementById('status-text');
  const indicator = document.querySelector('.status-indicator');

  if (enabled) {
    statusText.textContent = 'Attivo ✅';
    indicator.classList.add('active');
    indicator.classList.remove('inactive');
  } else {
    statusText.textContent = 'Disattivato ⏸️';
    indicator.classList.remove('active');
    indicator.classList.add('inactive');
  }
}
