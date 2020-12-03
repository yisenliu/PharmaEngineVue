<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="foreword" v-bind="foreword.subject">
        <p>{{ foreword.context }}</p>
      </SinglePageSection>
      <SinglePageSection id="whistleblowerProcedure" v-bind="whistleblowerProcedure.subject">
        <ul class="procedure">
          <li v-for="(step,index) in whistleblowerProcedure.procedure" :key="index">
            {{ step.content }}
            <template v-if="step.subItems">
              <ol>
                <li v-for="item in step.subItems" :key="item">
                  {{ item }}
                </li>
              </ol>
            </template>
          </li>
        </ul>
      </SinglePageSection>
      <SinglePageSection id="whistleblowingWindowMethod" v-bind="whistleblowingWindowMethod.subject">
        <div class="contactWindow">
          <div 
            v-for="(contact,index) in whistleblowingWindowMethod.contactWindow"
            :key="index"
            class="visitCard">
            <h3 class="visitCard__name">
              {{ contact.name }}
            </h3>
            <small class="visitCard__title">{{ contact.title }}</small>
            <ul class="visitCard__details">
              <li class="visitCard__details__phone">
                <a :href="contact.phone | tel">{{ contact.phone }}</a>
              </li>
              <li class="visitCard__details__email">
                <a :href="contact.email | mailto">{{ contact.email }}</a>
              </li>
            </ul>
          </div>
          <div class="download">
            <a :href="whistleblowingWindowMethod.download.href">{{ whistleblowingWindowMethod.download.text }}</a>
          </div>
        </div>
      </SinglePageSection>
    </SinglePage>
    <InvestorsNav />
  </Layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'

import Breadcrumb from '@/components/Breadcrumb'
import Hero from '@/components/Hero'
import InvestorsNav from '@/components/InvestorsNav'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
export default {
  components: {
    Breadcrumb,
    Hero,
    InvestorsNav,
    Layout,
    SinglePage,
    SinglePageSection
  },
  filters: {
    tel(value) {
      const newPhone = value
        .replace(' ', '')
        .replace('(', '')
        .replace(')', '-')
        .replace('#', 'p')
      return 'tel:' + newPhone
    },
    mailto(value) {
      return 'mailto:' + value
    }
  },
  data() {
    return {
      callback: {},
      htmlLang: '',
      docTitle: '',
      foreword: {},
      hero: {},
      loaded: false,
      singlePage: {},
      whistleblowerProcedure: {},
      whistleblowingWindowMethod: {}
    }
  },
  mounted() {
    axios
      .get('../db/whistleblowerSystem.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#foreword'
            })
          }
        })
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'foreword', data.foreword)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'whistleblowerProcedure', data.whistleblowerProcedure)
        this.$set(
          this,
          'whistleblowingWindowMethod',
          data.whistleblowingWindowMethod
        )
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            whistleblowerProcedure() {
              const steps = document.querySelectorAll('.procedure > li')
              steps.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            },
            whistleblowingWindowMethod() {
              const cards = document.querySelectorAll('.contactWindow > div')
              cards.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            }
          }
        })
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
        document.querySelector('#header').addClass('header--transparent')

        // Pace done
        app.paceDone = () => {
          waypointsPromise.then(() => {
            this.$refs.sp.deploy()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()
      })
      .catch(error => {
        console.error(error)
      })
  }
}
</script>

<style lang="sass">
$theme-color: #2196f3

:root
  --dot-borderColor: #{$theme-color}
  --singlePage-icon-color: #{$theme-color}
  --companyStockPrice-theme-color: #{$theme-color}

.whistleblowerSystem
  .hero
    &::before
      +size(100%)  
      content: ''
      display: block
      position: absolute
      left: 0
      top: 0
      z-index: 1
      background-color: rgba(#1b7bc8,.6)
  .singlePage__nav
    li
      &:first-child
        display: none

.contactWindow
  display: flex
  flex-flow: row wrap
  +mobile
    width: 100%
    flex-direction: column
  +tablet
    justify-content: space-between
  +desktop
    max-width: 1340px
    margin: 0 auto
    justify-content: space-between
  > div
    +mobile
      width: 100%
      &:last-child
        +size(100%,180px)
        margin-top: gutter()
      + div
        margin-top: 30px
    +tablet
      width: span(4)
      &:last-child
        +size(100%,180px)
        margin-top: gutter()
    +desktop
      width: span(4)

.download
  opacity: 0
  transform: translateY(50%)
  transition: all get($time,normal) ease-out
  &.active
    opacity: 1
    transform: translateY(0)
  a
    +size(100%)
    background-image: linear-gradient(0deg,rgba(32,24,27,0.4) 0%, rgba(32,24,27,0.4) 100%)
    display: flex
    flex-flow: row nowrap
    align-items: center
    justify-content: center
    font-weight: 600
    line-height: get($line-height,s)
    color: #fff
    &::before
      +size(54px)
      +iconFont(pdf)
      background-color: #fff
      border-radius: 50%
      font-size: px2rem(26)
      color: $red-600
      text-align: center
      line-height: 54px
      margin-right: 10px
      flex: 0 0 auto
      position: relative
      z-index: 1
    &::after
      +size(100%)
      content: ''
      display: block
      position: absolute
      z-index: -1
      left: 0
      top: 0
      background: url('~@/assets/responsiveImages/pixta_21794089_M.jpg?size=1416') center center / 100% no-repeat
      transition: background-size get($time,normal) ease-out
    &:hover
      &::after
        background-size: 110%

.procedure
  @extend %list-style-none
  counter-reset: step
  +desktop
    width: span(10)
    margin: 0 auto
  > li
    padding: 20px
    background-color: #fff
    position: relative
    opacity: 0
    transform: translateY(-60px)
    transition: all get($time,normal) ease-out
    &.active
      opacity: 1
      transform: translateY(0)
      &::after
        transform: translate(-50%,15px)
    &::before
      content: '0'counter(step)'.'
      counter-increment: step
      font-size: px2rem(48)
      color: #64b5f6
      font-family: 'Playfair Display', serif
      font-style: italic
      line-height: 1
      letter-spacing: -1px
    &::after
      +iconFont(arrow-bold-down)
      font-size: px2rem(30)
      color: #b0bec5
      line-height: 1
      position: absolute
      z-index: -1
      left: 50%
      top: 100%
      transform: translate(-50%,-60px)
      transition: transform get($time,slow) ease-out
    &:last-child
      &::after
        display: none
    + li
      margin-top: 60px
  ol
    margin: 20px 0 0

.visitCard
  background-color: #fff
  padding: 30px 20px 20px
  opacity: 0
  transform: translateY(50%)
  transition: all get($time,normal) ease-out
  &.active
    opacity: 1
    transform: translateY(0)
  &__name
    margin: 0
    text-align: center
    color: #556270
    +belowTablet
      font-size: px2rem(18)
    +desktop
      font-size: px2rem(24)
  &__title
    display: block
    text-align: center
    font-size: px2rem(16)
    color: $gray-500
    margin-top: 10px
  &__details
    @extend %list-style-none
    border-top: 1px solid #efefef
    padding-top: 10px
    margin-top: 10px
    li
      display: flex
      align-items: flex-start
      &::before
        margin-right: 5px
      + li
        margin-top: 5px
    &__IcoMoon-067-phone
      &::before
        +iconFont(basic1-036_phone_call)
    &__email
      &::before
        +iconFont(basic1-005_email_delivery_send)

.whistleblowerSystem
  .singlePage__context
    > *
      margin: 0 auto
      +desktop
        max-width: 1340px

#foreword
  .singlePage__titleContainer
    display: none
  .singlePage__context
    background-color: #fff
  p
    +desktop
      width: span(10)
      margin: 0 auto

#whistleblowerProcedure
  .singlePage__title
    &::after
      +iconFont(IcoMoon-186-list-numbered)
      
#whistleblowingWindowMethod
  .singlePage__title
    &::after
      +iconFont(IconMoon-119-user-tie)
</style>