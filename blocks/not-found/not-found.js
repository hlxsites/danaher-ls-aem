export default async function decorate(block) {
  block.innerHTML = `
    <div class="h-80 w-full absolute bottom-0 xl:inset-0 xl:h-full">
      <div class="h-full w-full xl:grid xl:grid-cols-2">
        <div class="xl:relative xl:col-start-2">
          <img 
              class="h-full w-full object-cover xl:absolute xl:inset-0"
              src="https://lifesciences.danaher.com/content/dam/danaher/backgrounds/group-gathered-large.jpg" 
              alt="Danaher Background"
          />
          <div aria-hidden="true" class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-900 xl:inset-y-0 xl:left-0 xl:h-full xl:w-32 xl:bg-gradient-to-r">
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-cols-2 xl:grid-flow-col-dense xl:gap-x-8">
      <div class="relative sm:pt-8 lg:pt-14 pt-12 sm:pb-80 pb-80 xl:col-start-1">
        <h2 class="text-sm font-semibold text-indigo-300 tracking-wide uppercase"></h2>
        <p class="text-sm font-semibold text-danaherblue-600 uppercase tracking-wide">404 error</p>
        <h1 class="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found</h1>
        <p class="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
        <div class="mt-6">
          <a href="https://lifesciences.danaher.com" title="Go back" class="group inline-flex items-center font-medium text-danaherblue-600 hover:text-danaherblue-500">Go back home
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:tracking-wide group-hover:font-semibold transition" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
          </a>
        </div>
        <div class="mt-12 grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2"></div>
      </div>
    </div>
  `;
}
