/* global WebImporter */
const createOneTrust = (main, document) => {
  const oneTrust = main.querySelector('onetrustpolicy');
  if (oneTrust) {
    const opcoName = oneTrust.getAttribute('opco_name');
    const opcoAddrsMultiline = oneTrust.getAttribute('opco_addrs_multiline');
    const opcoAddrsSingleline = oneTrust.getAttribute('opco_addrs_singleline');
    const opcoEmail = oneTrust.getAttribute('opco_email');
    const opcoPrivacyPolicy = oneTrust.getAttribute('opco_privacy_policy');
    const opcoCookiePolicy = oneTrust.getAttribute('opco_cookie_policy');
    const opcoCCPAPolicy = oneTrust.getAttribute('opco_ccpa_policy');
    const policyId = oneTrust.getAttribute('policyid');

    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = opcoName;
    if (h1) {
      div.append(h1);
    }
    if (opcoName) {
       const opcoNamePEl = document.createElement('p');
       opcoNamePEl.textContent = opcoName;
       div.append(opcoNamePEl);
    }
    if (opcoAddrsMultiline) {
      const multiAddrsPEl = document.createElement('p');
      multiAddrsPEl.textContent = opcoAddrsMultiline;
      div.append(multiAddrsPEl);
    }
    if(opcoAddrsSingleline){
      const singleAddrsPEl = document.createElement('p');
      singleAddrsPEl.textContent = opcoAddrsSingleline;
      div.append(singleAddrsPEl);
    }
    if (policyId) {
      const polIdEl = document.createElement('p');
      polIdEl.textContent = policyId;
      div.append(polIdEl);
    }
    if (opcoEmail) {
      const pEl = document.createElement('p');
      const anchorEmail = document.createElement('a');
      anchorEmail.setAttribute('href', opcoEmail);
      anchorEmail.textContent = 'privacy@danaher.com';
      pEl.append(anchorEmail);
      div.append(pEl);
    }
    if(opcoPrivacyPolicy){
      div.append(policylink(opcoPrivacyPolicy, document));
    }
    if(opcoCCPAPolicy){      
      div.append(policylink(opcoCCPAPolicy, document));
    }
    if(opcoCookiePolicy){
      div.append(policylink(opcoCookiePolicy, document));
    }
    const cells = [
      ['OneTrustPolicy'],
      [div],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    oneTrust.append(block);
  }
};

export const policylink = (opcoPolicy, document) => {
  const pEl = document.createElement('p');
  const anchor = document.createElement('a');
  anchor.setAttribute('href', opcoPolicy);
  anchor.textContent = opcoPolicy;
  pEl.append(anchor);
  return pEl;
};

export default createOneTrust;