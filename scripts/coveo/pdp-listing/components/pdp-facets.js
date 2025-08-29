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
  mainRow.className = "flex flex-wrap md:flex-row items-start md:items-center gap-2 sm:gap-4 md:gap-6 bg-white";

  // All Filters button
  const allFiltersBtn = document.createElement("button");
  allFiltersBtn.className =
    "flex mr-[70px] md:m-auto md:w-auto w-40 items-center gap-1 border px-3 py-[12px] rounded hover:bg-gray-100 text-black text-sm leading-5 font-normal font-twk";
  allFiltersBtn.innerHTML = `<span><img src="/icons/adjustments-black.svg" alt="arrow icon" width="20" height="21" /></span> All Filters`;
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
    dropdownContainer.className = "relative inline-block w-40 md:w-64";

    // Button
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "w-full border border-danahergray-300 bg-danahergray-100 px-3 py-[12px] rounded text-left focus:outline-none flex justify-between items-center gap-1 text-gray-500 text-sm leading-5 font-normal font-twk";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = placeholderText;
    button.appendChild(labelSpan);

    const chevron = document.createElement("span");
    chevron.innerHTML = `<img src="/icons/chevron-down.svg" alt="arrow icon" width="20" height="21" />`;
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
          arrow.innerHTML = `<img src="/icons/chevron-left-pdp.svg" alt="arrow icon" width="20" height="21" />`;
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
          arrow.innerHTML = `<img src="/icons/chevron-right.svg" alt="arrow icon" width="20" height="21" />`;
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
  searchWrapper.className = "relative w-full md:flex-1";

  const search = document.createElement("input");
  search.type = "text";
  search.placeholder = "Search by product name";
  search.className =
    "border p-8 pr-9 py-[12px] rounded w-full text-sm bg-gray-100 focus:outline-none";
  searchWrapper.appendChild(search);

  const iconSpan = document.createElement("span");
  iconSpan.className =
    "absolute top-0 flex items-center justify-center pointer-events-none p-4";
  iconSpan.innerHTML = `<img src="/icons/search-icon-pdp.svg" alt="arrow icon" width="20" height="21" />`;
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
