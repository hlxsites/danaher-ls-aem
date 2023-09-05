export function accessible() {
    var s = document.createElement('script');
    var h = document.querySelector('head') || document.body;
    s.src = 'https://acsbapp.com/apps/app/dist/js/app.js';
    s.async = true;
    s.defer = true;
    s.onload = function() {
      acsbJS.init({
        statementLink: '',
        footerHtml: '',
        hideMobile: false,
        hideTrigger: true,
        disableBgProcess: false,
        language: 'en',
        position: 'right',
        leadColor: '#f87314',
        triggerColor: '#146FF8',
        triggerRadius: '50%',
        triggerPositionX: 'right',
        triggerPositionY: 'bottom',
        triggerIcon: 'people',
        triggerSize: 'bottom',
        triggerOffsetX: 20,
        triggerOffsetY: 20,
        mobile: {
          triggerSize: 'small',
          triggerPositionX: 'right',
          triggerPositionY: 'bottom',
          triggerOffsetX: 20,
          triggerOffsetY: 20,
          triggerRadius: '20'
        }
      });
    };
    h.appendChild(s);
  }