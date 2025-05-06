import {
  a,
  div,
  li,
  option,
  select,
  span,
  ul,
  hr,
} from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import { getProductResponse } from "../../scripts/commerce.js";
import { scrollPageTabFixed } from "../../scripts/scripts.js";

const extractIconName = (path) => path.split("/").pop().split(".")[0];
const currentTab = "";
function openTab(target) {
  const parent = target.parentNode;
  const main = parent.closest("main");  
  
  // const selected = target.getAttribute("aria-selected") === "true";
  const sections = main.querySelectorAll(".section.page-tab");
  const tabSections = [...sections].filter((section) =>
    section.hasAttribute("data-tabname")
  );
  let currentTab =
      window.location.hash?.replace("#", "") ||
      tabSections[0].getAttribute(".aria-labelledby");
  sections.forEach((section) => {  
    section.style.paddingTop = '0px';
    if (currentTab === section.getAttribute("aria-labelledby")) {
      section.style.paddingTop = '170px';
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
  const tabList = document.querySelectorAll(".listTab");
 if(tabList){
  tabList.forEach((list)=>{
      if(list.getAttribute("data-tabid") == currentTab){
        list.classList.add(
          "text-violet-600",
          "text-base",
          "font-bold",
          "bg-gray-100",
          "border-l",
          "border-violet-500",
          "border-r", "border-gray-500"
        ); // Active tab styling
    }
    else {
      list.classList.remove(
        "text-violet-600",
        "text-base",
        "font-bold",
        "bg-gray-100",
        "border-l",
        "border-violet-500",
        "border-r", "border-gray-500"
      ); // Remove active tab styling
    }
  })
  // tabList.forEach(item => {
  //   console.log(item.id); // or item.textContent, etc.
  // });
 }
  
}

export function createTabList(tabs, currentTab, isJumpMenu) {
  const ulTag = ul(
    { class: "w-[300px] ml-[-4px] inline-flex flex-col",id:"tabList", role: "tablist" },
    ...tabs.map((tab) => {
      const isSelectedTab = tab.id === currentTab;
      const tabIcon = isJumpMenu ? tab.icon : `icon-dam-${tab.icon}`;
      const ancHref = isJumpMenu ? tab.link : `#${tab.id}`;
      const navItem = li(
        {
          // class: "px-4 py-4 cursor-pointer",
          role: "tab",
          "data-tabid": tab.id,
          "id": tab.id,
          class: "listTab px-4 py-4 cursor-pointer",
          // "aria-selected": isSelectedTab,
        },
        a(
          {
            class: "px-4 py-2  cursor-pointer",
            href: ancHref,
            title: tab.name,
          },
          // span({ class: `w-8 h-8 icon ${tabIcon} stroke-1 stroke-danaherpurple-500 group-hover:stroke-white` }),
          span({ class: "py-2 text-sm tracking-wider font-bold" }, tab.name)
          // span({ class: `icon icon-chevron-down mt-4 mb-2 [&_svg]:duration-300 [&_svg]:stroke-1 [&_svg]:group-hover:translate-y-1 [&_svg]:group-hover:stroke-white ${isSelectedTab ? '[&_svg]:stroke-white' : '[&_svg]:stroke-danaherpurple-500'}` }),
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

function setActiveTab(tabsData, activeIndex) {
  const tabContent = document.getElementById("tab-content");
  const tabsWrapper1 = document.getElementById("tabs-wrapper");
  const pageTabsContainer = main.querySelector(".page-tabs-container");
  activeIndex = activeIndex;
  // Set active tab styling and content
  tabsData.forEach((tab, index) => {
    const tabElement = tabsWrapper1.children[index];
    const content = tabContent;

    if (tab.id === activeIndex) {
      content.textContent = "";
      tabElement.classList.add(
        "text-violet-600",
        "text-base",
        "font-bold",
        "bg-gray-100",
        "border-l",
        "border-violet-500"
      ); // Active tab styling
      // pageTabsContainer.classList.add("border-r", "border-gray-500");
      // content.textContent = tab.content; // Set content for active tab
    } else {
      tabElement.classList.remove(
        "text-violet-600",
        "text-base",
        "font-bold",
        "bg-gray-100",
        "border-l",
        "border-violet-500"
      ); // Remove active tab styling
    }
  });
}
export default async function decorate(block) {
  const response = await getProductResponse();
  let productResponse;
  if (response?.length > 0) {
    productResponse = response.at(0);
  }

  const main = block.closest("main");
  const pageTabsContainer = main.querySelector(".page-tabs-container");
  console.log("page tabs container")
  pageTabsContainer.classList.add( "border-r", "border-gray-500");
  const pageTabsWrapper = main.querySelector(".page-tabs-wrapper");
  pageTabsWrapper.style.marginLeft = 'auto';
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

    const descriptionDiv = div({
      class: "w-[1000px] pl-[20px]"
    })
    sections.forEach((section) => {
      section.style.display = 'block';
      section.style.paddingTop = '0px';
      descriptionDiv.append(section);
      if (currentTab === section.getAttribute("aria-labelledby")) {
        section.setAttribute("aria-hidden", false);
        section.classList.remove("hidden");
        section.style.display = "block";
        
      } else {
        section.setAttribute("aria-hidden", true);
        section.classList.add("hidden");
      }
    });
    productTab.append(descriptionDiv);
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

  scrollPageTabFixed1(pageTabsContainer);
  window.addEventListener("scroll", () => {
    scrollPageTabFixed1(pageTabsContainer);
  });
  tabsWrapper1.classList.add("z-50");

  return block;
}
export function scrollPageTabFixed1(pageTabsContainer) {
  
  const tabList = document.getElementById("tabList");
  let pageTabsOriginalOffset = 0;
  if (!pageTabsOriginalOffset) {     
    const rectPageTabs = pageTabsContainer.getBoundingClientRect();
    pageTabsOriginalOffset = rectPageTabs.top;        
  }
  
  
  if (window.scrollY < pageTabsOriginalOffset) {
    tabList.classList.add(
      ..."sticky ml-[auto] mr-[auto] inset-x-0 top-[83px] z-50 [&_.page-tabs-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-start [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(
        " "
      )
    );
    tabList.classList.remove(
      ..."sticky ml-[auto] mr-[auto] top-[87px] z-50 inset-x-0 bg-white [&_.page-tabs-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-full [&_ul>li>a]:flex-row [&_ul>li>a]:items-start [&_ul>li>a]:justify-center".split(
        " "
      )
    );
  } else {
    tabList.classList.remove(
      ..."sticky ml-[auto] mr-[auto] inset-x-0 top-[83px] z-50 [&_.page-tabs-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-start [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(
        " "
      )
    );
    tabList.classList.add(
      ..."sticky top-[87px] ml-[auto] mr-[auto] z-50 bg-white inset-x-0 [&_.page-tabs-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-full [&_ul>li>a]:flex-row [&_ul>li>a]:items-start [&_ul>li>a]:justify-center".split(
        " "
      )
    );
  }
}
