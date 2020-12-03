<template>
  <div :class="['hero', {'theme--light': theme==='light'}]">
    <h1 class="hero__title">
      {{ title }}
      <small v-if="subtitle">{{ subtitle }}</small>
    </h1>
    <img
      class="hero__img"
      :srcset="image"
      sizes="100vw"
      alt="" />
    <div
      id="heroScrollDown"
      class="scrollDown"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: ''
    },
    callback: {
      type: Function,
      default: null
    }
  },
  updated() {
    if (Object.prototype.toString.call(this.callback) === '[object Function]') {
      this.callback()
    }
  }
}
</script>

<style lang="sass">
.hero
  width: 100%
  position: relative
  height: 400px
  +desktop
    height: 30vw
  &__img
    +size(100%)
    // width: 100%
    object-fit: cover
    object-position: center center
    // +belowTablet
    //   height: 400px
    // +desktop
    //   height: 30vw
  &__title
    font-weight: 600
    line-height: 1.5
    letter-spacing: -.03em
    color: #fff
    display: inline-block
    margin: 0
    position: absolute
    z-index: 2
    right: 30px
    bottom: 20px
    +belowTablet
      font-size: px2rem(24)
      bottom: 50px
    +desktop
      font-size: px2rem(32)

.scrollDown
    +size(20px)
    cursor: pointer
    position: absolute
    z-index: 2
    left: 50%
    bottom: 20px
    margin-left: -0.5rem
    animation: bounceArrow get($time,normal) ease alternate infinite
    &::before
      +iconFont(arrowDown2)
      display: block
      font-size: 20px
      color: var(--scrollDown-color,#fff)
      transition: color get($time,normal)
      text-align: center

@keyframes bounceArrow
  to
    transform: translateY(-50%)
</style>
