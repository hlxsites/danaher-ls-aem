/* eslint-disable import/no-unresolved */
import { getMetadata, loadScript } from '../../scripts/lib-franklin.js';
import { getCookie, isOTEnabled } from '../../scripts/scripts.js';

const categoryFamily = `
  <div class="coveo-skeleton flex flex-col lg:flex-row grid-rows-1 lg:grid-cols-5 gap-x-10 gap-y-4">
    <div class="col-span-1 border shadow rounded-lg w-full p-4 max-w-sm w-full">
      <div class="flex flex-col gap-y-4 animate-pulse">
        <div class="w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40"></div>
        <div class="w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40"></div>
        <div class="w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20"></div>
        <div class="w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40"></div>
      </div>
    </div>
    <div class="col-span-4 w-full">
      <div class="max-w-xs bg-neutral-300 rounded-md p-4 animate-pulse mb-4"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div class="flex flex-col gap-y-2 animate-pulse">
          <div class="h-72 rounded bg-danaheratomicgrey-200 opacity-500"></div>
          <div class="w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40"></div>
          <div class="space-y-1">
            <p class="w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40"></p>
            <p class="w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-20"></p>
            <p class="w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40"></p>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-2"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-2"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
          </div>
        </div>
        <div class="flex flex-col gap-y-2 animate-pulse">
          <div class="h-72 rounded bg-danaheratomicgrey-200 opacity-500"></div>
          <div class="w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40"></div>
          <div class="space-y-1">
            <p class="w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40"></p>
            <p class="w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20"></p>
            <p class="w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40"></p>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-2"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-2"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
          </div>
        </div>
        <div class="flex flex-col gap-y-2 animate-pulse">
          <div class="h-72 rounded bg-danaheratomicgrey-200 opacity-500"></div>
          <div class="w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40"></div>
          <div class="space-y-1">
            <p class="w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40"></p>
            <p class="w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20"></p>
            <p class="w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40"></p>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-2"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-2"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
            <div class="h-2 bg-danaheratomicgrey-200 rounded col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

export default async function decorate(block) {
  const category = getMetadata('fullcategory');
  
  block.classList.add('pt-10');
  // block.innerHTML = categoryFamily;

}
