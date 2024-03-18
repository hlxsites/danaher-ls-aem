import {
  a, div, h2, span,
} from '../../scripts/dom-builder.js';
import { getProductResponse } from '../../scripts/commerce.js';
import { loadScript } from '../../scripts/lib-franklin.js';
import { imageHelper } from '../../scripts/scripts.js';

async function recombeeClient() {
  await loadScript('https://cdn.jsdelivr.net/gh/recombee/js-api-client@4.1.5/dist/recombee-api-client.min.js', { defer: true });
  await loadScript('https://web-integration.recombee.com/v1/recombee.js');
  return new window.recombee.ApiClient('danaher-dev', 'XQ9DzVLjEp3NUruSGgG8sIpIJYU0JsppPb8T2yoG0aipig3VROgtaZrQdLs1j4Ba', { region: 'us-west' });
}

export default async function decorate(block) {
  const response = await getProductResponse();
  if (response?.length > 0) {
    if (response[0]?.raw.attributejson !== undefined) {
      const attrWrapper = div({ class: 'attr-wrapper' });
      const attrJson = JSON.parse(response[0]?.raw.attributejson);
      attrJson.forEach((item) => {
        const tableCaption = div(
          { class: 'sm:flex sm:items-center pt-12' },
          div(
            { class: 'sm:flex-auto' },
            h2({ class: 'text-xl font-normal leading-6 text-black' }, item.label),
          ),
        );
        const tableContainer = div({ class: 'min-w-full mt-2 border divide-y divide-gray-300 rounded-lg' });
        item.value.forEach((items) => {
          const tableRow = div(
            { class: 'flex flex-row flex-wrap h-full min-w-full align-middle' },
            div(
              { class: 'flex w-full p-4 text-sm font-medium text-gray-900 bg-gray-100 md:w-1/4' },
              div(
                { class: 'my-auto' },
                items.label,
              ),
            ),
            div(
              { class: 'flex w-full p-4 text-sm text-gray-700 break-words md:w-2/4' },
              div(
                { class: 'my-auto' },
                items.value.toString().split(',').join(', '),
              ),
              div(
                { class: 'my-auto px-1' },
                items.unit,
              ),
            ),
          );
          tableContainer.append(tableRow);
        });
        attrWrapper.append(tableCaption);
        attrWrapper.append(tableContainer);
      });
      block.innerHTML = '';
      block.append(attrWrapper);
    }
  }
  const client = await recombeeClient();
  client.send(new window.recombee.AddDetailView('anonymous', response[0]?.raw.sku, { cascadeCreate: false }));
  const catRecResponse = await client.send(
    new window.recombee.RecommendItemsToItem(response[0]?.raw.sku, 'anonymous', 5, { scenario: 'products-in-same-category', returnProperties: true }),
  );
  const workflowRecResponse = await client.send(
    new window.recombee.RecommendItemsToItem(response[0]?.raw.sku, 'anonymous', 5, { scenario: 'products-in-workflow', returnProperties: true }),
  );
  if (catRecResponse.recomms.length > 0) {
    const catRecWrapper = div({ class: 'grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' });
    catRecResponse.recomms.forEach((item) => {
      catRecWrapper.append(
        a(
          { href: item.values?.url },
          div(
            { class: 'flex flex-col shadow-md bg-white rounded transform transition duration-500 hover:scale-105' },
            div(imageHelper(item.values.images?.at(0), item.values?.title, false)),
            div(
              { class: 'flex flex-col p-4' },
              span({ class: 'text-lg font-semibold text-danahergray-900 line-clamp-3 break-words h-14' }, item.values?.title),
              div({ class: 'text-sm text-gray-900 break-words line-clamp-4 h-20' }, item.values?.description),
            ),
          ),
        ),
      );
    });
    const catProductRec = div({ class: 'section' }, div({ class: 'mb-4' }, h2('Products in the same category')), catRecWrapper);
    document.querySelector('main').append(catProductRec);
  }

  if (workflowRecResponse.recomms.length > 0) {
    const workflowRecWrapper = div({ class: 'grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' });
    workflowRecResponse.recomms.forEach((item) => {
      workflowRecWrapper.append(
        a(
          { href: item.values?.url },
          div(
            { class: 'flex flex-col shadow-md bg-white rounded transform transition duration-500 hover:scale-105' },
            div(imageHelper(item.values.images?.at(0), item.values?.title, false)),
            div(
              { class: 'flex flex-col p-4' },
              span({ class: 'text-lg font-semibold text-danahergray-900 line-clamp-3 break-words h-14' }, item.values?.title),
              div({ class: 'text-sm text-gray-900 break-words line-clamp-4 h-20' }, item.values?.description),
            ),
          ),
        ),
      );
    });
    const workflowProductRec = div({ class: 'section' }, div({ class: 'mb-4' }, h2('Products used in same workflow steps')), workflowRecWrapper);
    document.querySelector('main').append(workflowProductRec);
  }

  document.querySelector('main').append(div({ class: 'section' }, div({ class: 'mb-4' }, h2('Others Also bought')), div({ id: 'widget-root-9c28af94-3eda-4ace-a5bf-45f6b024eff0' })));
  window.recombeeIntegration({
    type: 'SetDefaults',
    databaseId: 'danaher-dev',
    publicToken: 'XQ9DzVLjEp3NUruSGgG8sIpIJYU0JsppPb8T2yoG0aipig3VROgtaZrQdLs1j4Ba',
    rapiHostname: 'client-rapi-us-west.recombee.com:443',
    itemId: response[0]?.raw.sku,
  });
  window.recombeeIntegration({
    type: 'InitializeRecommendationWidget',
    widgetId: '4592708c-c106-4677-bb28-1ce718ba1381',
    rootElementId: 'widget-root-9c28af94-3eda-4ace-a5bf-45f6b024eff0',
  });
}
