export default function decorate(block) {
  block.classList = 'ctasection mx-auto max-w-7xl sm:px-6 lg:py-8 lg:px-6';
  block.querySelector('div').querySelector('div').classList = 'md:flex space-y-8 md:space-y-0 md:flex-row w-full py-8 md:py-16 md:px-12 px-6 items-center md:justify-between bg-danaherpurple-800';
  block.querySelector('div').querySelector('div').querySelector('h2').classList = 'text-2xl p-0 m-0 tracking-tight sm:text-3xl text-white font-normal';
  block.querySelector('div').querySelector('div').querySelector('p').classList = 'btn btn-outline-trending-brand rounded-full px-6 py-3';
}
