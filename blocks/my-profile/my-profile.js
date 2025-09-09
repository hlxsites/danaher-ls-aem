import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import { div, a } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const basketDataFromSession = JSON.parse(localStorage.getItem('basketData'));
  if(basketDataFromSession?.data?.data?.buyer === undefined){
    window.location.href = '/us/en/e-buy/login';
  }
  const firstName = basketDataFromSession?.data?.data?.buyer?.firstName;
  const lastName = basketDataFromSession?.data?.data?.buyer?.lastName;
  const userId = basketDataFromSession?.data?.data?.buyer?.accountID;
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const myProfileWrapper = div({
    class:
      'w-[70%] self-stretch inline-flex flex-col justify-start items-start gap-5',
  });
  const profileWrapper = div({
    class:
      'w-full ml-[20px] p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center',
    id: 'profileWrapper',
  });
  const profileTitleDiv = div(
    {
      class: 'self-stretch p-6 flex flex-col justify-start items-start gap-4',
    },
    div(
      {
        class:
          'self-stretch justify-start text-black text-3xl font-normal leading-10',
      },
      'My Profile',
    ),
    div(
      {
        class:
          'self-stretch justify-start text-black text-base font-extralight leading-snug',
      },
      'Welcome to your profile—everything you need to manage your account is right here',
    ),
  );
  const profileContainer = div(
    {
      class:
        'self-stretch px-5 py-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center gap-6',
    },
    div(
      {
        class:
          'self-stretch h-[836px] flex flex-col justify-start items-start gap-6',
      },
      div(
        {
          class:
            'self-stretch bg-white flex flex-col justify-start items-start gap-6',
        },
        div(
          {
            class:
              'self-stretch h-10 border-b-2 border-dashed flex flex-col justify-start items-start gap-2.5',
          },
          div(
            {
              class: 'self-stretch inline-flex justify-start items-start gap-5',
            },
            div(
              {
                class:
                  'justify-start text-black text-xl font-extralight leading-relaxed',
              },
              'Account Information',
            ),
          ),
        ),
        div(
          {
            class: 'self-stretch flex flex-col justify-start items-start gap-3',
          },
          div(
            {
              class:
                'self-stretch flex flex-col justify-start items-start gap-3',
            },
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'First Name',
              ),
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                firstName,
              ),
            ),
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Last Name',
              ),
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                lastName,
              ),
            ),
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Email',
              ),
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                userId,
              ),
            ),
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Contact Number',
              ),
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                '-',
              ),
            ),
          ),
        ),
        a(
          {
            class:
              'justify-start text-danaherpurple-500 text-base font-bold leading-snug',
          },
          'Edit Profile',
        ),
        div(
          {
            class:
              'self-stretch h-10 border-b-2 border-dashed border-gray-300 flex flex-col justify-start items-start gap-2.5',
          },
          div(
            {
              class: 'self-stretch inline-flex justify-start items-start gap-5',
            },
            div(
              {
                class:
                  'justify-start text-black text-xl font-extralight leading-relaxed',
              },
              'Password and Security',
            ),
          ),
        ),
        div(
          {
            class: 'inline-flex justify-start items-start gap-6',
          },
          div(
            {
              class: 'flex justify-start items-start gap-2',
            },
            a(
              {
                class:
                  'justify-start text-danaherpurple-500 text-base font-bold leading-snug',
              },
              'Change Password',
            ),
          ),
        ),
        div({
          class: 'self-stretch h-px border-b-2 border-dashed border-gray-300',
        }),
      ),
    ),
  );
  const dashboardSideBarContent = await dashboardSidebar();
  myProfileWrapper.append(profileTitleDiv);
  profileWrapper.append(profileContainer);
  myProfileWrapper.append(profileWrapper);
  wrapper.append(dashboardSideBarContent, myProfileWrapper);
  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}
