import {
  a,
  div,
  li,
  option,
  select,
  span,
  ul,
} from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import { getProductResponse } from "../../scripts/commerce.js";
import { scrollPageTabFixed } from "../../scripts/scripts.js";

const extractIconName = (path) => path.split("/").pop().split(".")[0];
function openTab(target) {
  const parent = target.parentNode;

  const main = parent.closest("main");
  const selected = target.getAttribute("aria-selected") === "true";

  if (!selected) {
    // close all open tabs
    const openPageNav = target
      .closest("ul")
      .querySelectorAll('li[aria-selected="true"]');
    const openContent = main.querySelectorAll(
      '.section.page-tab[aria-hidden="false"]'
    );
    openPageNav.forEach((tab) => {
      tab.setAttribute("aria-selected", false);
      parent.children[0]?.classList.remove();
      tab?.children[0]?.children[2]?.classList.remove("[&_svg]:stroke-white");
      tab?.children[0]?.children[2]?.classList.add(
        "[&_svg]:stroke-danaherpurple-500"
      );
    });
    openContent.forEach((tab) => {
      tab.setAttribute("aria-hidden", true);
      tab.classList.add("hidden");
    });
    // open clicked tab
    parent.setAttribute("aria-selected", true);
    const tabs = main.querySelectorAll(
      `div.section[aria-labelledby="${target
        .getAttribute("href")
        .substring(1)}"]`
    );
    tabs.forEach((tab) => {
      tab.setAttribute("aria-hidden", false);
      tab.classList.remove("hidden");
    });
    const productHeroBottom = main.querySelector(".product-hero .basic-info");
    productHeroBottom.scrollIntoView({
      behavior: "smooth",
    });
  }
}

export function createTabList(tabs, currentTab, isJumpMenu) {
  const ulTag = ul(
    { class: "w-[300px] inline-flex flex-col ", role: "tablist" },
    ...tabs.map((tab) => {
      const isSelectedTab = tab.id === currentTab;
      const ancHref = isJumpMenu ? tab.link : `#${tab.id}`;
      const navItem = li(
        {
          class: "px-4 py-2 cursor-pointer ",
          role: "tab",
          "data-tabid": tab.id,
          "aria-selected": isSelectedTab,
        },
        a(
          {
            class: "px-4 py-2  cursor-pointer hover:bg-danaherpurple-50",
            href: ancHref,
            title: tab.name,
          },
          span({ class: "py-2 text-sm tracking-wider font-bold" }, tab.name)
        )
      );
      // navItem.addEventListener("click", () => setActiveTab(tabs, tab.id));

      return navItem;
    })
  );
  decorateIcons(ulTag);
  return ulTag;
}

// For mobile view
export function createDropdownList(tabs, currentTab, isJumpMenu) {
  const dropdownWrapper = div(
    { class: "mobile-jump-menu" },
    select(
      {
        id: "selectedTabId",
        class: "selected-tab",
        "aria-label": "selectedTabId",
      },
      ...tabs.map((tab) => {
        const value = isJumpMenu ? tab.link : tab.id;
        const isSelectedTab = tab.id === currentTab;
        const navItem = option({ value }, tab.name);
        if (isSelectedTab) navItem.setAttribute("selected", isSelectedTab);
        return navItem;
      })
    )
  );
  return dropdownWrapper;
}

function hasProducts(productResponse) {
  return (
    productResponse?.raw?.objecttype === "Family" &&
    productResponse?.raw?.numproducts > 0
  );
}

function hasParts(productResponse) {
  return (
    productResponse?.raw?.objecttype === "Bundle" &&
    productResponse?.raw?.numproducts > 0
  );
}

function hasResources(productResponse) {
  return productResponse?.raw?.numresources > 0;
}

function hasSpecifications(productResponse) {
  return productResponse?.raw?.numattributes > 0;
}

function hasOverview(productResponse) {
  return productResponse?.raw?.richlongdescription;
}

export default async function decorate(block) {
  const response = await getProductResponse();
  let productResponse;
  if (response?.length > 0) {
    productResponse = response.at(0);
  }

  const main = block.closest("main");
  const pageTabsContainer = main.querySelector(".page-tabs-container");
  pageTabsContainer.classList.add("border-r", "border-gray-500");
  const sections = main.querySelectorAll(".section.page-tab");
  const tabSections = [...sections].filter((section) =>
    section.hasAttribute("data-tabname")
  );

  const productTab = div({
    class: "inline-flex justify-between",
    id: "tabs-container",
  });
  block.append(productTab);
  // Get the container where the tabs will be displayed
  const tabsContainer = document.getElementById("tabs-container");

  // Create the wrapper for the tabs
  const tabWrapper = div({
    class: "w-[300px] inline-flex flex-col border-r border-gray-500",
    id: "tabs-wrapper",
  });
  productTab.append(tabWrapper);
  const tabsWrapper1 = document.getElementById("tabs-wrapper");

  // Append the tabs wrapper to the container
  tabsContainer.append(tabsWrapper1);

  if (tabSections) {
    let currentTab =
      window.location.hash?.replace("#", "") ||
      tabSections[0].getAttribute(".aria-labelledby");
    const tabExists = tabSections.some(
      (section) => section.getAttribute("aria-labelledby") === currentTab
    );

    if (!tabExists) {
      const element = document.getElementById(currentTab);
      if (element) {
        currentTab = element
          .closest(".page-tab")
          ?.getAttribute("aria-labelledby");
        setTimeout(() => {
          element.scrollIntoView();
        }, 5000);
      } else {
        currentTab = tabSections[0].getAttribute("aria-labelledby");
      }
    }

    sections.forEach((section) => {
      section.classList.add("inline-flex", "justify-between");
      // section.style.display = 'block';
      if (currentTab === section.getAttribute("aria-labelledby")) {
        section.setAttribute("aria-hidden", false);
        section.classList.remove("hidden");
        // section.classList.add("w-[700px]", "pl-[20px]", "inline-flex");
        section.style.display = "block";
        // section.setAttribute('id', 'tab-content');
        // setActiveData(filteredTabs, currentTab, section)
      } else {
        section.setAttribute("aria-hidden", true);
        section.classList.add("hidden");
      }
      // productTab.append(section);
    });

    const tabs = tabSections.map((tabSection) => {
      const tabName = tabSection.dataset.tabname;
      const tabId = tabSection.getAttribute("aria-labelledby");
      const tabIconPath = tabSection.dataset.tabicon;
      const iconName = extractIconName(tabIconPath);
      return { name: tabName, id: tabId, icon: iconName };
    });

    const filteredTabs = tabs.filter((tab) => {
      switch (tab.id) {
        case "specifications":
          return hasSpecifications(productResponse);
        case "resources":
          return hasResources(productResponse);
        case "products":
          return hasProducts(productResponse);
        case "product-details":
          return hasParts(productResponse);
        case "overview":
          return hasOverview(productResponse);
        default:
          return true;
      }
    });

    // Check if 'overview' tab exists
    const hasOverviewTab = filteredTabs.some((tab) => tab.id === "overview");

    // Set currentTab to 'overview' if it exists, otherwise 'specifications'
    currentTab = hasOverviewTab ? "overview" : "specifications";

    // If 'overview' tab does not exist, reload the page with '#specifications' in the URL
    if (!hasOverviewTab) {
      window.location.hash = "#specifications";
    }

    const navList = createTabList(filteredTabs, currentTab);
    // For Mobile View
    const dropdownList = createDropdownList(filteredTabs, currentTab);
    const menuElement = document.querySelector("mobilemenu");
    menuElement.appendChild(dropdownList);
    tabsWrapper1.append(navList);
  }

  window.addEventListener("hashchange", () => {
    const currentTab =
      window.location.hash?.replace("#", "") ||
      tabSections[0].getAttribute(".aria-labelledby");
    if (!currentTab) return;

    const element = main.querySelector(
      `.page-tab[aria-labelledby="${currentTab}"]`
    );

    if (element) {
      const targetTabId = element.getAttribute("aria-labelledby");
      const targetTab = block.querySelector(`a[href="#${targetTabId}"]`);
      if (!targetTab) return;
      openTab(targetTab);
    }

    const targetTab = block.querySelector(`a[href="#${currentTab}"]`);
    if (!targetTab) return;

    openTab(targetTab);
  });

  scrollPageTabFixed(pageTabsContainer);
  window.addEventListener("scroll", () => {
    scrollPageTabFixed(pageTabsContainer);
  });

  block.classList.add("z-10");
  return block;
}
