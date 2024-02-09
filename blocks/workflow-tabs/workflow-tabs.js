import {
    div, li, ul, a, span,
  } from '../../scripts/dom-builder.js';
import { processEmbedFragment } from '../../scripts/scripts.js';

const classActive = 'active';

function handleTabClick(e, idx) {
    e.preventDefault();
    const { target } = e;
    console.log(target);
    [...target.closest('.tabs-nav').children].forEach((nav) => nav.classList.remove(classActive));
    target.closest('.tabs-nav-item').classList.add(classActive);
    const panes = target.closest('.workflow-tabs').querySelectorAll('.tab-pane');
    [...panes].forEach((pane) => {
        pane.classList.remove(classActive);
        pane.classList.add('hidden');
    });
    panes[idx].classList.add(classActive);
    panes[idx].classList.remove('hidden');
}

function buildNav(block) {
    const titles = block.querySelectorAll('.workflow-tabs > div > div:first-child');
    const navList = ul({ class: 'tabs-nav flex justify-start flex flex-wrap !ml-0' });
    [...titles].forEach((title, idx) => {
        const listItem = li(
        {
            class: 'tabs-nav-item flex items-center justify-center h-12 overflow-hidden capitalize group p-2 !mt-0',
            onclick: (e) => { handleTabClick(e, idx); },
            'aria-label': title.textContent,
        },
            a({class:'text-white bg-danaherblue-600 px-2 flex flex-col items-center justify-center w-full h-full hover:bg-danaherblue-600 hover:text-white border border-solid border-gray-300 rounded-2xl shadow-md !no-underline'},
                span({class:'py-3 text-xs font-medium leading-5'}, title.textContent),
            ),
        );
        navList.append(listItem);
    });
    navList.querySelector('li').classList.add(classActive);
    const navBlock = div({ class: 'w-full md:w-1/3' }, navList);
    return navBlock;
}

async function buildTabs(block) {
    const tabPanes = block.querySelectorAll('.workflow-tabs > div > div:last-child');
    const tabList = div({ class: 'tabs-list' });
    const decoratedPanes = await Promise.all([...tabPanes].map(async (pane, index) => {
        if(index === 0) pane.classList.add('tab-pane', classActive);
        else pane.classList.add('tab-pane', 'hidden');
        const decoratedPane = await processEmbedFragment(pane);
        decoratedPane.firstElementChild?.classList?.add('!py-0');
        return decoratedPane;
    }));
    decoratedPanes.forEach((pane) => { tabList.append(pane); });
    tabList.querySelector('.tab-pane')?.classList.add(classActive);
    return tabList;
}

export default async function decorate(block) {
    const nav = buildNav(block);
    const tabs = await buildTabs(block);
    block.innerHTML = '';

    block.append(nav);
    block.append(tabs);

    block.classList.add(...'flex flex-col w-full mx-auto max-w-7xl'.split(' '));
    return block;
}
  