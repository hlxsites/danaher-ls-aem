/* eslint-disable */
import {div, button, h2, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
(function () {
  window.semaphore = window.semaphore || [];
  window.ketch = function () {
    window.semaphore.push(arguments);
  };

  let script = document.createElement("script");
  script.type = "text/javascript";
  // script.src = (window.location.host === 'lifesciences.danaher.com')
  //   ? "https://global.ketchcdn.com/web/v3/config/danaher/integrated_preferences/boot.js"
  //   : "https://global.ketchcdn.com/web/v3/config/danaher/danaher_test/boot.js";
  script.src = "https://global.ketchcdn.com/web/v3/config/danaher/danaher_test/boot.js";
  script.defer = script.async = true;
  document.head.appendChild(script);
})();

ketch('showPreferences', {
  tab: 'subscriptionsTab',
  showOverviewTab: false,
  showConsentsTab: false,
  showSubscriptionsTab: true,
});

function modifyElements() {
  document.querySelectorAll('.ketch-flex.ketch-flex-col.ketch-gap-5:not([data-modified])').forEach(node => {
    let selectionList = node.querySelector('.ketch-flex.ketch-flex-wrap.ketch-gap-6');

    node.dataset.modified = "true";
    let img = document.createElement("img");
    let paraElement = node.querySelector('.ketch-m-0');

    const opCoMapping = {
      'Danaher Cross OpCo Test': 'logo-danaher',
      'Abcam Test': 'logo-abcam',
      'Aldevron Test': 'logo-aldevron',
      'Beckman Coulter Dignostics Test': 'logo-beckmandx',
      'Beckman LS Test': 'logo-beckmanls',
      'Beckman Coulter Life Sciences Test': 'logo-beckmanls',
      'Cepheid Test': 'logo-cepheid',
      'Cytiva Test': 'logo-cytiva',
      'Danaher Life Sciences Test': 'logo-danaherls',
      'Genedata Test': 'logo-danaher',
      'HemoCue Test': 'logo-hemocue',
      'IDBS Test': 'logo-idbs',
      'IDT Test': 'logo-idt',
      'Leica Microsystems Test': 'logo-leicams',
      'Leica Biosystems Test': 'logo-leicabs',
      'Mammotome Test': 'logo-mammotome',
      'Molecular Devices Test': 'logo-moldev',
      'Pall Test': 'logo-pall',
      'Phenomenex Test': 'logo-phenomenex',
      'Radiometer Test': 'logo-radiometer',
      'Sciex Test': 'logo-sciex',
      'Danaher Cross OpCo': 'logo-danaher',
      'Abcam': 'logo-abcam',
      'Aldevron': 'logo-aldevron',
      'Beckman Coulter Dignostics': 'logo-beckmandx',
      'Beckman Coulter Life Sciences': 'logo-beckmanls',
      'Cepheid': 'logo-cepheid',
      'Cytiva': 'logo-cytiva',
      'Danaher Life Sciences': 'logo-danaherls',
      'Genedata': 'logo-genedata',
      'HemoCue': 'logo-hemocue',
      'IDBS': 'logo-idbs',
      'IDT': 'logo-idt',
      'Leica Microsystems': 'logo-leicams',
      'Leica Biosystems': 'logo-leicabs',
      'Mammotome': 'logo-mammotome',
      'Molecular Devices': 'logo-moldev',
      'Pall': 'logo-pall',
      'Phenomenex': 'logo-phenomenex',
      'Radiometer': 'logo-radiometer',
      'Sciex': 'logo-sciex',
    };

    let opCo = paraElement?.textContent.trim() || "";
    if (selectionList) {
      selectionList.querySelectorAll(`label[aria-label="Subscribe to ${opCo} via Mail"]`).forEach(label => {
        label.parentNode.removeChild(label);
      });
    }

    const imageDiv = div({class:"ketch-w-15"});
    // img.src = opCoMapping[opCo] || 'default';
    // img.className = "brand-left-logo";
    const logoName = opCoMapping[opCo] || 'logo-danaher';
    imageDiv.append(span({ class: `icon icon-${logoName} brand-left-logo`, style:'width:100%;' }));
    decorateIcons(imageDiv);

    const buttonDiv = div({class:"ketch-w-6"});

    const divEl = node.querySelector('div.ketch-flex.ketch-items-center.ketch-justify-between.ketch-gap-5');
    const labelEl = divEl.querySelector('label');
    labelEl?.classList.remove('ketch-w-[134px]')
    buttonDiv.appendChild(labelEl);

    const contentDiv = div({class:"ketch-w-79"});
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

async function hashEmail(email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function saveModal() {
    // Check if modal already exists to prevent duplicates
    if (document.getElementById("customModal")) return;
    // Create modal container div
    let modal = document.createElement("div");
    modal.id = "customModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "1000";

    // Create modal content div
    let modalContent = document.createElement("div");
    modalContent.style.width = "300px";
    modalContent.style.padding = "20px";
    modalContent.style.backgroundColor = "white";
    modalContent.style.borderRadius = "8px";
    modalContent.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.3)";
    modalContent.style.textAlign = "center";

    // Create message inside modal
    let message = document.createElement("p");
    message.innerText = "Your new marketing choices have been saved";

    // Create close button
    let closeButton = document.createElement("button");
    closeButton.innerText = "Ok";
    closeButton.style.marginTop = "15px";
    closeButton.style.padding = "8px 15px";
    closeButton.style.backgroundColor = "#7523FF";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
      document.body.removeChild(modal);
      window.location.href = window.location.href;
    };

    // Append elements
    modalContent.appendChild(message);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    event.preventDefault();

  }

  function closeModal() {
    // Check if modal already exists to prevent duplicates
    if (document.getElementById("close-Modal")) return;
    // Create modal container div
    let modal = document.createElement("div");
    modal.id = "close-Modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "1000";

    // Create modal content div
    let modalContent = document.createElement("div");
    modalContent.style.width = "300px";
    modalContent.style.padding = "20px";
    modalContent.style.backgroundColor = "white";
    modalContent.style.borderRadius = "8px";
    modalContent.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.3)";
    modalContent.style.textAlign = "center";

    // Create message inside modal
    let message = document.createElement("p");
    message.innerText = "You did not make any changes";

    // Create close button
    let closeButton = document.createElement("button");
    closeButton.innerText = "Ok";
    closeButton.style.marginTop = "15px";
    closeButton.style.padding = "8px 15px";
    closeButton.style.backgroundColor = "#7523FF";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
      document.body.removeChild(modal);
      window.location.href = window.location.href;
    };

    // Append elements
    modalContent.appendChild(message);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    event.preventDefault();

  }

function myKetchClosedEventHandler(reason) {
  if (reason === 'setSubscriptions') {
    saveModal();
  const data = localStorage.getItem("danaher_test_id");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('emailid');

    const body = {
      "email": btoa(email),
      "danaher_id": data
    };
    fetch('https://dh-life-sciences-nonprod.boomi.cloud/ws/rest/AEM/UpdateConsentHashID/;boomi_auth=ZGhsaWZlc2NpZW5jZXNsbGMtTEVBUTdPLldFTzFBTDpiOTQ4YjEwNC1hMjYyLTQxYzUtODdhNi0wOTA0ODQ2MjcxMjU=', {
      method: "POST",
      body,
      mode: 'cors',
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }).then(response => response.json())
      .then(console.log);
  } else if (reason === 'closeWithoutSettingConsent') {
    //alert("You did not make any changes");
    closeModal();
  }

  ketch('showPreferences', {
    tab: 'subscriptionsTab',
    showOverviewTab: false,
    showConsentsTab: false,
    showSubscriptionsTab: true
  });

}

export default async function decorate(block) {
  ketch('on', 'hideExperience', myKetchClosedEventHandler);

  const style = document.createElement("style");
  style.innerHTML = `
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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('emailid');
  hashEmail(email).then((data) =>{
    localStorage.setItem("danaher_test_id", data);
  });
}
