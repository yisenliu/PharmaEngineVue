<template>
  <div :class="['form__group', { 'form__group--error': valid === false }]">
    <label
      class="form__label"
      :for="id ? id : false">
      {{ label }}
    </label>
    <div class="form__data">
      <input
        v-if="type==='file'"
        :id="id ? id : false"
        :type="type"
        v-bind="$attrs"
        :placeholder="placeholder ? placeholder : false"
        :name="name ? name : false"
        class="form__control"
        :required="required"
        @change="onChange" />
      <input
        v-else
        :id="id ? id : false"
        :type="type"
        v-bind="$attrs"
        :placeholder="placeholder ? placeholder : false"
        :name="name ? name : false"
        :value="value"
        class="form__control"
        :required="required"
        @input="onInput" />
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
    required: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: null
    },
    errorType: {
      type: Object,
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
    onChange(event) {
      this.$emit('change', event)
    },
    onInput(event) {
      const value = event.target.value.trim().replace(/ +/g, ' ')
      this.$emit('input', value)
    }
  }
}
</script>

