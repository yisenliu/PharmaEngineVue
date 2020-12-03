<template>
  <footer id="footer">
    <div class="copyright">&copy; 2018 PharmaEngine Inc.</div>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="sass">
#footer
  position: relative
  z-index: get($layer,footer)
  width: 100%
  clear: both
  overflow: hidden
  background: var(--footer-bg,#f9f9f9)
  border-top: 1px solid #efefef
  padding: 80px 0
  font-size: 12px
  text-align: center
  .copyright
    padding: 20px 0
</style>
