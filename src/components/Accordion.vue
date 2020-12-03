<template>
  <div class="accordion">
    <template v-for="(item, i) in items">
      <div 
        :key="'ad__label'+i" 
        class="accordion__label" 
        @click="onLabelClick">        
        {{ item.label }}
      </div>
      <div :key="'ad__body'+i" class="accordion__body">
        <div class="accordion__content">
          <slot :content="item.content">
            {{ item.content }}
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: null
    }
  },
  methods: {
    onLabelClick(event) {
      const label = event.target
      const action = label.classList.contains('active')
        ? 'slideUp'
        : 'slideDown'
      const nextSiblingBody = label.nextElementSibling

      label.classList.toggle('active')
      this.toggleNextSiblingBody(nextSiblingBody, action)
    },
    toggleNextSiblingBody(target, action) {
      if (action === 'slideUp') {
        target.slideUp(400)
      } else {
        target.slideDown(400)
      }
    }
  }
}
</script>

<style lang="sass">
.accordion
  &__label
    display: flex
    align-items: flex-start
    width: 100%
    font-size: px2rem(13)
    font-weight: 600
    line-height: px2rem(13) * 2
    color: #30373c
    position: relative
    padding: 20px 70px 20px 20px
    margin: -1px 0 0
    cursor: pointer
    overflow: hidden
    text-transform: uppercase
    border-top: 1px solid #efefef
    border-bottom: 1px solid #efefef
    &::after
      +iconFont(plus)
      font-size: px2rem(12)
      font-weight: 600
      position: absolute
      margin: auto
      display: inline-block
      width: 1rem
      height: 1rem
      top: 0
      right: get($spacer,s)
      bottom: 0
      transform-origin: center center
      animation: 
        name: transformToPlus
        duration: get($time,normal)
        iteration-count: 1 
        fill-mode: forwards
    &.active
      &::after
        +iconFont(minus)
        animation-name: transformToMinus
  &__body
    display: none
  &__content
    padding: 30px 20px

@keyframes transformToPlus
  0%
    content: iconfont-item(minus)
    transform: rotate(0deg)
  50%
    content: iconfont-item(minus)
  100%
    content: iconfont-item(plus)
    transform: rotate(-180deg) 

@keyframes transformToMinus
  0%
    content: iconfont-item(plus)
    transform: rotate(0deg)
  50%
    content: iconfont-item(plus)
  100%
    content: iconfont-item(minus)
    transform: rotate(180deg)     
</style>