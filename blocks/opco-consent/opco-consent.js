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

const modelEl = div({id:"modal", class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden"},
  div({class:"bg-white p-6 rounded-lg shadow-lg w-96"},
      button({id:"closeModal", class:"absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"}),
      h2({class:"text-xl font-bold mb-4"}, "Tailwind Modal"),
      button({id:"confirmAction", class:"px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"},
          "Confirm"
      )
    )
  );
  document.body.appendChild(modelEl);

async function hashEmail(email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function myKetchClosedEventHandler(reason) {

  if (reason === 'setSubscriptions') {
    // alert("Your new marketing choices have been saved");
    const data = localStorage.getItem("danaher_test_id");
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
    alert("You did not make any changes");
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
  `;
  document.head.appendChild(style);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('emailid');
  hashEmail(email).then((data) =>{
    localStorage.setItem("danaher_test_id", data);
  });
}
