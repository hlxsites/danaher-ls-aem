const plugin = require('tailwindcss/plugin')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./blocks/**/*.js', './scripts/*.js', '!./scripts/at-lsig.js', './fragments/*.html', './404.html'], // https://tailwindcss.com/docs/content-configuration#class-detection-in-depth
  darkMode: 'media', // or 'media' or 'class'
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('aria-expanded', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `[aria-expanded='true'] + .${e(
            `aria-expanded${separator}${className}`
          )}`
        })
      })
    }),
  ],
  safelist: [
    'appear',
    'btn',
    'bg-danaherlightblue-50',
    'bottom-border-right',
    'bg-color-right',
    'top-border'
  ],
  theme: {
    extend: {
      colors: {
        pallblue: '#00249C',
        danaherblue: {
          50: '#E0E9EB',
          100: '#DDE8F7',
          500: '#004A59',
          600: '#0D3172',
          700: '#09265B',
          900: '#061C44',
        },
        danaherdark: {
          500: '#0D3172',
          600: '#061C44',
        },
        danaherorange: {
          500: '#DC6016',
          600: '#DC6016',
          800: '#CE440C',
        },
        danaherblack: {
          500: '#333333',
          600: '#02697C',
          800: '#035D67',
          900: '#014254',
        },
        danahergray: {
          100: '#F3F4F6',
          200: '#F4F5F7',
          300: '#D1D5DB',
          500: '#6B7280',
          600: '#F4F5F7',
          700: '#374151',
          900: '#111827',
        },
        danaherlightblue: {
          50: '#EFFBFD',
          200: '#D8F4FA',
          500: '#3BC7E5',
          600: '#0D3172',
          700: '#31acc7',
        },
        danahergreyblue: {
          500: '#035D67',
        },
        danaherred: {
          50: '#FEF2F2',
          500: '#991B1B',
          800: '#7A197F'
        },
        danaherpurple: {
          25: '#F5EFFF',
          50: '#EADEFF',
          500: '#7523FF',
          800: '#4000A5',
        },
        lightblue: {
          50: '#e1f2f4',
          100: '#b3dfe4',
          200: '#80c9d2',
          300: '#4db3c0',
          400: '#27a3b3',
          500: '#3BC7E5',
          600: '#018b9d',
          700: '#018093',
          800: '#01768a',
          900: '#006479',
        },
        darkblue: {
          50: '#e0e9eb',
          100: '#b3c9cd',
          200: '#80a5ac',
          300: '#4d808b',
          400: '#266572',
          500: '#004a59',
          600: '#004351',
          700: '#003a48',
          800: '#00323e',
          900: '#00222e',
        },
        midblue: {
          50: '#e0e9eb',
          100: '#b3c9cd',
          200: '#80a5ac',
          300: '#4d808b',
          400: '#266572',
          500: '#004a59',
          600: '#004351',
          700: '#003a48',
          800: '#00323e',
          900: '#00222e',
        },
        darkred: {
          50: '#f8e7e3',
          100: '#eec3ba',
          200: '#e39b8c',
          300: '#d8725d',
          400: '#cf543b',
          500: '#c73618',
          600: '#c13015',
          700: '#ba2911',
          800: '#b3220e',
          900: '#a61608',
        },
        salmon: {
          50: '#fdede9',
          100: '#fbd1c7',
          200: '#f8b3a2',
          300: '#f5957c',
          400: '#f37e60',
          500: '#f16744',
          600: '#ef5f3e',
          700: '#ed5435',
          800: '#eb4a2d',
          900: '#e7391f',
        },
        peach: {
          50: '#fef4ef',
          100: '#fce3d7',
          200: '#fbd1bc',
          300: '#f9bea1',
          400: '#f7b08c',
          500: '#f6a278',
          600: '#f59a70',
          700: '#f39065',
          800: '#f2865b',
          900: '#ef7548',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        purple: {
          50: '#6C3F980D',
          100: '#6C3F98',
          200: '#7D56A4',
          300: '#F8F5FA',
          500: '#6b4098',
          800: '#623b8a',
        },
      },
      spacing: {
        54: '13.5rem',
        55: '14rem',
        82: '21rem',
        83: '21.5rem',
        86: '22rem',
        87: '22.5rem',
        90: '23rem',
        91: '23.5rem',
        92: '24rem',
        93: '24.5rem',
        97: '25rem',
        98: '26rem',
        99: '27rem',
        100: '28rem',
        101: '28.5rem',
        102: '29rem',
        103: '29.5rem',
        104: '30rem',
      },
      fontSize: {
        '4xl2': '2.5rem'
      },
      fontFamily: {
        sans: [
          '"Inter"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      screens: {
        print: { raw: 'print' },
        screen: { raw: 'screen' },
      },
    },
  }
};
