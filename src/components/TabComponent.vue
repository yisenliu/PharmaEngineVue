<template>
  <ul class="attachments">
    <li v-for="(attachment, index) in attachments" :key="index">
      <a :href="attachment.href">{{ attachment.text }}</a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    attachments: {
      type: Array,
      default: null
    }
  },
  mounted() {
    anime({
      targets: '.attachments li',
      opacity: [0, 1],
      translateY: ['-100%', '0'],
      duration: 400,
      delay: anime.stagger(100),
      easing: 'easeInOutSine'
    })
  }
}
</script>

<style>

</style>