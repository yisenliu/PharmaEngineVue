<template>
  <div class="boardMember">
    <h2 class="boardMember__name">
      {{ name }}
    </h2>
    <p class="boardMember__title">
      {{ title }}
    </p>
    <p class="boardMember__desc">
      {{ desc }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  }
}
</script>