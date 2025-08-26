/* eslint-disable */
import {
  productTypeFacetController,
  brandFacetController,
  documentTypeFacetController,
  searchBoxController
} from "../controllers/pdp-controllers.js";
import { createFiltersPanel } from "./pdp-side-panel.js";
import { renderFacetBreadcurm } from "./pdp-facet-breadcrumb.js";

export function renderCreateFacet() {
  const container = document.getElementById("filters-container");
  container.innerHTML = "";
  // === Main Filters Row ===
  const mainRow = document.createElement("div");
  mainRow.className = "flex lg:flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6 bg-white";

  // All Filters button
  const allFiltersBtn = document.createElement("button");
  allFiltersBtn.className =
    "flex items-center gap-1 border px-3 py-[12px] rounded hover:bg-gray-100 text-gray-500 text-sm leading-5 font-normal font-twk";
  allFiltersBtn.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8.0013 3.99999V2.66666M8.0013 3.99999C7.26492 3.99999 6.66797 4.59694 6.66797 5.33332C6.66797 6.0697 7.26492 6.66666 8.0013 6.66666M8.0013 3.99999C8.73768 3.99999 9.33464 4.59694 9.33464 5.33332C9.33464 6.0697 8.73768 6.66666 8.0013 6.66666M4.0013 12C4.73768 12 5.33464 11.403 5.33464 10.6667C5.33464 9.93028 4.73768 9.33332 4.0013 9.33332M4.0013 12C3.26492 12 2.66797 11.403 2.66797 10.6667C2.66797 9.93028 3.26492 9.33332 4.0013 9.33332M4.0013 12V13.3333M4.0013 9.33332V2.66666M8.0013 6.66666V13.3333M12.0013 12C12.7377 12 13.3346 11.403 13.3346 10.6667C13.3346 9.93028 12.7377 9.33332 12.0013 9.33332M12.0013 12C11.2649 12 10.668 11.403 10.668 10.6667C10.668 9.93028 11.2649 9.33332 12.0013 9.33332M12.0013 12V13.3333M12.0013 9.33332V2.66666" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span> All Filters`;
  allFiltersBtn.id = "openFiltersBtn";

  allFiltersBtn.addEventListener("click", async () => {
    let panel = document.getElementById("filtersPanel");

    if (!panel) {
      panel = createFiltersPanel();
      renderFacetBreadcurm();
    }

    let modalOverlay = document.getElementById("modalOverlay");
    panel.style.transform = "translateX(0)";
    modalOverlay.classList.remove("hidden");
  });

  mainRow.appendChild(allFiltersBtn);

  // Create and append selects
  function createCustomDropdown(controller, placeholderText) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.className = "relative inline-block w-64";

    // Button
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "w-full border border-danahergray-300 bg-danahergray-100 px-3 py-[12px] rounded text-left focus:outline-none flex justify-between items-center gap-1 text-gray-500 text-sm leading-5 font-normal font-twk";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = placeholderText;
    button.appendChild(labelSpan);

    const chevron = document.createElement("span");
    chevron.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
      viewBox="0 0 16 16" fill="none" class="transition-transform chevron-icon">
      <path d="M12.6654 6L7.9987 10.6667L3.33203 6" 
        stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    button.appendChild(chevron);

    // Dropdown Menu
    const menu = document.createElement("ul");
    menu.className =
      "absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded shadow max-h-60 overflow-y-auto hidden";

    // Recursive renderer
    function renderTreeNodes(nodes, level = 0) {
      let isOpen = false;
      const ul = document.createElement("ul");
      ul.className = `${level > 0 ? "ml-7" : ""} list-none m-0 p-0`;

      nodes.forEach((node) => {
        const li = document.createElement("li");
        li.className = "mb-1";

        const row = document.createElement("div");
        row.className =
          "flex gap-2 items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700";

        const label = document.createElement("span");
        label.textContent = `${node.value} (${node.numberOfResults})`;
        if (node.state === "selected") {
          label.classList.add("font-semibold", "text-danaherpurple-500");
        }

        // If has children -> add chevron
        if (node.children && node.children.length > 0) {
          const arrow = document.createElement("span");
          arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M6 1.33341L1.33333 6.00008L6 10.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
          row.appendChild(arrow);
          row.appendChild(label);

          // Toggle children visibility
          row.addEventListener("click", (e) => {
            e.stopPropagation();
            controller.deselectAll();
            labelSpan.textContent = node.value;
            setTimeout(rebuildMenu, 100);
          });
        } else {
          row.appendChild(label);
          const arrow = document.createElement("span");
          arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M1 1.33341L5.66667 6.00008L1 10.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
          node.path.length == 1 ? row.appendChild(arrow) : "";
          row.addEventListener("click", (e) => {
            isOpen = !isOpen;
            e.stopPropagation();
            controller.toggleSelect(node);
            labelSpan.textContent = node.value;
            setTimeout(rebuildMenu, 100);
          });
        }

        li.appendChild(row);

        // Render children
        let childrenContainer;
        if (node.children && node.children.length > 0) {
          childrenContainer = renderTreeNodes(node.children, level + 1);
          li.appendChild(childrenContainer);
        }
        ul.appendChild(li);
      });

      return ul;
    }

    function rebuildMenu() {
      menu.innerHTML = "";
      if (
        controller.state.valuesAsTrees &&
        controller.state.valuesAsTrees.length > 0
      ) {
        menu.appendChild(renderTreeNodes(controller.state.valuesAsTrees));
      } else {
        // fallback
        const { values } = controller.state;
        if(values.length >= 1){
          values.forEach((item) => {
            const option = document.createElement("li");
            option.textContent = item.label || item.value;
            option.className =
              "px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700";
  
            if (item.state === "selected") {
              labelSpan.textContent = item.label || item.value;
              option.classList.add("font-semibold", "text-indigo-600");
            }
  
            option.addEventListener("click", () => {
              controller.toggleSelect(item);
              menu.classList.add("hidden");
              // chevron.querySelector('svg').classList.remove('rotate-180');
              setTimeout(rebuildMenu, 100);
            });
  
            menu.appendChild(option);
          });
        }
      }
    }

    // Initial build
    rebuildMenu();

    // Toggle dropdown and rotate chevron
    button.addEventListener("click", () => {
      const isHidden = menu.classList.toggle("hidden");
      chevron.querySelector("svg").classList.toggle("rotate-180", !isHidden);
    });

    // Click outside closes dropdown and resets chevron
    document.addEventListener("click", (e) => {
      if (!dropdownContainer.contains(e.target)) {
        menu.classList.add("hidden");
        chevron.querySelector("svg").classList.remove("rotate-180");
      }
    });

    dropdownContainer.appendChild(button);
    dropdownContainer.appendChild(menu);
    return dropdownContainer;
  }

  if(productTypeFacetController.state.valuesAsTrees.length >= 1) {
    mainRow.appendChild(
      createCustomDropdown(productTypeFacetController, "Product Type")
    );
  }
  
  if(brandFacetController.state.values.length >= 1) {
    mainRow.appendChild(createCustomDropdown(brandFacetController, "Brand"));
  }

  if(documentTypeFacetController.state.values.length >= 1) {
     mainRow.appendChild(
    createCustomDropdown(documentTypeFacetController, "Document Type")
  );
  }

  // Search box
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "relative w-full flex-1";

  const search = document.createElement("input");
  search.type = "text";
  search.placeholder = "Search by product name";
  search.className =
    "border p-8 pr-9 py-[12px] rounded w-full text-sm bg-gray-100 focus:outline-none";
  searchWrapper.appendChild(search);

  const iconSpan = document.createElement("span");
  iconSpan.className =
    "absolute right-3 top-0 -translate-y-1/2 flex items-center justify-center pointer-events-none p-4";
  iconSpan.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 11 12" fill="none">
      <path d="M10.3818 10.2063L7.19353 7.01802C7.68828 6.3784 7.95592 5.59637 7.95592 4.77383C7.95592 3.78923 7.57165 2.86601 6.87679 2.16992C6.18192 1.47383 5.25625 1.09079 4.27288 1.09079C3.28951 1.09079 2.36384 1.47505 1.66897 2.16992C0.972879 2.86479 0.589844 3.78923 0.589844 4.77383C0.589844 5.7572 0.974107 6.68287 1.66897 7.37773C2.36384 8.07383 3.28828 8.45686 4.27288 8.45686C5.09542 8.45686 5.87623 8.18923 6.51585 7.6957L9.70413 10.8828C9.71348 10.8921 9.72458 10.8995 9.7368 10.9046C9.74901 10.9097 9.76211 10.9123 9.77534 10.9123C9.78856 10.9123 9.80166 10.9097 9.81387 10.9046C9.82609 10.8995 9.83719 10.8921 9.84654 10.8828L10.3818 10.3487C10.3912 10.3394 10.3986 10.3283 10.4036 10.316C10.4087 10.3038 10.4113 10.2907 10.4113 10.2775C10.4113 10.2643 10.4087 10.2512 10.4036 10.239C10.3986 10.2268 10.3912 10.2157 10.3818 10.2063ZM6.21752 6.71847C5.69699 7.23778 5.00703 7.52383 4.27288 7.52383C3.53873 7.52383 2.84877 7.23778 2.32824 6.71847C1.80893 6.19793 1.52288 5.50798 1.52288 4.77383C1.52288 4.03967 1.80893 3.34849 2.32824 2.82918C2.84877 2.30987 3.53873 2.02383 4.27288 2.02383C5.00703 2.02383 5.69822 2.30865 6.21752 2.82918C6.73683 3.34972 7.02288 4.03967 7.02288 4.77383C7.02288 5.50798 6.73683 6.19916 6.21752 6.71847Z" fill="#6B7280"/>
    </svg>
  `;
  searchWrapper.appendChild(iconSpan);

  mainRow.appendChild(searchWrapper);

  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchBoxController.updateText(search.value);
      searchBoxController.submit();
      console.log("searchBoxController", searchBoxController);
      console.log("Search query:", search.value);
    }
  });

  // Append both rows
  container.appendChild(mainRow);
}
