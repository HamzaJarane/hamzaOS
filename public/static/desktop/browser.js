// https://stackoverflow.com/a/9851769

let isOpera = false;
let isFirefox = false;
let isSafari = false;
let isIE = false;
let isEdge = false;
let isChrome = false;
let isEdgeChromium = false;
let isBlink = false;

try {
    // Opera 8.0+
    isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
} catch { }

try {
    // Firefox 1.0+
    isFirefox = typeof InstallTrigger !== 'undefined';
} catch { }

try {
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
} catch { }

try {
    // Internet Explorer 6-11
    isIE = /*@cc_on!@*/false || !!document.documentMode;
} catch { }

try {
    // Edge 20+
    isEdge = !isIE && !!window.StyleMedia;
} catch { }

try {
    // Chrome 1 - 79
    isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
} catch { }

try {
    // Edge (based on chromium) detection
    isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
} catch { }

try {
    // Blink engine detection
    isBlink = (isChrome || isOpera) && !!window.CSS;
} catch { }

window.getBrowsers = {
    isOpera,
    isFirefox,
    isSafari,
    isIE,
    isEdge,
    isChrome,
    isEdgeChromium,
    isBlink,
};