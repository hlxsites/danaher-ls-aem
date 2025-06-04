import { div, h1, p, button, hr, img } from "../../scripts/dom-builder.js";

export default function emptyCart() {
  const container = div({
    class: "inline-flex flex-col justify-center w-[1358px]",
  });

  // Browse button with event listener
  const browseButton = button(
    {
      class: "btn btn-lg font-medium btn-primary-purple rounded-full px-6 m-0",
      id: "browse-product",
    },
    "Browse Products"
  );
  browseButton.addEventListener("click", () => {
    window.location.href =
      "https://stage.lifesciences.danaher.com/us/en/products.html";
  });

  // Browse button with event listener
  const viewButton = button(
    {
      class:
        "btn btn-lg btn-outline-primary border-solid border-purple rounded-full px-6 m-0",
      id: "view-solution",
    },
    "View Solutions"
  );
  viewButton.addEventListener("click", () => {
    window.location.href =
      "https://stage.lifesciences.danaher.com/us/en/solutions.html";
  });

  // Cart Empty Message Section
  const cartMessage = div(
    {
      class: "inline-flex flex-col justify-start items-center gap-4",
    },
    img({
      class: "",
      src: "https://feature-em-t149--danaher-ls-aem--hlxsites.aem.page/icons/shopping-cart.png",
    }),
    h1(
      {
        class:
          "w-[861px] text-center justify-start text-gray-900 text-4xl font-normal  leading-[48px]",
      },
      "Your Cart is Empty"
    ),
    p(
      {
        class:
          "w-[855px] text-center justify-start text-gray-900 text-xl font-normal  leading-7",
      },
      "Explore our top products or a wide range of options for your workflow solutions"
    ),
    div(
      {
        class: "inline-flex justify-between gap-4",
      },
      browseButton,
      viewButton
    ),
    hr({
      class: "w-[1358px] border-black-500",
    })
  );

  // Browse by Topic Section
  const browseSection = div(
    {
      class:
        'w-[1358px] text-black text-2xl font-normal font-["TWK_Lausanne_Pan"] leading-loose',
    },
    "Browse by Topic"
  );

  const topicButtons = div({
    class:
      "w-[1227px] inline-flex justify-start items-start gap-4 flex-wrap content-start",
  });
  //     topicButtons.className = 'topic-buttons';

  const topics = [
    "Target selection",
    "Lead Optimisation",
    "Cell Line Development",
    "Process Development",
    "Pre Clinical Clinical",
    "Manufacturing",
    "mAb",
    "Gene Therapy",
    "Cell Therapy",
    "Innovations",
  ];

  topics.forEach((topic) => {
    const topicButton = button(
      {
        class:
          "px-4 py-1 bg-danaherpurple-500 bg-opacity-10 rounded-[48px] text-center justify-start text-violet-600 text-base font-bold  leading-snug",
      },
      topic
    );
    topicButtons.appendChild(topicButton);
  });

  browseSection.appendChild(topicButtons);

  // Append everything to the container
  container.appendChild(cartMessage);
  container.appendChild(browseSection);
  return container;
}
