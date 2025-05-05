export default function decorate(block) {
    const containerDiv=document.createElement("div");
    containerDiv.classList.add("container_carousel");
    block.appendChild(containerDiv);
}