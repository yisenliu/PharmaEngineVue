<template>
  <div :class="['form__group', { 'form__group--error': valid === false }]">
    <label
      class="form__label"
      :for="id">{{ label }}</label>
    <div class="form__data">
      <textarea
        :id="id ? id : false"
        :value="value"
        class="form__control"
        :placeholder="placeholder ? placeholder : false"
        :name="name ? name : false"
        @input="onInput"></textarea>
      <transition
        enter-active-class="animate__animated animate__fast animate__fadeInDown"
        leave-active-class="animate__animated animate__fast animate__fadeOutUp">
        <p
          v-if="valid === false"
          class="form__invalidFeedback">
          {{ invalidMsg }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    value: {
      type: [String, Number],
      default: null
    },
    invalidMsg: {
      type: String,
      default: null
    },
    valid: {
      type: Boolean,
      default: null
    }
  },
  methods: {
    onInput(event) {
      const value = event.target.value.replace(/ +/g, ' ')
      this.$emit('input', value)
    }
  }
}
</script>

