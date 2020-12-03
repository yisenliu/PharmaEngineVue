export default options => {
  let config = {
    trigger: '.scrollDown',
    target: null
  }
  config = Object.assign({}, config, options)
  const scrollDownTrigger = document.querySelector(config.trigger)
  const scrollElement =
    window.document.scrollingElement ||
    window.document.body ||
    window.document.documentElement

  try {
    scrollDownTrigger.addEventListener('click', function () {
      const targetRect = app.domRect(config.target)
      anime({
        targets: scrollElement,
        scrollTop: targetRect.offsetTop,
        duration: 400,
        easing: 'easeInOutSine'
      })
    })
  } catch (error) {
    console.error(error.message)
  }
}
