<template>
  <Layout>
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="regularShareholdersMeeting" v-bind="regularShareholdersMeeting.subject">
        <div class="sessions">
          <div 
            v-for="(session,i) in regularShareholdersMeeting.sessions"
            :key="i"
            class="session">
            <div class="session__whenwhere">
              <h3>{{ session.heading }}</h3>
              <time>
                <span class="date">{{ session.date }}</span>
                <span class="time">{{ session.time }}</span>
              </time>
              <address>{{ session.address }}</address>
            </div>
            <div class="session__attachments">
              <ul v-if="session.attachments">
                <li 
                  v-for="(file,j) in session.attachments"
                  :key="j">
                  <a :href="file.href">{{ file.text }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SinglePageSection>
      <SinglePageSection id="stockAffairsContactWindow" v-bind="stockAffairsContactWindow.subject">
        <div class="contactWindow">
          <div
            v-for="(contact,index) in stockAffairsContactWindow.contactWindow"
            :key="index"
            class="visitCard">
            <h3 class="visitCard__name">
              {{ contact.name }}
            </h3>
            <small class="visitCard__title">{{ contact.title }}</small>
            <ul class="visitCard__details">
              <li v-if="contact.phone" class="visitCard__details__phone">
                <a :href="contact.phone | tel">{{ contact.phone }}</a>
              </li>
              <li v-if="contact.address" class="visitCard__details__address">
                {{ contact.address }}
              </li>
            </ul>
          </div>
        </div>
      </SinglePageSection>
    </SinglePage>
    <InvestorsNav />
  </Layout>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Layout from '@/components/Layout'
import InvestorsNav from '@/components/InvestorsNav'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
export default {
  components: {
    Breadcrumb,
    Layout,
    InvestorsNav,
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
    }
  },
  data() {
    return {
      htmlLang: '',
      docTitle: '',
      loaded: false,
      regularShareholdersMeeting: {},
      singlePage: {},
      stockAffairsContactWindow: {}
    }
  },
  mounted() {
    axios
      .get('../db/shareholdersMeeting.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(
          this,
          'regularShareholdersMeeting',
          data.regularShareholdersMeeting
        )
        this.$set(
          this,
          'stockAffairsContactWindow',
          data.stockAffairsContactWindow
        )
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            regularShareholdersMeeting() {
              const sessions = document.querySelectorAll('.session')
              sessions.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            },
            stockAffairsContactWindow() {
              const visitCards = document.querySelectorAll('.visitCard')
              visitCards.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            }
          }
        })
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle

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
$theme-color: #64b5f6

:root
  --singlePage-icon-color: #{$theme-color}
  --dot-borderColor: #{$theme-color}

#regularShareholdersMeeting
  .singlePage__title
    &::after
      +iconFont(basic2-224_mic_recording_audio)

#stockAffairsContactWindow
  .singlePage__title
    &::after
      +iconFont(IconMoon-119-user-tie)

.contactWindow
  display: flex
  +mobile
    width: 100%
    flex-direction: column
  +tablet
    justify-content: space-between
  +desktop
    justify-content: center
  > div
    +mobile
      width: 100%
      + div
        margin-top: 30px
    +tablet
      width: span(4)
    +desktop
      width: span(4)
      max-width: 400px
      + div
        margin-left: gutter()

.sessions
  display: flex
  flex-flow: row wrap
  > div
    +mobile
      width: 100%
      &:nth-child(n+1)
        margin-top: 30px
    +tablet
      width: span(4)
      &:nth-child(even)
        margin-left: gutter()
      &:nth-child(n+3)
        margin-top: 30px
    +desktop
      width: span(4)
      margin-left: gutter()
      &:nth-child(3n+1)
        margin-left: 0
      &:nth-child(n+4)
        margin-top: 30px

.session
  position: relative
  z-index: 1
  overflow: hidden
  display: flex
  flex-flow: column nowrap
  justify-content: space-between
  background-color: #fff
  opacity: 0
  transform: translateY(50%)
  transition: all get($time,normal) ease-out
  &.active
    opacity: 1
    transform: translateY(0)
  &__whenwhere
    padding: 30px 20px 0
    text-align: center
    position: relative
    z-index: 2
    h3
      font-size: px2rem(24)
      margin: 0 0 20px 0
    address,
    time span
      display: flex
      align-items: flex-start
      justify-content: center
      line-height: px2rem(20)
      &::before
        color: $gray-400
        font-size: px2rem(15)
        margin-right: 5px
    address
      margin: 0
      &::before
        +iconFont(glyphicons-basic-595-nearby-alt)
    time
      span
        margin-bottom: 10px
    .date
      &::before
        +iconFont(f073)
    .time
      &::before
        +iconFont(basic1-013_time_clock)    
  &__attachments
    position: relative
    z-index: 1
    overflow: hidden
    color: #fff
    padding: 60px 20px 20px
    background-color: #2196f3
    flex-grow: 1
    &::before,
    &::after
      +size(100%,100px)
      content: ''
      display: block
      position: absolute
      z-index: -1
      bottom: calc(100% - 60px)
      background-color: #fff
      box-shadow: inset 0 -10px 8px -8px rgba(0,0,0,.2)
    &::before
      transform-origin: right bottom
      transform: skewY(10deg)
      left: calc(-50% + 1px)
    &::after
      transform-origin: left bottom
      transform: skewY(-10deg)
      right: calc(-50% + 1px)
    ul
      margin: 0
    a
      color: #fff
      padding: 5px 0
      display: inline-block

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
      font-size: px2rem(22)
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
    &__phone
      &::before
        +iconFont(basic1-036_phone_call)
    &__address
      &::before
        +iconFont(glyphicons-basic-595-nearby-alt)
</style>