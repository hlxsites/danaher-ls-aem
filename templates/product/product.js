function getCoveoApiPayload() {
    const sku = window.location.pathname.split('/')?.slice(-1).at(0).split('.').at(0);
    const paylod = {
        context: {
            host: 'stage.lifesciences.danaher.com',
            internal: false
        },
        q: `@familyid==${sku}`,
        pipeline: 'Product Details',
    }
    return paylod;
}

async function makeCoveoApiRequest(path, payload = {}) {
    const accessToken = window.DanaherConfig !== undefined
      ? window.DanaherConfig.familyProductKey
      : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
    const organizationId = window.DanaherConfig !== undefined
      ? window.DanaherConfig.searchOrg
      : 'danahernonproduction1892f3fhz';
    const resp = await fetch(`https://${organizationId}.org.coveo.com${path}?organizationId=${organizationId}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const jsonData = await resp.json();
    return jsonData;
  }

export default async function buildAutoBlocks() {
    const main = document.querySelector('main');
    makeCoveoApiRequest('/rest/search/v2', getCoveoApiPayload()).then((data) => {
        console.log(data);
    })
}