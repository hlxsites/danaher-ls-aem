export default function decorate(block) {
    const main = document.querySelector('main');
    main.prepend(block);
}
