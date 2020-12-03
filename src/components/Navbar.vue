<template>
  <div class="nav">
    <ul class="nav__list">
      <li
        v-for="(item, i) in navItems"
        :key="i"
        class="nav__item">
        <a
          :href="item.navLink.href"
          class="nav__link">{{ item.navLink.text }}</a>
        <div
          v-if="item.navSubItems"
          class="nav__subContainer">
          <ul :class="['nav__subList', item.subListClass]">
            <li
              v-for="(subItem, j) in item.navSubItems"
              :key="j"
              class="nav__subItem"
              :class="{ active: subItem.isActive }">
              <a :href="subItem.href">{{ subItem.text }}</a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      navItems: []
    }
  },
  mounted() {
    axios
      .get('/api/get/navigation?id=main')
      .then(res => {
        this.navItems = res.data
      })
      .then(() => {
        const vm = this
        const nav = document.querySelector('.nav')
        const navSubContainers = document.querySelectorAll('.nav__subContainer')
        const navToggle = document.querySelector('.nav__toggle')
        const navItems = document.querySelectorAll('.nav__item')

        navItems.forEach(item => {
          item.addEventListener('mouseenter', function () {
            const target = this.querySelector('.nav__subContainer')
            if (app.isDesktop() && target) {
              anime({
                targets: target,
                opacity: [0, 1],
                duration: 200,
                easing: 'linear',
                begin() {
                  target.style.display = 'block'
                }
              })
            }
          })
          item.addEventListener('mouseleave', function () {
            const target = this.querySelector('.nav__subContainer')
            if (app.isDesktop() && target) {
              anime({
                targets: target,
                opacity: [1, 0],
                duration: 200,
                easing: 'linear',
                complete() {
                  target.removeAttribute('style')
                }
              })
            }
          })
        })
        navToggle.addEventListener('click', function () {
          nav.slideToggle(200)
          vm.$emit('navToggle')
        })

        // only for tablet and mobile devices
        navSubContainers.forEach(navSubContainer => {
          navSubContainer.addEventListener('click', function () {
            if (!app.isDesktop()) {
              this.querySelector('.nav__subList').slideToggle()
              navSubContainers.forEach(item => {
                if (item !== this) {
                  item.querySelector('.nav__subList').slideUp()
                }
              })
            }
          })
        })

        let winWidth = window.innerWidth
        app.addToWindowOnResize(() => {
          // fix address bar of mobile chrome triggers resize event on scrolling
          if (window.innerWidth !== winWidth) {
            vm.$emit('resetHeader')
            nav.removeAttribute('style')
            navSubContainers.forEach(navSubContainer => {
              navSubContainer.firstElementChild.removeAttribute('style')
            })
            winWidth = window.innerWidth
          }
        })
      })
      .catch(error => {
        console.log(JSON.stringify(error))
      })
  }
}
</script>

<style lang="sass">
.nav
  +belowTablet
    display: none
    position: relative
    z-index: 1
    clear: both
    width: 100%
    transition: margin-top get($time,fast) ease-in-out
  +desktop
    flex-grow: 1
  &--opened
    .nav
      +belowTablet
        margin-top: get($header-height,belowTablet)
    .nav__toggle
      .lines
        background-color: transparent
        transform: translateX(-100%)
        &::before
          transform: translate(100%,0) rotate(45deg)
        &::after
          transform: translate(100%,0) rotate(-45deg)
  &__toggle
    +belowTablet
      right: 0
    &.active
      .lines
        background-color: transparent
        transform: translateX(-100%)
        &::before
          transform: translate(100%,0) rotate(45deg)
        &::after
          transform: translate(100%,0) rotate(-45deg)
    .lines
      +size(21px,3px)
      position: absolute
      top: 50%
      left: 15px
      margin-top: -2px
      display: block
      transition: all get($time,fast)
      &,
      &::before,
      &::after
        background-color: var(--linkColor,#{$gray-700})
      &::before,
      &::after
        +size(100%,3px)
        content: ''
        position: absolute
        left: 0
        display: inline-block
        transform-origin: center center
        transition: all get($time,fast)
      &::before
        transform: translateY(6px)
      &::after
        transform: translateY(-6px)
  &__list
    @extend %list-style-none
    +belowTablet
      padding: 15px 0
      background-color: #1b1d1f
    +desktop
      display: flex
      flex-flow: row nowrap
      align-items: center
      justify-content: flex-end
  &__item
    display: inline-block
    position: relative
    +belowTablet
      display: block
    &:hover
      .nav__link
          +desktop
          &::after
            width: 100%
  a.nav__link
    display: block
    font-size: 12px
    font-weight: 600
    position: relative
    z-index: 1
    +belowTablet
      padding: 15px 48px 15px 30px
      width: 100%
      color: #fff
    +desktop
      margin: 0 15px
      line-height: get($header-height,desktop)
      color: var(--linkColor)
      &::after
        content: ''
        +size(0)
        display: block
        position: absolute
        top: calc(50% + 1em)
        left: 0
        border-bottom: 1px dotted get($border,color,normal)
        transition: width get($time, normal) ease-in-out
  &__subContainer
    +belowTablet
      position: relative
      z-index: 2
      &::before
        +size(100%, 48px)
        +iconFont(arrowDown)
        text-indent: calc(100% - 48px)
        line-height: 48px
        position: absolute
        z-index: 1
        right: 0
        bottom: 100%
        color: #fff
    +desktop
      position: absolute
      z-index: 1
      top: 100%
      left: -5px
      width: 240px
      display: none
  &__subList
    @extend %list-style-none
    width: 100%
    background-color: #f9f9f9
    border-top: 3px solid var(--nav-subList-theme-color,#{$primary})
    +belowTablet
      display: none
    +desktop
      padding: 15px 0
    &--about
      --nav-subList-theme-color: #e49a6d
    &--investors
      --nav-subList-theme-color: #64b5f6
  &__subItem
    color: #212121
    +belowTablet
      + li
        border-top: 1px solid #efefef
    +desktop
      display: block
      position: relative
      width: 100%
      padding: 0 25px
      display: block
    &.active
      color: var(--nav-subList-theme-color,#{$primary})
    @at-root html &
      a
        display: block
        color: currentColor
        +belowTablet
          padding: 15px 30px
        +desktop
          padding: 8px 0
          &:hover
            color: var(--nav-subList-theme-color,#{$primary})
</style>
