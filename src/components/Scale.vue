<template>
  <figure class="scale">
    <video v-if="item.video" :src="item.video" preload="none" muted controls playsinline webkit-playsinline></video>
    <template v-else>
      <img :data-srcset="item.image" data-sizes="auto" class="lazyload scale__img" :alt="item.caption" />
      <figcaption>
        <a :href="item.href" class="scale__text">{{ item.caption }}</a>
      </figcaption>
    </template>
  </figure>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="sass">
.scale
  position: relative
  overflow: hidden
  &:hover
    .scale__img
      transform-origin: center center
      transform: scale(1.09)
  &__img
    +size(100%)
    position: absolute
    z-index: 0
    left: 0
    top: 0
    object-position: center center
    object-fit: cover
    transform-origin: center center
    transition: transform get($time,normal) ease-out
  &__text
    +size(100%)
    position: absolute
    z-index: 3
    left: 0
    top: 0
    display: flex
    align-items: center
    justify-content: center
    text-align: center
    font-weight: bold
    color: #fff
    opacity: 0.75
    +mobile
      font-size: px2rem(18)
    +aboveTablet
      font-size: px2rem(26)
  a.scale__text
    color: #fff
</style>
