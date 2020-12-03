<template>
  <div class="investorsNav">  
    <Scale 
      v-for="(item, index) in navs"
      :key="index"
      :item="item" />
  </div>
</template>

<script>
import axios from 'axios'
import Scale from '@/components/Scale'
export default {
  components: {
    Scale
  },
  data() {
    return {
      navs() {
        return []
      }
    }
  },
  created() {
    axios
      .get('/api/get/navigation?id=investors')
      .then(res => {
        const filterNavs = res.data.filter(item => {
          return item.name !== app.pageName
        })
        this.$set(this, 'navs', filterNavs)
      })
      .catch(error => {
        console.log(JSON.stringify(error))
      })
  }
}
</script>

<style lang="sass">
.investorsNav
  display: flex
  flex-flow: row wrap
  +mobile
    margin: 80px gutter()
  +tablet
    margin: 80px gutter()
  +desktop
    margin: 80px gutter()
  figure
    position: relative
    +mobile
      +size(span(2),145px)
      &:nth-child(even)
        margin-left: gutter()
      &:nth-child(n+3)
        margin-top: gutter()
    +tablet
      +size(span(4),300px)
      &:nth-child(even)
        margin-left: gutter()
      &:nth-child(n+3)
        margin-top: gutter()
    +desktop
      +size(span(4),300px)
      margin-left: gutter()
      &:nth-child(3n+1)
        margin-left: 0
      &:nth-child(n+4)
        margin-top: gutter()
    &::before
      +size(100%)
      content: ''
      display: block
      position: absolute
      z-index: 1
      left: 0
      top: 0
      background-color: rgba(#1b7bc8,.6)
</style>