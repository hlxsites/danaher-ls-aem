import { loadScript, toClassName } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Get model data from block.model (preferred) or fallback to dataset
  const model = block.model || {};
  const formTitle = model.formTitle || block.dataset.formTitle || 'Talk to an Expert';
  const successUrl = model.successUrl || block.dataset.successUrl || 'https://stage.lifesciences.danaher.com/us/en/solutions/mabs/cell-line-development.html';
  const errorUrl = model.errorUrl || block.dataset.errorUrl || 'https://help.salesforce.com/s/articleView?id=sf.mc_es_demanager.htm';
  const fields = model.fields || [];

  // Build dynamic fields HTML
  let fieldsHtml = '';
  fields.forEach((field) => {
    if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
      fieldsHtml += `
        <div class="form-field">
          <label for="${field.name}">${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>
          <input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} />
        </div>
      `;
    } else if (field.type === 'textarea') {
      fieldsHtml += `
        <div class="form-field">
          <label for="${field.name}">${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>
          <textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}></textarea>
        </div>
      `;
    } else if (field.type === 'select') {
      const options = (field.options || '').split('\n').map(opt => `<option value="${opt.trim()}">${opt.trim()}</option>`).join('');
      fieldsHtml += `
        <div class="form-field">
          <label for="${field.name}">${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>
          <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
            ${options}
          </select>
        </div>
      `;
    } else if (field.type === 'checkbox') {
      fieldsHtml += `
        <div class="form-field">
          <label>
            <input type="checkbox" name="${field.name}" ${field.required ? 'required' : ''} />
            ${field.label}
          </label>
        </div>
      `;
    }
    // Add more types as needed
  });

  block.innerHTML = `
    <div style="margin-top:-5rem;" class="relative my-2 mx-0 md:ml-2">
      <form action="https://cl.s13.exct.net/DEManager.aspx" id="TTAE" name="TTAE" method="post"
        style="background: linear-gradient(180deg, rgba(245,245,245,1) 0%, rgba(255,255,255,1) 100%);"
        class="text-sm w-full max-w-4xl box-border overflow-hidden rounded-xl my-0 mx-auto p-6" tabindex="0">
        <input type="hidden" name="_clientID" value="546006278" />
        <input type="hidden" name="_deExternalKey" value="TTAE" />
        <input type="hidden" name="_action" value="add" />
        <input type="hidden" name="_returnXML" value="1" />
        <input type="hidden" name="Inquiry_Type" value="${formTitle}" />
        <input type="hidden" name="Inquiry_Number" value="">
        <input type="hidden" name="UTM_Content" value="">
        <input type="hidden" name="UTM_Campaign" value="">
        <input type="hidden" name="UTM_Medium" value="">
        <input type="hidden" name="UTM_Term" value="">
        <input type="hidden" name="UTM_Source" value="">
        <input type="hidden" name="UTM_NLC" value="">
        <input type="hidden" name="Job_Role" data-required="true" value="">
        <input type="hidden" name="Country" data-required="true" value="">
        <input type="hidden" name="Page_Track_URL" value="">
        <input type="hidden" name="_successURL" value="${successUrl}" />
        <input type="hidden" name="_errorURL" value="${errorUrl}" />
        ${fieldsHtml}
        <input type="submit" value="Submit" class="btn border-2 px-8 mt-5 my-auto mr-auto btn-trending-brand">
      </form>
    </div>
  `;
}