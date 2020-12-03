<template>
  <div class="form__group">
    <label
      class="form__label"
      :for="id ? id : false">{{ label }}</label>
    <div class="form__data">
      <select
        :id="id ? id : false"
        :value="selected"
        class="form__control"
        :name="name ? name : false"
        @input="$emit('change',$event.target.value)">
        <option
          v-for="(opt, index) in options"
          :key="index"
          :value="opt.value">
          {{ opt.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'selected',
    event: 'change'
  },
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
    options: {
      type: Array,
      default: null
    },
    selected: {
      type: [String, Number],
      default: null
    }
  }
}
</script>

