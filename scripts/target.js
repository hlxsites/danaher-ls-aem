const SESSION_COOKIE_NAME = 'sessionId';
const SESSION_COOKIE_EXPIRATION_DAYS = 7;

/**
 * Escape a selector.
 * @param selector
 * @returns {string}
 */
function escapeSelector(selector) {
  return selector.replaceAll(/#(\d)/g, '#\\3$1 ');
}

/**
 * Generate a UUID.
 * @returns {string}
 */
function uuid() {
  return `sess-${Math.random()
    .toString(36)
    .substring(2, 9)}-${Date.now()
    .toString(36)}`;
}

  function targetPageParams() {
    return {
        "entity.id": window.atPageParams?.id,
        "entity.skuId": window.atPageParams?.skuId,
        "entity.categoryId": window.atPageParams?.categoryId,
        "entity.thumbnailURL": window.atPageParams?.thumbnailURL,
        "entity.name": window.atPageParams?.name,
        "entity.message": window.atPageParams?.message,
        "entity.pageUrl": window.atPageParams?.pageUrl,
        "entity.brand": window.atPageParams?.brand,
        "entity.page": window.atPageParams?.page,
        "entity.tags": window.atPageParams?.tags,
        "entity.articleAuthor":window.atPageParams?.articleAuthor,
        "entity.articlePostDate":window.atPageParams?.articlePostDate,
        "entity.articleReadTime":window.atPageParams?.articleReadTime,
        "danaherCompany": localStorage.getItem('danaher_company') ? localStorage.getItem('danaher_company') : "",
        "utmCampaign": localStorage.getItem('danaher_utm_campaign') ? localStorage.getItem('danaher_utm_campaign') : "",
        "utmSource": localStorage.getItem('danaher_utm_source') ? localStorage.getItem('danaher_utm_source') : "",
        "utmMedium": localStorage.getItem('danaher_utm_medium') ? localStorage.getItem('danaher_utm_medium') : "",
        "utmContent": localStorage.getItem('danaher_utm_content') ? localStorage.getItem('danaher_utm_content') : ""
    };
}

/**
 * Get a cookie by name.
 * @param name
 * @returns {string}
 */
function getCookie(name) {
  const cookies = document.cookie.split(';');
  return cookies.find((cookie) => {
    const [key, value] = cookie.split('=');
    return key.trim() === name && value;
  });
}

/**
 * Set a cookie.
 * @param name
 * @param value
 * @param days
 */
function setCookie(name, value, days) {
  document.cookie = `${name}=${value}; max-age=${days * 24 * 60 * 60}; path=/`;
}

/**
 * Get the session ID.
 * @returns {string}
 */
function getSessionId() {
  const existingSessionId = getCookie();
  if (existingSessionId) {
    return existingSessionId;
  }
  const newSessionId = uuid();
  setCookie(SESSION_COOKIE_NAME, newSessionId, SESSION_COOKIE_EXPIRATION_DAYS);
  return newSessionId;
}

/**
 * Get all offers from a response.
 * @param data
 * @returns {*[]}
 */
function getApplicableOffers(data) {
  const offers = data.execute?.pageLoad?.options.filter((option) => option.type === 'actions');
  if (offers.length) {
    let pendingOffers = offers;
    console.debug('pendingOffers', pendingOffers);
    const displayNewOffers = (mutations) => {
      for (let i = 0; i < mutations.length; i +=1) {
        pendingOffers = displayOffers(document, mutations[i].target, pendingOffers);
        if (!pendingOffers.length) {
          observer.disconnect();
          return;
        }
      }
  };
  document.querySelectorAll('[data-block-status="loaded"], [data-section-status="loaded"]').forEach((target) => {
    displayOffers(document, target, offers);
  });
  const observer = new MutationObserver(displayNewOffers);

  observer.observe(document.querySelector('main'), {
    subtree: true,
    attributes: true,
    attributeFilter: ['data-block-status', 'data-section-status'],
  });

  // Also observe the body for new elements.
  const bodyObserver = new MutationObserver(displayNewOffers);
  bodyObserver.observe(document.body, {
    childList: true,
  });

  return offers;
  }
}

/**
 * Fetch offers for a client and a host.
 * @param client
 * @param sessionId
 * @param useProxy Whether to use the proxy.
 * @returns {Promise<any>}
 */
async function fetchOffers(targetId, client, sessionId, useProxy) {
    const url = `${window.location.protocol}//${window.location.host}`;

    console.debug(`Loading offers for client ${client} and url ${url}`); // eslint-disable-line no-console
    const metadata = targetPageParams();

    const payload = {
        context: {
            channel: 'web',
            address: {
                url: 'https://target-integration--danaher-ls-aem--hlxsites.hlx.page/us/en/library/antibodies',
            }, 
        },
        property: {token:"6aeb619e-92d9-f4cf-f209-6d88ff58af6a"},
        execute: {
            pageLoad: {
              parameters: metadata
            },
        },
    };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  const host = useProxy ? '/' : `https://${client}.tt.omtrdc.net/`;
  console.debug(`Using target host: ${host}`); // eslint-disable-line no-console
  const response = await fetch(`${host}rest/v1/delivery?client=${client}&sessionId=${sessionId}`, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch offers: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();

  return getApplicableOffers(data);
}

/**
 * Render offers in a section.
 * @param section The section.
 * @param offers The offers.
 */
function displayOffers(document, sectionOrBlock, offers) {
  return offers.filter((offer) => {
    const remainingfOffers = offer.content?.filter(({ selector, content, type}) => {
      const targetElement = document.querySelector(escapeSelector(selector));
      if (!sectionOrBlock.contains(targetElement)) {
        return true;
      }
      if (targetElement) {
        switch (type) {
          case 'insertAfter':
            console.debug('inserting content after', targetElement); // eslint-disable-line no-console
            targetElement.insertAdjacentHTML('afterend', content);
            break;
          case 'insertBefore':
            console.debug('inserting content before', targetElement); // eslint-disable-line no-console
            targetElement.insertAdjacentHTML('beforebegin', content);
            break;
          case 'setHtml':
            console.debug('setting content of', targetElement); // eslint-disable-line no-console
            targetElement.innerHTML = content;
            break;
          default:
            console.warn(`unsupported action type ${type}`); // eslint-disable-line no-console
        }
      }
      return false;
    }
    );
    return remainingfOffers?.length;
  });
}

/**
 * Start targeting for a client on a host.
 * @param client The client.
 * @param useProxy Whether to use the proxy.
 */
export default async function loadOffers(targetId, client, pageParams, useProxy) {
  if (window.location.href.includes('adobe_authoring_enabled')) {
    // eslint-disable-next-line no-console
    console.debug('authoring enabled... skipping targeting');
    return;
  }

  const sessionId = getSessionId();
  // eslint-disable-next-line no-console
  console.debug(`Using session ID ${sessionId}`);

  const pendingOffers = fetchOffers(targetId, client, sessionId, pageParams, useProxy ?? window.location.host);

}
