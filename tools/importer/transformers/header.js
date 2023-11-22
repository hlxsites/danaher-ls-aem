/* global decodeHtmlEntities */

const createBrandNavigation = (brandNavigationEl, document, main) => {
  // eslint-disable-next-line no-undef
  const brands = JSON.parse(decodeHtmlEntities(brandNavigationEl.getAttribute('brands')));
  const items = [];
  brands.forEach((brand) => {
    const a = document.createElement('a');
    a.setAttribute('href', brand.brandlink);
    a.textContent = brand.brandimagealt;
    const img = document.createElement('img');
    img.setAttribute('src', brand.brandimage);
    img.setAttribute('alt', brand.brandimagealt);
    items.push([img, a]);
  });
  const block = () => {
    const list = document.createElement('ul');
    items.forEach((item) => {
      const li = document.createElement('li');
      li.append(item[0]);
      li.append(item[1]);
      list.append(li);
    });
    return list;
  };
  main.append(block());
  main.append(document.createElement('hr'));
};

// eslint-disable-next-line max-len
const createMenuRecursive = (main, document, menuData, skipItems, parentTitle, parentLink, level) => {
  const menuEl = document.createElement('div');
  const listTitle = document.createElement('p');
  if (parentLink) {
    const anc = document.createElement('a');
    anc.setAttribute('href', parentLink);
    anc.append(parentTitle);
    listTitle.append(anc);
  } else {
    listTitle.append(parentTitle);
  }
  menuEl.append(listTitle);
  const listEl = document.createElement('ul');
  menuData.forEach((menuItem) => {
    if (skipItems.includes(menuItem.name)) {
      return;
    }
    let menuItemTitle = menuItem.name || menuItem.text;
    const menuItemId = `${parentTitle}|${menuItemTitle}`;
    const listItem = document.createElement('li');
    if (menuItem.links?.length > 0) {
      menuItem.items = menuItem.links;
    }
    if (menuItem.items?.length > 0) {
      // eslint-disable-next-line max-len
      createMenuRecursive(main, document, menuItem.items, skipItems, menuItemId, menuItem.href, level + 1);
      menuItemTitle = `${menuItemTitle} :arrow-right:`;
    }
    if (menuItem.href) {
      const anc = document.createElement('a');
      anc.setAttribute('href', menuItem.href);
      anc.append(menuItemTitle);
      listItem.append(anc);
    } else {
      listItem.append(menuItemTitle);
    }
    listEl.append(listItem);
  });
  menuEl.append(listEl);
  main.append(menuEl);
  // if (level > 1) {
  main.append(document.createElement('hr'));
  // }
};

const createMegaMenu = async (megaMenuHoverEl, main, document, params, url) => {
  // eslint-disable-next-line no-undef
  const skipItems = JSON.parse(decodeHtmlEntities(megaMenuHoverEl.getAttribute('menuheadervalues')));
  const fetchOpts = {};
  if (params.authorization) {
    fetchOpts.headers = { authorization: params.authorization };
  }
  const response = await fetch(new URL('/content/dam/danaher/system/navigation/megamenu_items_us.json', url), fetchOpts);
  const data = await response.json();
  if (data.length > 0) {
    createMenuRecursive(main, document, data.sort((a, b) => a.displayOrder - b.displayOrder), skipItems, 'Menu', null, 1);
  }
};

const createNavBar = async (navBarEl, main, document, params, url) => {
  const logoTemplateEl = navBarEl.querySelector('template[\\#logo]');
  if (logoTemplateEl) {
    const logo = logoTemplateEl.content.querySelector('logo');
    if (logo) {
      const imgSrc = '/content/dam/danaher/brand-logos/danaher/Logo.svg';
      const imgAlt = 'Danaher';
      const link = '/';
      const img = document.createElement('img');
      img.setAttribute('src', imgSrc);
      img.setAttribute('alt', imgAlt);
      const anc = document.createElement('a');
      anc.setAttribute('href', link);
      anc.append(imgAlt);
      main.append(img);
      main.append(anc);
    }
  }
  const linkTemplateEl = navBarEl.querySelector('template[\\#links]');
  if (linkTemplateEl) {
    const headerLinksEl = linkTemplateEl.content.querySelector('header-links');
    if (headerLinksEl) {
      // eslint-disable-next-line no-undef
      const headerLinks = JSON.parse(decodeHtmlEntities(headerLinksEl.getAttribute('headerlinks')));
      const list = document.createElement('ul');
      headerLinks.forEach((i) => {
        const item = document.createElement('li');
        const anc = document.createElement('a');
        anc.setAttribute('href', i.linkUrl);
        anc.append(`:${i.linkIcon.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase())}: ${i.linkName}`);
        item.append(anc);
        list.append(item);
      });
      main.append(list);
    }
  }
  main.append(document.createElement('hr'));
  const menuTemplateEl = navBarEl.querySelector('template[\\#megamenu]');
  if (menuTemplateEl) {
    const megaMenuHoverEl = menuTemplateEl.content.querySelector('megamenuhover');
    if (megaMenuHoverEl) {
      await createMegaMenu(megaMenuHoverEl, main, document, params, url);
    }
  }
};

const header = async (main, document, params, url) => {
  const danaherHeaderEl = main.querySelector('danaher-header');
  if (danaherHeaderEl) {
    const templates = Array.from(danaherHeaderEl.getElementsByTagName('template'));
    // eslint-disable-next-line no-restricted-syntax
    for await (const t of templates) {
      const brandNavigationEl = t.content.querySelector('brand-navigation');
      if (brandNavigationEl) {
        createBrandNavigation(brandNavigationEl, document, main);
      }

      const navBarEl = t.content.querySelector('navbar');
      if (navBarEl) {
        await createNavBar(navBarEl, main, document, params, url);
      }
    }
  }
};
export default header;
