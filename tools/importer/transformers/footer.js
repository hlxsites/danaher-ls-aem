const createFooter = (main, document) => {
  main.querySelectorAll('footer > div > div > div').forEach((e) => {
    const cookiesLink = e.querySelector('.ot-sdk-show-settings');
    if (cookiesLink) {
      cookiesLink.setAttribute('href', '#manage-cookies');
    }
    main.append(e);
    main.append(document.createElement('hr'));
  });
  const copyright = main.querySelector('footer > div > div:last-child');
  if (copyright) {
    main.append(copyright);
  }
};
export default createFooter;
