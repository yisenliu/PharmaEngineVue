<template>
  <div class="IDS__stages__container">
    <ul class="IDS__stages">
      <li v-for="(stage,index) in stages" :key="index">
        {{ stage }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    stages: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="sass">
.IDS
  &__stages
    @extend %list-style-none
    display: grid
    grid-template:
      rows: auto
      columns: repeat(6,1fr)
    margin: 0 auto
    +mobile
      padding: 0 gutter()
    +tablet
      padding: 0 gutter()
    +desktop
      padding: 0 gutter()
      max-width: 1340px
    li
      min-height: 50px
      display: flex
      align-items: center
      justify-content: center
      font-size: px2rem(13)
      color: #000
      padding: 10px
      +mobile
        +hide-text
        &::before
          font: px2rem(13) / 1.2 get($font-family,custom-family)
        &:nth-child(1)
          &::before
            content: 'RES.'
        &:nth-child(2)
          &::before
            content: 'P.-C.'
        &:nth-child(3)
          &::before
            content: 'P I'
        &:nth-child(4)
          &::before
            content: 'P II'
        &:nth-child(5)
          &::before
            content: 'P III'
        &:nth-child(6)
          &::before
            content: 'NDA'
      + li
        border-left: 1px solid #efefef
    &__container
      position: sticky
      z-index: 10
      top: 0
      transition: top get($time,normal) ease-in-out
      border-top: 1px solid #efefef
      border-bottom: 1px solid #efefef
      background-color: #fff
      +desktop
        @at-root .header__pinned + #main &
          top: get($header-height, desktop)
</style>