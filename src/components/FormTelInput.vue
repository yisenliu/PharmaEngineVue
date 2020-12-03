<template>
  <div :class="['form__group', { 'form__group--error': valid === false }]">
    <label
      class="form__label"
      :for="id ? id : false">
      {{ label }}
    </label>
    <div class="form__data">
      <VueTelInput
        ref="phoneInput"
        v-model="telephone"
        v-bind="$attrs"
        input-classes="form__control"
        mode="international"
        :enabled-country-code="true"
        :only-countries="['US','TW','BR']"
        :input-id="id ? id : false"
        :placeholder="placeholder ? placeholder : false"
        :name="name ? name : false"
        :required="required"
        :valid-characters-only="true"
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
import { VueTelInput } from 'vue-tel-input'
export default {
  components: {
    VueTelInput
  },
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
    value: {
      type: [String, Number],
      default: ''
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
  computed: {
    telephone: {
      get() {
        return this.value
      },
      set() {}
    }
  },
  mounted() {
    this.$refs.phoneInput.onInput()
  },
  methods: {
    onInput(value, detail) {
      // console.log('onInput: ', value, detail)
      this.$emit('input', value, detail)
    }
  }
}
</script>
<style lang="sass">
html
  .vue-tel-input
    background-color: #fff
    border: none
</style>