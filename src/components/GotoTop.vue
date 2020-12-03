<template>
  <a href="javascript:;" class="gotoTop">Go To Top</a>
</template>

<script>
export default {
  mounted() {
    const gotoTop = document.querySelector('.gotoTop')
    app.rootScrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement

    if (gotoTop) {
      gotoTop.addEventListener('click', function() {
        anime({
          targets: app.rootScrollElement,
          scrollTop: 0,
          duration: 800,
          easing: 'easeInOutSine'
        })
      })

      app.headroom('.gotoTop', {
        offset: window.innerHeight / 2,
        classes: {
          // when element is initialised
          initial: 'gotoTop',
          // when scrolling up
          pinned: 'gotoTop__pinned',
          // when scrolling down
          unpinned: 'gotoTop__unpinned',
          // when above offset
          top: 'gotoTop__top',
          // when below offset
          notTop: 'gotoTop__not-top',
          // when at bottom of scoll area
          bottom: 'gotoTop__bottom',
          // when not at bottom of scroll area
          notBottom: 'gotoTop__not-bottom',
          // when frozen method has been called
          frozen: 'gotoTop__frozen'
        }
      })
    }
  }
}
</script>

<style lang="sass">
.gotoTop
  +size(30px)
  +hide-text
  display: block
  position: fixed
  z-index: get($layer,gotoTop)
  right: 30px
  bottom: 30px
  transform: translateY(200%)
  transition: transform get($time,normal)
  &__not-top,
  &__unpinned
    transform: translateY(0)
  &::before
    +iconFont(arrowUp)
    +size(100%)
    display: block
    background-color: rgba(14,16,18,.55)
    border-radius: 50%
    color: #fff
    text-align: center
    line-height: 30px
    font-size: 12px
</style>
