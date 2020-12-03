s<template>
  <div class="tabs">
    <ul class="tabs__nav">
      <li v-for="tab in tabs"
          :key="tab.id"
          :class="['tabs__item', { active: currentTab === tab.id }]"
          @click="onTabClick(tab)">
        <slot name="tagInTab" :tab="tab">
          {{ tab.label }}
        </slot>
      </li>
    </ul>
    <slot name="beforeContent"></slot>
    <div class="tabs__content">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: null
    },
    currentTab: {
      type: String,
      default: null
    }
  },
  methods: {
    onTabClick(tab) {
      this.$emit('tab-click', tab)
    }
  }
}
</script>

<style lang="sass">
.tabs
  &__nav
    @extend %list-style-none
    display: flex
    flex-flow: row wrap
    justify-content: center
    text-align: center
    border-bottom: 1px solid #efefef
    overflow: hidden
    position: relative
    background-color: var(--tabs__nav-bg,#fff)
  &__item
    padding: 0
    margin: 0
    cursor: pointer
    position: relative
    color: #30373c
    flex: 1 0 0
    display: flex
    align-items: center
    justify-content: center
    padding: 10px 20px
    min-height: 80px
    font-size: px2rem(16px)
    line-height: get($line-height,s)
    background-color: var(--tabs__item-bg,transparent)
    transition: background-color get($time,normal)
    &::after
      +size(100%,3px)
      content: ''
      display: block
      position: absolute
      left: 0
      bottom: 0
      background-color: var(--tabs__item-active,#2196f3)
      transition: transform get($time,normal) ease-out
      transform: scaleX(0)
    + .tabs__item
      margin-left: 1px
    &.active
      pointer-events: none
      color: var(--tabs__item-active,#2196f3)
      background-color: var(--tabs__item--active-bg,transparent)
      font-weight: 600
      &::after
        transform: scaleX(1)
  &__content
    padding: 50px 20px
</style>
