import { loadScript, toClassName } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Read config from block dataset or JSON if needed
  const formTitle = block.dataset.formTitle || 'Talk to an Expert';
  const successUrl = block.dataset.successUrl || 'https://stage.lifesciences.danaher.com/us/en/solutions/mabs/cell-line-development.html';
  const errorUrl = block.dataset.errorUrl || 'https://help.salesforce.com/s/articleView?id=sf.mc_es_demanager.htm';

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
        <!-- ...form fields as in your HTML... -->
      </form>
    </div>
  `;

  // Add dropdown, validation, and UTM logic
  // (Paste your <script> logic here, but wrap in a function and call after block.innerHTML)
  // Example:
  setTimeout(() => {
    document.querySelectorAll('input#Job_Role + label + ul > li').forEach(function (el) {
      el.addEventListener('click', function () {
        const dropdownInput = document.querySelector('input[name="Job_Role"]');
        dropdownInput.value = el.innerText === 'Select' ? '' : el.innerText;
        const dropdownLabel = document.querySelector('input#Job_Role + label');
        dropdownLabel.children[0].innerHTML = el.innerText;
        dropdownLabel.click();
      });
    });
    // ...repeat for Country, validation, UTM, etc...
  }, 0);
}