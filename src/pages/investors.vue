<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="introduction" v-bind="introduction.subject">
        <h2>{{ introduction.context.heading }}</h2>
        <p 
          v-for="(segment,index) in introduction.context.paragraphy"
          :key="index"
          v-html="segment"></p>
      </SinglePageSection>
      <SinglePageSection id="latestEvents" v-bind="latestEvents.subject">
        <div class="events">
          <div 
            v-for="(event,index) in latestEvents.events"
            :key="index"
            class="event">
            <a :href="event.href">
              <img 
                class="lazyload"
                :data-srcset="event.image"
                data-sizes="auto"
                alt="" />
              <h3>{{ event.heading }}</h3>
              <time>{{ event.date }}</time>
              <address>{{ event.address }}</address>
            </a>
          </div>
        </div>
        <a :href="latestEvents.viewAll.href" class="viewAll">{{ latestEvents.viewAll.text }}</a>
      </SinglePageSection>
      <SinglePageSection id="latestNews" v-bind="latestNews.subject">
        <div class="newsList">
          <div 
            v-for="(news,index) in latestNews.newsList"
            :key="index"
            class="news">
            <a :href="news.href">
              <time>{{ news.date }}</time>
              {{ news.context }}
              <img 
                class="lazyload"
                :data-srcset="news.image"
                :sizes="`${mobile} 0px,100px`"
                alt="" />
            </a>
          </div>
        </div>
        <a :href="latestNews.viewAll.href" class="viewAll">{{ latestNews.viewAll.text }}</a>
      </SinglePageSection>
      <SinglePageSection id="latestFinancialInformation" v-bind="latestFinancialInformation.subject">
        <ul class="attachments">
          <li 
            v-for="(file,index) in latestFinancialInformation.attachments"
            :key="index">
            <a :href="file.href">{{ file.text }}</a>
          </li>
        </ul>
        <a :href="latestFinancialInformation.viewAll.href" class="viewAll">{{ latestFinancialInformation.viewAll.text }}</a>
      </SinglePageSection>
      <SinglePageSection id="companyStockPrice" v-bind="companyStockPrice.subject">
        <CompanyStockPriceLinks :links="companyStockPrice.links" />
      </SinglePageSection>
      <SinglePageSection id="dividendDistributionHistory" v-bind="dividendDistributionHistory.subject">
        <div 
          v-for="(item,index) in dividendDistributionHistory.annualDividends" 
          :key="index"
          class="annualDividend">
          <div class="annualDividend__time">
            <h3 class="annualDividend__year">
              {{ item.year }}
            </h3>
            <div class="annualDividend__date">
              <span>{{ item.paymentDate.name }}</span>
              <time>{{ item.paymentDate.time }}</time>
              <span>{{ item.exDividendDate.name }}</span>
              <time>{{ item.exDividendDate.time }}</time>
            </div>
          </div>
          <div class="annualDividend__cash">
            {{ item.cash.name }}
            <span>{{ item.cash.dividend }}</span>
          </div>
          <div class="annualDividend__stock">
            {{ item.stock.name }}
            <span>{{ item.stock.dividend }}</span>
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
import CompanyStockPriceLinks from '@/components/CompanyStockPriceLinks'
import Hero from '@/components/Hero'
import Layout from '@/components/Layout'
import InvestorsNav from '@/components/InvestorsNav'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
export default {
  components: {
    Breadcrumb,
    CompanyStockPriceLinks,
    Hero,
    InvestorsNav,
    Layout,
    SinglePage,
    SinglePageSection
  },
  data() {
    return {
      callback: {},
      companyStockPrice: {},
      dividendDistributionHistory: {},
      htmlLang: '',
      docTitle: '',
      hero: {},
      introduction: {},
      latestEvents: {},
      latestFinancialInformation: {},
      latestNews: {},
      loaded: false,
      mobile: MOBILE,
      singlePage: {}
    }
  },
  mounted() {
    axios
      .get('../db/investors.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#introduction'
            })
          }
        })
        this.$set(this, 'companyStockPrice', data.companyStockPrice)
        this.$set(
          this,
          'dividendDistributionHistory',
          data.dividendDistributionHistory
        )
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'introduction', data.introduction)
        this.$set(this, 'latestEvents', data.latestEvents)
        this.$set(
          this,
          'latestFinancialInformation',
          data.latestFinancialInformation
        )
        this.$set(this, 'latestNews', data.latestNews)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            introduction() {},
            latestEvents() {
              const events = document.querySelectorAll('.event')
              events.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            },
            latestNews() {
              const news = document.querySelectorAll('.news')
              news.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            },
            latestFinancialInformation() {
              const attachments = document.querySelectorAll('.attachments li')
              attachments.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            },
            companyStockPrice() {
              const links = document.querySelectorAll('.links a')
              links.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
              document.querySelector('.singlePage__nav').addClass('light')
            },
            dividendDistributionHistory() {}
          },
          exit: sectionElement => {
            if (sectionElement.id !== 'companyStockPrice') {
              document.querySelector('.singlePage__nav').removeClass('light')
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
            deployAnnualDividend()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // annual dividend
        const deployAnnualDividend = () => {
          const numbers = document.querySelectorAll(
            '.annualDividend__cash span,.annualDividend__stock span'
          )
          numbers.forEach(el => {
            new Waypoint.Inview({
              element: el,
              group: 'dividend',
              enter() {
                if (el.dataset.anime !== 'done') {
                  let numObj = { num: 0 }
                  anime({
                    targets: numObj,
                    num: parseFloat(el.textContent) * 1000,
                    easing: 'linear',
                    round: 1,
                    update() {
                      el.textContent = (numObj.num / 1000).toFixed(3)
                    },
                    complete() {
                      el.dataset.anime = 'done'
                    }
                  })
                }
              }
            })
          })
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error))
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

.investors
  .hero
    +desktop
      height: 50vw
    &::before
      +size(100%)  
      content: ''
      display: block
      position: absolute
      left: 0
      top: 0
      z-index: 1
      background-color: rgba(#1b7bc8,.6)
    &__title
      line-height: get($line-height,s)
      letter-spacing: 0
      right: auto
      bottom: auto
      margin: 0
      position: absolute
      z-index: 1
      left: 50%
      top: 50%
      transform: translate(-50%,-50%)
      color: #fff
      font-weight: 400
      +mobile
        padding: 0 gutter()
        width: 100%
        font-size: px2rem(24)
      +tablet
        width: span(6)
        font-size: px2rem(32)
      +desktop
        width: span(9)
        font-size: 3vw
      small
        font-size: px2rem(12)
        display: block
        margin-top: 20px
        +desktop
          font-size: px2rem(16)

#introduction
  h2
    text-align: center
    font-size: px2rem(18)
    margin-bottom: 30px
  a
    font-weight: 600
  p
    padding: 0
    margin-bottom: 30px
  .singlePage__context
    +desktop
      padding-left: span(1 wide)
      padding-right: span(1 wide)

#latestEvents
  .singlePage__title
    &::after
      +iconFont(basic2-092_map_directory)

#latestNews
  .singlePage__title
    &::after
      +iconFont(basic1-003_newspaper_news)

#latestFinancialInformation
  .singlePage__title
    &::after
      +iconFont(basic2-236_graph_pie_chart)

#companyStockPrice
  .singlePage__titleContainer
    display: none
  .singlePage__context
    height: 300px
    display: flex
    +mobile
      background: linear-gradient(0deg,rgba(#000,.2) 0%,rgba(#000,.2) 100%),url('~@/assets/responsiveImages/pixta_23436504_M.jpg?size=750') center center / cover no-repeat
    +tablet
      background: linear-gradient(0deg,rgba(#000,.2) 0%,rgba(#000,.2) 100%),url('~@/assets/responsiveImages/pixta_23436504_M.jpg?size=1536') center center / cover no-repeat
    +desktop
      background: linear-gradient(0deg,rgba(#000,.2) 0%,rgba(#000,.2) 100%),url('~@/assets/responsiveImages/pixta_23436504_M.jpg?size=1920') center center / cover no-repeat

#dividendDistributionHistory
  .singlePage__title
    &::after
      +iconFont(f073)
  .singlePage__context
    padding: 0
    > div
      padding: 50px 0
      +desktop
        padding-left: calc((100vw - 1000px)/2)
        padding-right: calc((100vw - 1000px)/2)
      &:nth-child(1)
        background-color: #0091ea
      &:nth-child(2)
        background-color: #239eeb
      &:nth-child(3)
        background-color: #46aceb

.annualDividend
  color: #fff
  +mobile
    display: grid
    grid-template:
      columns: 1fr 1fr
      rows: auto
      areas: 'time time' 'cash stock'
  +aboveTablet
    display: flex
    flex-flow: row nowrap
    justify-content: space-around
    align-items: flex-end
    > *
      flex: 0 0 auto
      min-width: 150px
  &__time
    text-align: center
    +mobile
      grid-area: time
    +tablet
      width: span(2 wider)
    +desktop
      width: span(3 narrow)
  &__year
    display: block
    position: relative
    color: currentColor
    font-size: px2rem(18)
    padding-bottom: 39px
    margin: 0 0 15px 0
    background: sprite(basic1-013_time_clock) center bottom / 24px 24px no-repeat
    &::before,
    &::after
      content: ''
      height: 0
      display: block
      border-bottom: 1px solid rgba(#fff,.5)
      position: absolute
      z-index: 1
      bottom: 15px
      +mobile
        width: span(1 wide)
      +tablet
        width: 26%
      +desktop
        width: 30%
    &::before
      right: calc(50% + 30px)
    &::after
      left: calc(50% + 30px)
  &__date
    margin: 15px 0 0
    padding: 0
    display: grid
    grid-template:
      rows: auto
      columns: 1fr 1fr
      areas: 'type1 time1' 'type2 time2'
    grid-gap: 10px 20px
    align-items: flex-start
    line-height: 1
    span
      font-size: px2rem(13)
      text-align: right
      &:nth-of-type(1)
        grid-area: type1
      &:nth-of-type(2)
        grid-area: type2
    time
      font-size: px2rem(16)
      text-align: left
      &:nth-of-type(1)
        grid-area: time1
      &:nth-of-type(2)
        grid-area: time2
  &__cash,
  &__stock
    text-align: center
    display: flex
    flex-direction: column-reverse
    font-weight: 600
    +tablet
      width: span(2)
    span
      font-family: 'Playfair Display', serif 
      font-size: px2rem(48)
      height: 2em
  &__cash
    +mobile
      grid-area: cash
  &__stock
    +mobile
      grid-area: stock

.attachments
  @extend %list-style-none
  margin: 0 auto
  padding-bottom: 20px
  +mobile
    width: span(2)
  +aboveTablet
    display: flex
    flex-flow: row nowrap
    justify-content: space-between
  +tablet
    width: span(6)
  +desktop
    width: span(6)
  li
    line-height: 1
    opacity: 0
    transform: translateY(50px)
    transition: get($time,normal) ease-out
    transition-property: opacity,transform
    &.active
      opacity: 1
      transform: translateY(0)
    +mobile
      border-bottom: 1px solid #c6c6c6
    +tablet
      width: span(2 of 6)
    +desktop
      width: span(2 of 6)
    +aboveTablet
      text-align: center
      flex-grow: 1
      + li
        border-left: 1px solid #c6c6c6
  a
    display: inline-flex
    align-items: flex-end
    line-height: 1
    +mobile
      padding: 10px 0
    &::before
      +iconFont(pdf)
      font-size: px2rem(28)
      color: $red-600
      margin-right: 5px
      +mobile
        margin-right: 15px

.events
  +aboveTablet
    display: flex
    flex-flow: row nowrap
    justify-content: space-between
  > *
    +mobile
      + *
        margin-top: 30px
    +tablet
      width: span(4)
      &:nth-child(3)
        display: none
    +desktop
      width: span(4)

.event
  opacity: 0
  transition: opacity get($time,normal) ease-out
  &.active
    opacity: 1
  a
    +size(100%,240px)
    height: 240px
    position: relative
    padding: 30px
    display: grid
    grid-template:
      columns: 1fr
      rows: 1fr auto auto
      areas: 'title' 'time' 'address'
    grid-gap: 5px 0
    &::before
      +size(100%)
      content: ''
      background-color: rgba(#000,.6)
      transition: opacity get($time,normal) ease-out
      display: block
      position: absolute
      z-index: 1
      left: 0
      top: 0
    &:hover
      &::before
        opacity: 0
  img
    +size(100%)
    position: absolute
    z-index: 0
    left: 0
    top: 0
    object-position: center
    object-fit: cover
  h3,
  time,
  address  
    display: block
    color: #fff
    position: relative
    z-index: 1
  h3
    font-size: px2rem(18)
    justify-self: start
    margin: 0
  time,
  address
    font-size: px2rem(13)
    display: inline-flex
    justify-content: flex-start
    margin: 0
    line-height: px2rem(15)
    &::before
      +size(px2rem(15))
      font-size: px2rem(15)
      margin-right: 5px
  time
    &::before
      +iconFont(f073)
  address
    &::before
      +iconFont(basic1-017_location)

.news
  border-bottom: 1px solid #efefef
  padding-bottom: 20px
  opacity: 0
  transform: translateY(50%)
  transition: get($time,normal) ease-out
  transition-property: opacity,transform
  &.active
    opacity: 1
    transform: translateY(0)
  & + &
    margin-top: 20px
  a
    width: 100%
    display: grid
    grid-template:
      columns: 1fr auto
      rows: 1fr auto
      areas: 'time time' 'desc img'
    grid-gap: 0
  time
    grid-area: time
    display: flex
    align-items: center
    color: $gray-600
    &::before
      +iconFont(basic1-013_time_clock)
      color: $gray-500
      vertical-align: middle
      margin-right: 5px
  img
    grid-area: img
    +mobile
      display: none
    +tablet
      width: 13vw
      height: auto
      margin-left: 20px
    +desktop
      width: 100px
      height: auto
      margin-left: 20px

.viewAll
  display: inline-block
  font-weight: 600
  margin: 30px auto 0
  position: relative
  left: 50%
  transform: translateX(-50%)
  &::before
    +size(54px)
    +iconFont(basic2-284_maximize_window_external_link)
    border-radius: 50%
    background-color: #fff
    text-align: center
    line-height: 54px
    margin-right: 5px
    color: $theme-color
    display: inline-block
    vertical-align: middle
</style>