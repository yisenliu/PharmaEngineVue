<template>
  <div id="container">
    <Header />
    <main id="main">
      <slot name="default">
        Here is the main content.
      </slot>
    </main>
    <Footer />
    <GotoTop />
    <slot name="root"></slot>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GotoTop from '@/components/GotoTop'

export default {
  components: {
    Header,
    Footer,
    GotoTop
  }
}
</script>

<style lang="sass">
@import base
@import vendors/pace
@import ~animate.css/animate

#container
  // +overflow-scrolling
  // will-change: transform // 捲動時不重繪, but conflict with callToAction(fixed)
  position: relative
  z-index: 1
  width: 100%
  display: flex
  flex-direction: column
  min-height: 100vh
  opacity: 0
  +mobile
    min-width: 360px
  +tablet
    min-width: 768px

.debugMode
  &::before
    display: inline-block
    position: fixed
    z-index: 2
    right: 0
    bottom: 0
    padding: 4px
    background-color: rgba(#000,.4)
    color: #fff
    +mobile
      content: 'mobile'
    +tablet
      content: 'tablet'
    +desktop
      content: 'desktop'
  // #main
  .singlePage__context
    +mobile
      background: susy-svg-grid() no-repeat scroll content-box
    +tablet
      background: susy-svg-grid() no-repeat scroll content-box
    +desktop
      background: susy-svg-grid() no-repeat scroll content-box

#main
  position: relative
  z-index: get($layer,main)
  clear: both
  flex-grow: 1
  max-width: 100%
  background-color: #fff
  overflow: hidden
  +desktop
    padding-top: get($header-height,desktop)
</style>
