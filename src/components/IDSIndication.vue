<template>
  <div class="IDS__indication">
    <div class="IDS__indication__name" v-html="name"></div>
    <div class="IDS__indication__currentStage" :data-stages="currentStage">
      {{ stageName }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: null
    },
    currentStage: {
      type: [String, Number],
      default: null
    },
    stageName: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="sass">
.IDS
  &__indications
    margin: 0 auto
    overflow: hidden
    +mobile
      padding: 0 gutter()
    +tablet
      padding: 0 gutter()
    +desktop
      padding: 0 gutter()
      max-width: 1340px
    &__pdtName
      text-align: center
      font-size: px2rem(16)
      margin: 50px 0 0
      small
        display: block
        font-size: px2rem(12)
        color: #556270
        margin-top: 10px  
  &__indication
    box-shadow: inset 0 -4px 0 0 #efefef
    position: relative
    font-weight: 600
    font-size: px2rem(13)
    color: #141618
    padding-top: 30px
    &::after
      width: 0
      height: 4px
      content: ''
      display: block
      position: absolute
      left: 0
      bottom: 0
      background-color: var(--indications-theme-color,#9fe14e)
      transition: width get($time,slow) ease-out
    &.active
      &::after
        width: var(--progressBar-width)
      .IDS__indication__currentStage
        opacity: 1
        left: var(--offsetLeft)
    &__currentStage
      line-height: 1.2
      background-color: #fff
      border: 1px solid #efefef
      position: absolute
      z-index: 1
      left: 0
      opacity: 0
      text-align: center
      transition: get($time,slow) ease-out
      transition-property: left, opacity
      +mobile
        +hide-text
        top: 100%
        padding: 2px 5px
        &::before
          content: '進行中'
          font: px2rem(13) / 1.2 get($font-family,custom-family)
          font-weight: 600
        &[data-stages="5"]
          font: px2rem(13) / 1.2 get($font-family,custom-family)
          font-weight: 600
          &::before
            display: none
      +aboveTablet
        padding: 8px 10px
        bottom: 4px
    &__comment
      margin-top: 30px
      font-size: px2rem(13)
    &__name
      padding-bottom: 10px

</style>