<template>
  <div class="links">
    <a 
      v-for="(link,index) in links" 
      :key="index"
      :href="link.href">
      {{ link.text }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.links
  margin: 0 auto
  +mobile
    width: auto
  +tablet
    width: span(6)
  +desktop
    width: span(6)
  +aboveTablet
    display: flex
    align-items: center
    justify-content: space-between
    flex-direction: row
  a
    display: flex
    flex-flow: row nowrap
    align-items: center
    font-weight: 600
    line-height: get($line-height,s)
    color: #fff
    opacity: 0
    transform: translateY(-50%)
    transition: get($time,normal) ease-out
    transition-property: opacity,transform
    &.active
      opacity: 1
      transform: translateY(0)
    &::before
      +size(54px)
      background-color: #fff
      border-radius: 50%
      font-size: px2rem(26)
      color: var(--companyStockPrice-theme-color,#{$primary})
      text-align: center
      line-height: 54px
      margin-right: 10px
      flex: 0 0 auto
    &:nth-child(1)
      &::before
        +iconFont(basic1-182_graph_bars_chart_rise)
    &:nth-child(2)
      &::before
        +iconFont(basic2-092_map_directory)
    +aboveTablet
      max-width: 50%
    + a
      +mobile
        margin-top: 30px
</style>