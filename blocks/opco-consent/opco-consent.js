/* eslint-disable */
import { div, button, h2, h3, h4, span, p } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

// ======================
// CONFIGURATION
// ======================
const CONFIG = {
  debug: true, // Set to false in production
  allowedDomains: [
    'https://stage.lifesciences.danaher.com',
    'https://lifesciences.danaher.com',
    'http://localhost',
    'http://127.0.0.1'
  ],
  ketchScripts: {
    production: 'https://global.ketchcdn.com/web/v3/config/danaher/cross_opco_prod/boot.js',
    stage: 'https://global.ketchcdn.com/web/v3/config/danaher/danaher_test/boot.js'
  }, 
};

// ======================
// UTILITIES
// ======================
function debugLog(...args) {
  if (CONFIG.debug) console.log('[DEBUG]', ...args);
}

function isEnvironment(env) {
  const host = window.location.host;
  if (env === 'production') return host === 'lifesciences.danaher.com';
  if (env === 'stage') return host.includes('stage.lifesciences.danaher.com');
  return host.includes('localhost') || host.includes('127.0.0.1');
}

function getStorageKey() {
  return isEnvironment('production') ? 'danaher_id' : 'danaher_test_id';
}

function obfuscateEmail(email) {
  return btoa(email.split('').reverse().join(''));
}

function deobfuscateEmail(obfuscated) {
  return atob(obfuscated).split('').reverse().join('');
}

async function hashEmail(email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

// ======================
// CORE FUNCTIONALITY
// ======================
function initializeKetch() {
  window.semaphore = window.semaphore || [];
  window.ketch = function() {
    window.semaphore.push(arguments);
  };

  const script = document.createElement('script');
  script.src = isEnvironment('production')
    ? CONFIG.ketchScripts.production
    : CONFIG.ketchScripts.stage;
  script.defer = true;
  script.async = true;

  script.onload = () => debugLog('Ketch script loaded successfully');
  script.onerror = () => console.error('Ketch script failed to load');

  document.head.appendChild(script);
}

async function updateConsent(email, hashId) {
  const { url, token } = isEnvironment('production')
    ? CONFIG.boomiEndpoints.production
    : CONFIG.boomiEndpoints.stage;

  debugLog('Calling Boomi API:', { endpoint: url, email: obfuscateEmail(email) });

  
  try {
    const response = await fetch(`${isEnvironment}`+'/content/danaher/services/boomi/opcopreferences', {
      method: 'POST',
      body: JSON.stringify({ EMAIL: email, HASH_ID: hashId }),
      mode: 'cors'    
    });
    console.log('Response: TETST', response);
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
   // Parse the JSON response
   const jsonResponse = await response.json();

   // Process and display the data (example: displaying in the console)
   console.log('Status:', jsonResponse.status);
   console.log('Message:', jsonResponse.message);
  } catch (error) {
    console.error('Boomi API Error:', error);
    throw error;
  }
}

// ======================
// UI COMPONENTS
// ======================
function showModal(message, isSuccess = true) {
  const modalId = 'consent-modal';
  let modal = document.getElementById(modalId);

  if (modal) document.body.removeChild(modal);

  modal = document.createElement('div');
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const content = div(
    { class: 'bg-white rounded-lg p-6 w-full max-w-md text-center' },
    h4({ class: 'text-xl mb-auto' }, message),
    button(
      {
        class: `mb-4 px-4 py-2 mb-2 rounded ${isSuccess ? 'bg-danaherpurple-800' : 'bg-danaherpurple-800'} text-white`,
        onClick: () => {
          document.body.removeChild(modal);
          window.location.reload();
        }
      },
      'OK'
    )
  );

  modal.appendChild(content);
  document.body.appendChild(modal);
}

// ======================
// EVENT HANDLERS
// ======================
function handleKetchEvents(reason) {
  debugLog('Ketch event:', reason);

  const storageKey = getStorageKey();
  const hashId = localStorage.getItem(storageKey);
  const obfuscatedEmail = localStorage.getItem('reference1');

  debugLog('Storage contents:', {
    storageKey,
    hashId,
    obfuscatedEmail,
    allStorage: { ...localStorage }
  });

  if (!hashId || !obfuscatedEmail) {
    console.error('Missing storage data:', { hashId, obfuscatedEmail });
    showModal('Failed to save preferences. Please refresh and try again.', false);
    return;
  }

  try {
    const email = deobfuscateEmail(obfuscatedEmail);

    if (reason === 'setSubscriptions') {
      updateConsent(email, hashId)
        .then(() => showModal('Preferences saved successfully'))
        .catch(() => showModal('Preferences saved locally', false));
    } else if (reason === 'closeWithoutSettingConsent') {
      showModal('No changes were made');
    }
  } catch (error) {
    console.error('Error handling consent:', error);
    showModal('Error processing your request', false);
  }
}

// ======================
// MAIN FUNCTION
// ======================
function modifyElements() {
  document.querySelectorAll('.ketch-flex.ketch-flex-col.ketch-gap-5:not([data-modified])').forEach(node => {
    let selectionList = node.querySelector('.ketch-flex.ketch-flex-wrap.ketch-gap-6');

    node.dataset.modified = "true";
    let img = document.createElement("img");
    let paraElement = node.querySelector('.ketch-m-0');

    const opCoMapping = {
      'Danaher Cross OpCo Test': 'danaher.png',
      'Abcam Test': 'abcam.png',
      'Aldevron Test': 'aldevron-4c.png',
      'Beckman Coulter Dignostics Test': 'beckmancoulter.png',
      'Beckman Coulter Test': 'beckmancoulter.png',
      'Beckman LS Test': 'beckmancoulterls.png',
      'Beckman Coulter Life Sciences Test': 'beckmancoulterls.png',
      'Cepheid Test': 'cepheid.png',
      'Cytiva Test': 'cytiva.png',
      'Danaher Life Sciences Test': 'danaher.png',
      'Genedata Test': 'genedata.png',
      'HemoCue Test': 'HemoCue.png',
      'IDBS Test': 'idbs-4c.png',
      'IDT Test': 'idt.png',
      'Leica Microsystems Test': 'leica-microsystems-4c.png',
      'Leica Biosystems Test': 'leica-biosystems.png',
      'Mammotome Test': 'mammotome.png',
      'Molecular Devices Test': 'molecular-devices-4c.png',
      'Pall Test': 'pall.png',
      'Phenomenex Test': 'phenomenex.png',
      'Radiometer Test': 'radiometer.png',
      'Sciex Test': 'sciex-4c.png',
      'Danaher Cross OpCo': 'danaher.png',
      'Abcam': 'abcam.png',
      'Aldevron': 'aldevron-4c.png',
      'Beckman Coulter Dignostics': 'beckmancoulter.png',
      'Beckman Coulter Life Sciences': 'beckmancoulterls.png',
      'Cepheid': 'cepheid.png',
      'Cytiva': 'cytiva.png',
      'Danaher Life Sciences': 'danaher.png',
      'Genedata': 'genedata.png',
      'HemoCue': 'HemoCue.png',
      'IDBS': 'idbs-4c.png',
      'IDT': 'idt.png',
      'Leica Microsystems': 'leica-microsystems-4c.png',
      'Leica Biosystems': 'leica-biosystems.png',
      'Mammotome': 'mammotome.png',
      'Molecular Devices': 'molecular-devices-4c.png',
      'Pall': 'pall.png',
      'Phenomenex': 'phenomenex.png',
      'Radiometer': 'radiometer.png',
      'Sciex': 'sciex-4c.png',
    };

    let opCo = paraElement?.textContent.trim() || "";
    if (selectionList) {
      selectionList.querySelectorAll(`label[aria-label="Subscribe to ${opCo} via Mail"]`).forEach(label => {
        label.parentNode.removeChild(label);
      });
    }

    /* const imageDiv = div({ class: "ketch-w-15" });
    const logoName = opCoMapping[opCo] || 'logo-danaherls';
    imageDiv.append(span({ class: `icon icon-${logoName}.png brand-left-logo`, style: 'width:100%;' }));
    decorateIcons(imageDiv); */
    const imageDiv = div({ class: "ketch-w-15" });
    const logoName = opCoMapping[opCo] || 'danaher.png';
    const logoUrl = `/icons/${logoName}`;
    const logoImg = document.createElement("img");
    logoImg.src = logoUrl;
    logoImg.alt = opCo;
    logoImg.className = "brand-left-logo";
    //logoImg.style.width = "100%";
    imageDiv.appendChild(logoImg);

    const buttonDiv = div({ class: "ketch-w-6" });

    const divEl = node.querySelector('div.ketch-flex.ketch-items-center.ketch-justify-between.ketch-gap-5');
    const labelEl = divEl.querySelector('label');
    labelEl?.classList.remove('ketch-w-[134px]')
    buttonDiv.appendChild(labelEl);

    const contentDiv = div({ class: "ketch-w-79" });
    contentDiv.append(divEl, node.querySelector('div.ketch-flex.ketch-flex-wrap.ketch-gap-6'))
    node.prepend(imageDiv);
    node.append(contentDiv);
    node.append(buttonDiv);
    node.classList.remove('ketch-flex-col');
    node.classList.add('product');
  });
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      modifyElements();
    }
  });
});
observer.observe(document.documentElement, { childList: true, subtree: true });

export default async function decorate(block) {
  // 1. Initialize Ketch
  initializeKetch();

  // 2. Set up event handler
  ketch('on', 'hideExperience', handleKetchEvents);

  // 3. Configure Ketch UI
  ketch('showPreferences', {
    tab: 'subscriptionsTab',
    showOverviewTab: false,
    showConsentsTab: false,
    showSubscriptionsTab: true
  });

  // 4. Process email parameter if present
  const url = new URL(window.location.href);
  const emailParam = url.searchParams.get('emailid');

  if (emailParam && CONFIG.allowedDomains.some(domain => url.href.startsWith(domain))) {
    try {
      debugLog('Processing email parameter');
      const storageKey = getStorageKey();
      const emailHash = await hashEmail(emailParam);
      const obfuscatedEmail = obfuscateEmail(emailParam);

      localStorage.setItem('reference1', obfuscatedEmail);
      localStorage.setItem(storageKey, emailHash);

      debugLog('Stored data:', {
        email: obfuscatedEmail,
        hashId: emailHash,
        storageKey
      });

      // Clean URL
      url.searchParams.delete('emailid');
      window.history.replaceState({}, document.title, url.toString());
    } catch (error) {
      console.error('Email processing failed:', error);
    }
  }

  // 5. Add debug styles if needed
  if (CONFIG.debug) {
    const style = document.createElement('style');
    style.textContent = `
      /* #lanyard_root * {
        --ketch-debug-outline: 1px solid red;
      } */
     #lanyard_root * .\\!ketch-bg-\\[--k-preference-header-background-color\\] {
        border-bottom: 1px solid #112233 !important;
      }
      body #lanyard_root * .\\!ketch-bg-\\[--k-preference-tabs-subscriptions-unsubscribeAll-background-color\\] {
          background-color: #FFFFFF !important;
      }
      html {
        --k-preference-tabs-subscriptions-unsubscribeAll-switchButton-on-background-color: var(--k-preference-tabs-subscriptions-footer-actionButton-background-color) !important;
      }
      #lanyard_root * .ketch-w-15 {
        width: 15%;
      }
      #lanyard_root * .ketch-w-79 {
        width: 79%;
      }
      #lanyard_root * .ketch-w-6 {
        width: 6%;
      }
      #lanyard_root * .ketch-font-semibold {
        font-weight: 600 !important;
      }
      #lanyard_root * .ketch-text-ketch-h3 {
        font-size: 18px !important;
        line-height: 22.5px !important;
      }
      #lanyard_root * .ketch-text-ketch-h1 {
        font-size: 28px !important;
        line-height: 39px !important;
      }

      #lanyard_root * .ketch-gap-5 {
        gap: 20px !important;
      }
      #lanyard_root * .\!ketch-p-0 {
        padding: 16px 0 !important;
      }

      #lanyard_root * .\!ketch-bg-\[--k-preference-header-background-color\] {
        border-bottom: 1px solid #112233 !important;
      }
      body #lanyard_root * .\!ketch-bg-\[--k-preference-tabs-subscriptions-unsubscribeAll-background-color\] {
        background-color: #FFFFFF !important;
      }
      html {
        --k-preference-tabs-subscriptions-unsubscribeAll-switchButton-on-background-color: var(--k-preference-tabs-subscriptions-footer-actionButton-background-color) !important;
      }

      label[aria-label*="via Mail"].ketch-relative.\!ketch-m-0.ketch-inline-flex.\!ketch-p-0 {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}