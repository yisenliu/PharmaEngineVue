<template>
  <a v-if="href" :href="href" class="btn btn--link">
    <slot :text="text">
      {{ text }}
    </slot>
  </a>
  <button v-else
          type="button"
          class="btn"
          @click="clickHandler">
    <slot :text="text">
      {{ text }}
    </slot>
  </button>
</template>
<script>
export default {
  props: {
    href: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    }
  },
  methods: {
    clickHandler(event) {
      this.$emit('click', event)
    }
  }
  // render(h) {
  //   const tagName = this.href ? 'a' : 'button'
  //   let objAttrs = this.href
  //     ? {
  //         class: {
  //           btn: true,
  //           'btn--link': true
  //         },
  //         attrs: {
  //           href: this.href
  //         }
  //       }
  //     : {
  //         class: {
  //           btn: true
  //         },
  //         attrs: {
  //           type: 'button'
  //         },
  //         on: {
  //           click: this.clickHandler
  //         }
  //       }

  //   Object.assign(objAttrs, {
  //     domProps: {
  //       innerHTML: this.text
  //     }
  //   })
  //   return h(tagName, objAttrs, this.$slots.default)
  // }
}
</script>

<style lang="sass">
.btn
  @extend %btn

html  
  a.btn--link
    user-select: none
    appearance: none
    cursor: pointer
    display: inline-flex
    justify-content: center
    align-items: center
    color: #fff
    padding: 15px
    text-align: center
    line-height: normal
    position: relative
    text-decoration: none
    @if (get($button,default,brColor) != null)
      border: 1px solid get($button,default,brColor)
    @else
      border: none
    &.disabled
      opacity: .4
      pointer-events: none

@each $btnType, $btnMap in $button
  .btn--#{$btnType}
    +button-variant(get($button,$btnType))
</style>
