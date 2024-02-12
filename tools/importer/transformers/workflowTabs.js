/* global WebImporter */

const createTabs = (workflowTabs, document) => {
  workflowTabs.forEach((item) => {
    const tabs = [];
    if (item?.getAttribute('workflowtabs')) {
      // eslint-disable-next-line no-undef
      const tabList = JSON.parse(decodeHtmlEntities(item?.getAttribute('workflowtabs')));
      tabList.forEach((element) => {
        const tabId = document.createElement('div');
        tabId.textContent = element.tabId;
        const tabName = document.createElement('div');
        tabName.textContent = element.tabName;
        tabs.push([tabName]);
      });
    }
    const templates = item.querySelectorAll('template');
    [...templates].forEach((template, index) => {
      if (template.content.children.length > 0) {
        [...template.content.children].forEach((element) => {
          const xf = element.firstElementChild?.id;
          const xfPath = xf.replace('content/experience-fragments/danaher/us/en/site', 'fragments')
            .replace('/jcr:content', '');
          tabs[index].push(xfPath);
        });
      }
    });
    const cells = [['Workflow Tabs'], ...tabs];
    if (tabs.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      item.append(block);
    }
  });
};

const createWorkflowTabs = (main, document) => {
  const workflowTabs = main.querySelectorAll('workflow-tabs');
  if (workflowTabs) createTabs(workflowTabs, document);
};
export default createWorkflowTabs;
