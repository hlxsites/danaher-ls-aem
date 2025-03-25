export default async function decorate(block) {
    block.innerHTML = '';
    block.classList.add('py-8', 'border-b', 'border-solid', 'border-black');
}