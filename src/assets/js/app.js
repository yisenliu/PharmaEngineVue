// import 'core-js/stable';
// import 'core-js/es/array';
// import 'core-js/es/object/assign';
import Bowser from 'bowser'
// import 'lazysizes/plugins/respimg/ls.respimg';
// import 'picturefill';
// import anime from 'animejs/lib/anime.es.js'
import Pace from 'pace-js'
import 'lazysizes'
// window.app = app

// -------- prototype -------- //
Element.prototype.hide = function () {
  this.style.display = 'none'
}
Element.prototype.show = function () {
  this.style.removeProperty('display')
}
Element.prototype.hasClass = function (className) {
  this.classList.contains(className)
}
Element.prototype.addClass = function (classNames) {
  const classList = classNames.split(' ')
  this.classList.add(...classList)
}
Element.prototype.removeClass = function (classNames) {
  const classList = classNames.split(' ')
  classList.forEach(className => {
    this.classList.remove(className)
  })
}
Element.prototype.toggleClass = function (className) {
  const classes = this.classList
  if (classes.contains(className)) {
    classes.remove(className)
  } else {
    classes.add(className)
  }
}
Element.prototype.slideToggle = function (speed = 300) {
  if (getComputedStyle(this).display === 'none') {
    this.slideDown(speed)
  } else {
    this.slideUp(speed)
  }
}
Element.prototype.slideUp = function (speed = 300) {
  const h = this.offsetHeight
  this.style.overflow = 'hidden'
  this.style.height = h
  if (h > 0) {
    anime({
      targets: this,
      height: 0,
      duration: speed,
      easing: 'easeInOutSine',
      complete: () => {
        this.style.overflow = null
        this.style.height = null
        this.style.display = null
        if (this.style.length === 0) {
          this.removeAttribute('style')
        }
      }
    })
  } else {
    this.style.overflow = null
    this.style.height = null
    this.style.display = null
    if (this.style.length === 0) {
      this.removeAttribute('style')
    }
  }
}
Element.prototype.slideDown = function (speed = 300) {
  let h = 0
  this.style.display = 'block'
  h = this.offsetHeight
  this.style.height = 0
  this.style.overflow = 'hidden'
  anime({
    targets: this,
    height: h,
    duration: speed,
    easing: 'easeInOutSine',
    complete: () => {
      this.style.cssText = 'display: block'
    }
  })
}

// -------- Add a handler to window.onresize event -------- //
export const addToWindowOnResize = (newFn, parameters = null) => {
  const existFn = window.onresize
  if (Object.prototype.toString.call(existFn) !== '[object Function]') {
    window.onresize = function () {
      newFn(parameters)
    }
  } else {
    window.onresize = () => {
      existFn()
      newFn(parameters)
    }
  }
}
// console.log(`mode = ${process.env.NODE_ENV}`);

//  -------- Device detector -------- //
export const browser = Bowser.getParser(window.navigator.userAgent).parsedResult
  .browser
export const getDevice = () => {
  var html = document.querySelector('html')
  var device = window
    .getComputedStyle(html)
    .getPropertyValue('--device')
    .trim()
    .replace(/"/g, '')
    .replace(/'/g, '')

  if (isIE()) {
    device = window
      .getComputedStyle(html)
      .getPropertyValue('counter-reset')
      .trim()
      .replace(/"/g, '')
  }
  return device
}
export const isMobile = () => {
  if (getDevice() === 'mobile') return true
  return false
}
export const isTablet = () => {
  if (getDevice() === 'tablet') return true
  return false
}
export const isDesktop = () => {
  if (getDevice() === 'desktop') return true
  return false
}
export const isIE = () => {
  if (browser.name.indexOf('Internet Explorer') !== -1) return true
  return false
}
export const isFirefox = () => {
  if (browser.name.indexOf('Firefox') !== -1) return true
  return false
}
export const isChrome = () => {
  if (browser.name.indexOf('Chrome') !== -1) return true
  return false
}

// -------- get element's position and dimensions -------- //
export const domRect = val => {
  const el = typeof val === 'string' ? document.querySelector(val) : val
  if (el) {
    const rect = getBoundingClientRect(el)
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return {
      ...rect,
      offsetTop: rect.top + scrollTop,
      offsetLeft: rect.left + scrollLeft
    }
  } else {
    console.error('element is null')
  }
}

// convert a ClientRect / DomRect into a plain Object
export const getBoundingClientRect = el => {
  const {
    top,
    right,
    bottom,
    left,
    width,
    height,
    x,
    y
  } = el.getBoundingClientRect()
  return { top, right, bottom, left, width, height, x, y }
}

// https://andyyou.github.io/2015/04/07/get-an-element-s-position-by-js/
// export const domRect2 = selector => {
//   let el = document.querySelector(selector);
//   if (el) {
//     const rect = getBoundingClientRect(el);
//     let offsetleft = 0;
//     let offsetTop = 0;
//     while (el) {
//       offsetleft += el.offsetLeft - el.scrollLeft + el.clientLeft;
//       offsetTop += el.offsetTop - el.scrollLeft + el.clientTop;
//       el = el.offsetParent;
//     }
//     return { offsetleft, offsetTop, ...rect };
//   } else {
//     console.error('element is null');
//   }
// };

// -------- Console API -------- //
export const myConsole = {}
export const debug = function (enable) {
  var html = document.querySelector('html')
  var htmlClassList = html.classList
  var type

  for (type in window.console) {
    if (enable) {
      myConsole[type] = window.console[type]
    } else {
      myConsole[type] = function () {
        return
      }
    }
  }
  if (enable) {
    if (!htmlClassList.contains('debugMode')) {
      htmlClassList.add('debugMode')
    }
    return 'active debug mode'
  } else {
    if (htmlClassList.contains('debugMode')) {
      htmlClassList.remove('debugMode')
    }
    return 'disable debug mode'
  }
}

// -------- Cookie -------- //
export const cookie = {
  set: (cname, cvalue, exdays) => {
    var d = new Date()
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
    var expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
  },
  get: cname => {
    var name = cname + '='
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }
}

//  -------- modules -------- //
export const headroom = (element, options) => {
  return import(
    /* webpackPreload: true, webpackChunkName: "headroom" */ 'headroom.js'
  ).then(({ default: Headroom }) => {
    const el = document.querySelector(element)
    const headroomOptions = Object.assign({}, options)
    const headroomInstance = new Headroom(el, headroomOptions)

    headroomInstance.init()
    return headroomInstance
  })
}

export const swiper = async (selector, options) => {
  await import(
    /* webpackPreload: true, webpackChunkName: "swiper" */
    '@/assets/sass/vendors/swiper/swiper.scss'
  )
  let { default: Swiper } = await import(
    /* webpackPreload: true, webpackChunkName: "swiper" */ 'swiper/js/swiper.js'
  )
  return new Swiper(selector, options)
}

export const loadWaypoint = async () => {
  await import(
    /* webpackPreload: true, webpackChunkName: "waypoints" */ 'waypoints/lib/noframework.waypoints.js'
  )
  await import(
    /* webpackPreload: true, webpackChunkName: "inview" */ 'waypoints/lib/shortcuts/inview.js'
  )
  return Waypoint
}

// app.debug(DEVELOPMENT ? true : false)

// -------- Pace progress -------- //
Pace.on('done', function () {
  const paceAnime = anime({
    targets: '.pace-activity',
    scaleY: 0,
    duration: 600,
    easing: 'easeInQuart'
  })
  paceAnime.finished.then(() => {
    if (Object.prototype.toString.call(app.paceDone) === '[object Function]') {
      app.paceDone()
    }
  })
})
Pace.start()

// before leaving the page
let targetUrl = ''
const links = document.querySelectorAll('a')
links.forEach(link => {
  link.addEventListener('click', event => {
    const lastUrl = targetUrl
    const element = event.currentTarget

    targetUrl = element.href
    if (
      ['_self', '_top', '_parent', ''].includes(element.target) &&
      targetUrl.indexOf('http') !== -1 &&
      lastUrl !== targetUrl
    ) {
      event.preventDefault()
      anime.set('.pace-activity', { transformOrigin: 'left bottom' })
      anime.set('.pace', { display: 'block' })
      anime({
        targets: '.pace-activity',
        scaleY: 1,
        duration: 600,
        easing: 'easeInQuart',
        complete() {
          document.location.href = targetUrl
        }
      })
    }
  })
})
