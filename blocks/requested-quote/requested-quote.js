import dashboardSidebar from "../dashboardSideBar/dashboardSideBar";
export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  document.querySelector("main").style = "background: #f4f4f4";
   const requestedQuoteWrapper = div({
      class: 'w-[70%] self-stretch h-[831px] inline-flex flex-col justify-start items-start gap-5',
    });
    const resquestedquoteTitleDiv = div({
        class: "self-stretch flex flex-col justify-start items-start gap-4"
    },
    div({
        class: "self-stretch justify-start text-black text-3xl font-normal leading-10"
    }, "Requested Quote"),
    div({
        class: "self-stretch justify-start text-black text-base font-extralight leading-snug"
    }, "Track the status of your quote requests and stay in the loop.")
    );
    const wrapper = div({
      id: 'dashboardWrapper',
      class:
            'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
    });
    requestedQuoteWrapper.append(resquestedquoteTitleDiv);
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper.append(dashboardSideBarContent, requestedQuoteWrapper);
  block.innerHTML = "";
  block.textContent = "";
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}
