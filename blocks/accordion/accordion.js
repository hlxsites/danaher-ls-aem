import { dl, dt, dd, div, h3, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
    const accordion = dl({class:'mt-10 space-y-4 divide-y divide-gray-900/10'},
                        div({class: 'pt-6'})
                      );
    [...block.children].forEach(element => {
        console.log(element);
        const buttonEl = dt(
                            button({id:'headlessui-disclosure-button', type:'button', class: 'flex w-full items-start justify-between text-left text-gray-900'},
                                h3({class: 'text-base font-semibold leading-7'}, 'title',
                                    span({class: 'ml-6 flex h-7 items-center'})
                                  )
                                )
                            );
        buttonEl.querySelector('span').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="chevy ml-2 h-5 w-5 transition"><path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"></path></svg>';
        accordion.querySelector('div.pt-6').append(buttonEl);
    });
    block.append(accordion);
}