<template>
  <div class="singlePage">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    enter: {
      type: Object,
      default: null
    },
    exit: {
      type: Function,
      default: null
    }
  },
  methods: {
    deploy() {
      const singlePageSection = document.querySelectorAll(
        '.singlePage__section'
      )
      const sectionEnterHandlers = this.enter
      const sectionExitHandler = this.exit
      if (singlePageSection.length > 1) {
        const singlePageNav = document.createElement('ul')
        const enterSection = sectionElement => {
          let fn
          const sectionId = {
            ...sectionEnterHandlers,
            default: function () {}
          }

          if (!sectionElement.dataset.visited) {
            fn = sectionId[sectionElement.id]
              ? sectionId[sectionElement.id]
              : sectionId['default']
            fn()
          }
        }
        const handleNavItemState = index => {
          const navItems = document.querySelectorAll('.singlePage__nav li')
          navItems.forEach((item, i) => {
            if (i === index) {
              item.addClass('active')
            } else {
              item.removeClass('active')
            }
          })
        }

        document.querySelector('#container').appendChild(singlePageNav)
        singlePageNav.classList.add('singlePage__nav')
        singlePageSection.forEach(function (el, i) {
          const navItem = document.createElement('li')
          const navItemText = document.createElement('span')
          const point = el.dataset.pointId || el.id
          navItem.dataset.target = '#' + point
          navItemText.textContent = el.dataset.navText
          navItem.appendChild(navItemText)
          singlePageNav.appendChild(navItem)
          el.dataset.index = i

          // register click event listener immediately
          ;(i => {
            navItem.addEventListener('click', function () {
              const offsetTop = app.domRect(this.dataset.target).offsetTop

              app.header.freeze()
              anime({
                targets: app.rootScrollElement,
                duration: 600,
                scrollTop: offsetTop,
                easing: 'easeInOutExpo',
                complete() {
                  enterSection(singlePageSection[i])
                  handleNavItemState(i)
                  app.header.unfreeze()
                }
              })
            })
            new Waypoint.Inview({
              element: el,
              group: 'waypoint-nav',
              enter() {
                handleNavItemState(i)
                enterSection(el)
              },
              exited() {
                if (sectionExitHandler) {
                  sectionExitHandler(el)
                }
              }
            })
          })(i)
        })
      }
    }
  }
}
</script>

<style lang="sass">
.singlePage
  transition: transform get($time,normal) ease-in-out
  &__not-top
    transform: translateY(-51px)
    margin-bottom: -51px
  &__nav
    @extend %list-style-none
    position: fixed
    z-index: 10
    right: 0
    top: 50%
    transform: translateY(-51%)
    text-align: right
    +belowTablet
      display: none
    &.light
      --dotBgColor: rgba(255,255,255,.35)
      --dotActiveBgColor: transparent
      --dot-borderColor: #fff
      --textColor: #fff
    li
      right: 30px
      position: relative
      cursor: pointer
      padding: 1px 0
      &::after
        +size(12px)
        content: ''
        display: inline-block
        background-color: var(--dotBgColor, rgba(20,22,24,.35))
        margin-left: 5px
        border-radius: 100%
        border: 2px solid transparent
        transition: all .4s
        vertical-align: middle
        transform: scale(.6)
      &.active,
      &:hover
        &::after
          border-color: var(--dot-borderColor,#{$primary})
          background-color: var(--dotActiveBgColor,#fff)
          transform: scale(1)
      &:hover
        span
          opacity: 1
    span
      opacity: 0
      transition: opacity .4s
      color: var(--textColor,#141618)
      font-size: px2rem(11)
      font-weight: 600
</style>
