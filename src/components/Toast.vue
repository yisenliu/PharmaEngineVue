<template>
  <div 
    v-if="localShow"
    :id="id"
    :class="['toast',status]"
    role="alert">
    <div class="toast__body" v-html="message">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true,
      default: null
    },
    status: {
      type: String,
      default: 'success'
    }
  },
  data() {
    return {
      id: `toast-${Math.floor(Math.random() * 1000000).toString()}`,
      localShow: this.show
    }
  },
  mounted() {
    const vm = this
    const toast = document.getElementById(this.id)
    const tl = anime.timeline({
      targets: toast,
      duration: 400,
      easing: 'easeInQuart'
    })

    this.localShow = true
    document.activeElement.blur()
    tl.add({
      opacity: 1,
      begin() {
        toast.style.display = 'flex'
        vm.$emit('start')
      },
      complete() {
        console.log('toast appear')
        vm.$emit('appear', tl)
      }
    }).add({
      delay: 1500,
      opacity: 0,
      complete: () => {
        console.log('toast disappear')
        this.localShow = false
        vm.$emit('disappear')
      }
    })
  }
}
</script>

<style lang="sass">
.toast
  +size(100%)
  position: fixed
  z-index: get($layer,toast)
  left: 0
  top: 0
  display: flex
  align-items: center
  justify-content: center
  opacity: 0
  background-color: rgba(#000,.5)
  &.error
    .toast__body
      &::before
        +iconFont(basic1-173_close_remove_exit)
        color: $danger
  &.info
    .toast__body
      &::before
        +iconFont(basic2-087_info)
        color: $info
  &.success
    .toast__body
      &::before
        +iconFont(basic1-174_ok_success_check)
        color: $success
  &.warning
    .toast__body
      &::before
        +iconFont(basic1-121_alert_attention)
        color: $warning
  &.pending
    .toast__body
      &::before
        +iconFont(basic2-090_loader_loading)
        color: $gray-500
        animation: rotatePendingIcon get($time,slow)*2 linear infinite
        transform-origin: center center
  &__body
    text-align: center
    background-color: #fff
    box-shadow: get($box-shadow,default)
    padding: 50px 30px
    &::before
      display: block
      width: 100%
      text-align: center
      margin-bottom: 15px
      font-size: px2rem(48)
    +mobile
      width: span(3)
    +tablet
      min-width: span(4)
      max-width: span(5)
    +desktop
      min-width: span(4)
      max-width: span(5)

@keyframes rotatePendingIcon
  to
    transform: rotate(360deg)
      
</style>