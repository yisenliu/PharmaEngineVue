<template>
  <section class="singlePage__section" :data-nav-text="navText">
    <slot name="preTitle"></slot>
    <div v-if="title" class="singlePage__titleContainer">
      <h2 class="singlePage__title">
        {{ title }}
      </h2>
    </div>
    <slot name="surffixTitle"></slot>
    <div class="singlePage__context">
      <slot name="default"></slot>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    navText: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    callback: {
      type: Function,
      default: null
    }
  },
  mounted() {
    if (Object.prototype.toString.call(this.callback) === '[object Function]') {
      this.callback()
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
  &__section
    + .singlePage__section
      border-top: 1px solid #efefef
  &__context
    background-color: #f7f7f7
    position: relative
    padding-top: 80px
    padding-bottom: 80px
    +mobile
      padding-left: gutter()
      padding-right: gutter()
    +tablet
      padding-left: gutter()
      padding-right: gutter()
    +desktop
      padding-left: gutter()
      padding-right: gutter()
  &__titleContainer
    background-color: #fff
    padding: 75px 0
    +mobile
      padding: 75px gutter()
    +tablet
      padding: 75px gutter()
    +desktop
      padding: 75px gutter()
  &__title
    text-align: center
    font-size: px2rem(19)
    position: relative
    border-bottom: 1px solid #efefef
    max-width: 1340px
    margin: 0 auto
    &::after
      +size(2em,1em)
      margin: 20px auto 0
      background-color: #fff
      font-size: px2rem(24)
      display: block
      color: var(--singlePage-icon-color, #{$primary})
      transform: translateY(50%)
</style>
