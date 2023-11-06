/* global WebImporter */
const createEventCards = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((fl) => {
    const cards = [];
    fl.querySelectorAll('grid > template').forEach((tmp) => {
      const eventCard = tmp.content.querySelector('eventcard');
      if (eventCard) {
        const fromTime = eventCard.getAttribute('fromtime');
        const toTime = eventCard.getAttribute('totime');
        const eventType = eventCard.getAttribute('eventtype');
        const eventLocation = eventCard.getAttribute('location');
        const eventDescription = eventCard.getAttribute('description');
        const linkUrl = eventCard.getAttribute('linkurl');
        const linkText = eventCard.getAttribute('linktext');
        const eventDateDiv = document.createElement('div');
        const fd = new Date(fromTime);
        const fdate = fd.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
        const frdate = fd.toLocaleString([], { day: 'numeric' });
        const frmonth = fd.toLocaleString([], { month: 'short' });
        eventDateDiv.append(`${frdate} ${frmonth.toUpperCase()}`);
        const td = new Date(toTime);
        const tdate = td.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
        const todate = td.toLocaleString([], { day: 'numeric' });
        const tomonth = td.toLocaleString([], { month: 'short' });
        eventDateDiv.append(` - ${todate} ${tomonth.toUpperCase()}`);
        const typeSpan = document.createElement('p');
        typeSpan.textContent = eventType;
        eventDateDiv.append(typeSpan);
        const descP = document.createElement('p');
        descP.textContent = eventDescription;
        eventDateDiv.append(descP);
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        li1.textContent = `:clock: ${fdate.toUpperCase()} - ${tdate.toUpperCase()}`;
        const li2 = document.createElement('li');
        li2.textContent = `:location: ${eventLocation}`;
        ul.appendChild(li1); ul.appendChild(li2);
        eventDateDiv.append(ul);
        const a = document.createElement('a');
        a.setAttribute('href', linkUrl);
        a.textContent = linkText;
        eventDateDiv.append(a);

        cards.push([eventDateDiv]);
      }
    });
    const cells = [['Cards (eventcard)'], ...cards];
    if (cards.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      fl.append(block);
    }
  });
};
export default createEventCards;
