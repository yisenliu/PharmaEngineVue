<template>
  <!-- header start -->
  <header id="header">
    <a
      class="logo"
      href="/"
      title="PharmaEngine">Home</a>
    <Navbar
      @navToggle="onNavToggle"
      @resetHeader="onResetHeader" />
    <div class="optionalMenu">
      <ul class="languages">
        <li class="languages__item">
          <a href="javascript:;">EN</a>
        </li>
        <li class="languages__item">
          中文版
        </li>
      </ul>
    </div>
    <div class="optionalMenu__toggle"></div>
    <div class="nav__toggle">
      <span class="lines"></span>
    </div>
  </header>
  <!-- header end -->
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
  components: { Navbar },
  mounted() {
    app.header = null
    const hr = app.headroom('#header', {
      offset: 100,
      classes: {
        // when element is initialised
        initial: 'header',
        // when scrolling up
        pinned: 'header__pinned',
        // when scrolling down
        unpinned: 'header__unpinned',
        // when above offset
        top: 'header__top',
        // when below offset
        notTop: 'header__not-top',
        // when at bottom of scoll area
        bottom: 'header__bottom',
        // when not at bottom of scroll area
        notBottom: 'header__not-bottom',
        // when frozen method has been called
        frozen: 'header__frozen'
      }
    })
    const handleHeaderPinState = () => {
      if (window.scrollY > 100) {
        app.header.unpin()
      }
    }
    hr.then(instance => {
      app.header = instance
    }).then(() => {
      handleHeaderPinState()
    })

    // optionalMenu
    document
      .querySelector('.optionalMenu__toggle')
      .addEventListener('click', function () {
        document.querySelector('#header').toggleClass('optionalMenu--opened')
      })
  },
  methods: {
    onNavToggle() {
      document.querySelector('#header').toggleClass('nav--opened')
    },
    onResetHeader() {
      document
        .querySelector('#header')
        .removeClass('nav--opened optionalMenu--opened')
    }
  }
}
</script>

<style lang="sass">
.header
  --linkColor: #141618
  width: 100%
  font-size: 12px
  +belowTablet
    min-height: get($header-height,belowTablet)
    position: relative
    z-index: get($layer,header)
    transition: background-color get($time,normal), margin-top get($time,normal)
    &::before
      +size(100%,get($header-height,belowTablet))
      content: ''
      display: block
      background-color: #fff
      position: absolute
      z-index: 2
      left: 0
      top: 0
  +desktop
    background-color: #fff
    padding: 0 30px
    height: get($header-height,desktop)
    display: flex
    flex-flow: row nowrap
    justify-content: flex-start
    will-change: transform
    transition: all get($time,normal) ease-in-out
    position: fixed
    z-index: get($layer,headroom)
    top: 0
    left: 0
    &[class*='__']
      position: fixed
    &__pinned
      transform: translateY(0%)
    &__unpinned
      transform: translateY(-100%)
  &--transparent#header
    --linkColor: #fff
    background-color: transparent
    +belowTablet
      &.nav--opened
        --linkColor:var(--header__not-top__linkColor,#141618)
        background-color: var(--header__not-top__bgColor,#fff)
        .logo
          background-image: var(--header__not-top__pinned__logo,url('~@/assets/images/pharmaEngine-neg-newtypo-green-type-darker.svg'))
        .languages
          --linkColor: #fff
    &.header__not-top
      +desktop
        --linkColor: var(--header__not-top__linkColor,#141618)
        background-color: var(--header__not-top__bgColor,#fff)
      &.header__pinned
        .logo
          background-image: var(--header__not-top__pinned__logo,url('~@/assets/images/pharmaEngine-neg-newtypo-green-type-darker.svg'))
    &::before
      +belowTablet
        display: none
    .logo
      background-image: var(--header__logo,url('~@/assets/images/pharmaEngine-neg-full-newtypo.svg'))
    ~ #main
      +belowTablet
        margin-top: #{get($header-height,belowTablet) * -1}
      +desktop
        padding-top: 0
  .logo
    +hide-text
    display: block
    transition: background-image get($time,normal)
    background: url('~@/assets/images/pharmaEngine-neg-newtypo-green-type-darker.svg') center center / contain no-repeat
    position: absolute
    z-index: 2
    left: 24px
    +belowTablet
      +size(116px,44px)
      top: 16px
    +desktop
      +size(184px,70px)
      margin-top: -35px
      top: 50%

.languages
  @extend %list-style-none
  +belowTablet
    display: flex
    flex-flow: row nowrap
    align-items: center
    justify-content: flex-end
    color: #fff
    height: 100%
  +desktop
    padding: 0 25px
    line-height: 1
    display: flex
    flex-flow: row nowrap
    align-items: center
    position: relative
    &::before
      content: ''
      position: absolute
      left: 0
      top: 50%
      margin-top: -0.5em
      height: 1em
      border-left: 1px dotted get($border,color,normal)
  li
    + li
      +belowTablet
        margin-left: 10px
      +desktop
        margin-left: 15px
  &__item
    font-size: 12px
    font-weight: 600
    color: var(--linkColor)
    +belowTablet
      color: #fff
    @at-root html &
      a
        opacity: 0.5
        color: var(--linkColor)

.optionalMenu
  +mobile
    padding: 0 gutter()
  +tablet
    padding: 0 gutter()
  +belowTablet
    +size(100%,get($header-height,belowTablet))
    background-color: #1b1d1f
    position: absolute
    z-index: 2
    bottom: 100%
    transition: transform get($time,normal)
    a
      color: #fff
    &--opened
      &#header
        margin-top: get($header-height,belowTablet)
      .optionalMenu__toggle
        opacity: .3
  +desktop
    display: flex
    flex-flow: row nowrap
    align-items: stretch
    justify-content: flex-end
    margin-right: -25px
    margin-left: 10px
    position: relative
  &__toggle
    &::before
      +iconFont(glyphicons-basic-498-more-vertical)
    +belowTablet
      right: 66px
      &::before
        position: absolute
        right: 8px
        display: block

.nav,
.optionalMenu
  &__toggle
    cursor: pointer
    +belowTablet
      +size(66px,get($header-height,belowTablet))
      line-height: get($header-height,belowTablet)
      font-size: 20px
      position: absolute
      top: 0
      z-index: 2
      color: var(--linkColor)
    +desktop
      display: none
</style>
