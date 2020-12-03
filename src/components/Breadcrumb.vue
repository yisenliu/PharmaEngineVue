<template>
  <div
    class="breadcrumb"
    aria-label="breadcrumb">
    <ul class="breadcrumb__tree">
      <template v-for="(node, index) in breadcrumbs">
        <li
          v-if="node.href !== null"
          :key="index"
          class="breadcrumb__node">
          <a
            ref="ahref"
            :href="node.href">{{ node.text }}</a>
        </li>
        <li
          v-else
          :key="index"
          class="breadcrumb__node active"
          aria-current="page">
          {{ node.text }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      pageName: app.pageName,
      breadcrumbs: []
    }
  },
  created() {
    // process.env.NODE_ENV == 'development' || 'production'
    // const url = DEVELOPMENT ? `../data/breadcrumbs/${this.pageName}.json` : ''
    const url = `/api/get/${this.pageName}/breadcrumbs`
    axios
      .get(url)
      .then(res => {
        this.breadcrumbs = res.data
      })
      .catch(error => {
        console.log(JSON.stringify(error))
      })
  }
}
</script>

<style lang="sass">
.breadcrumb
  width: 100%
  background-color: #f9f9f9
  padding: 15px 0
  text-transform: uppercase
  border-top: 1px solid #efefef
  border-bottom: 1px solid #efefef
  text-align: center
  a
    display: inline-block
    white-space: nowrap
    transition: color .25s ease
    color: #28282e
    font-weight: 600
    &:hover
      color: $primary
  li
    position: relative
    + li
      $separator: 12px
      padding-left: $separator
      &::before
        +size($separator)
        content: '>'
        color: $gray-400
        text-align: center
        position: absolute
        left: 0
        top: 0
        bottom: 0
        margin: auto
        display: block
        line-height: $separator
  &__tree
    @extend %list-style-none
    display: flex
    flex-flow: row nowrap
    align-items: center
    justify-content: center
    font-size: 12px
    +desktop
      width: 100%
  &__node
    &.active
      +text-overflow
      a
        pointer-events: none
        color: $gray-500
</style>
