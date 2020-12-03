<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="financialReport" v-bind="financialReport.subject">
        <Tabs :tabs="financialReport.tabs" :current-tab="financialReport.currentOptions.tabId">
          <template v-slot:tagInTab="{tab}">
            <label @change="onMQAChange">
              <input type="radio" name="MQA" :value="tab.id" />{{ tab.label }}
            </label>
          </template>
          <template #beforeContent>
            <div id="yearsCarousel" class="swiper-container">
              <div class="swiper-wrapper">
                <label 
                  v-for="(year,index) in financialReport.years"
                  :key="index"
                  :class="['swiper-slide',{'active': year === financialReport.currentOptions.year}]"
                  @change="onYearChange">
                  <input type="radio" name="year" :value="year" />{{ year }}
                </label>
              </div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </template>
          <template #default>
            <ul class="attachments">
              <li 
                v-for="(file,index) in financialReport.attachments"
                :key="index">
                <a :href="file.href">{{ file.text }}</a>
              </li>
            </ul>
          </template>
        </Tabs>
      </SinglePageSection>
      <SinglePageSection id="companyStockPrice" v-bind="companyStockPrice.subject">
        <CompanyStockPriceLinks :links="companyStockPrice.links" />
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
import Tabs from '@/components/Tabs'
export default {
  components: {
    Breadcrumb,
    CompanyStockPriceLinks,
    Hero,
    Layout,
    InvestorsNav,
    SinglePage,
    SinglePageSection,
    Tabs
  },
  data() {
    return {
      callback: {},
      companyStockPrice: {},
      htmlLang: '',
      docTitle: '',
      financialReport: {},
      hero: {},
      isConditionChanged: true,
      loaded: false,
      singlePage: {}
    }
  },
  mounted() {
    axios
      .get('../db/financialInfos.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#financialReport'
            })
          }
        })
        this.$set(this, 'companyStockPrice', data.companyStockPrice)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'financialReport', data.financialReport)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        const vm = this
        this.$set(this, 'singlePage', {
          enter: {
            financialReport() {
              vm.activeAttachments()
            },
            companyStockPrice() {
              const links = document.querySelectorAll('.links a')
              links.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
              document.querySelector('.singlePage__nav').addClass('light')
            }
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
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // Years swiper
        app.swiper('#yearsCarousel', {
          watchOverflow: true,
          roundLengths: true,
          spaceBetween: 0,
          freeMode: true,
          breakpoints: {
            360: {
              slidesPerView: 3
            },
            768: {
              slidesPerView: 5
            }
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        })
      })
      .catch(error => {
        console.error(error)
      })
  },
  methods: {
    activeAttachments() {
      const attachments = document.querySelectorAll('.attachments li')
      if (this.isConditionChanged) {
        attachments.forEach((el, index) => {
          el.removeClass('active')
          setTimeout(() => {
            el.addClass('active')
          }, (index + 1) * 150)
        })
      }
      this.isConditionChanged = false
    },
    getAttachments() {
      return new Promise(resolve => {
        const randomNum = Math.floor(Math.random() * 6)
        const name = [
          '財務業務資訊',
          '會計師查核報告',
          '合併營收',
          '營收報告',
          '營業利益',
          '稅前淨利'
        ]
        const data = []
        for (let i = 0; i <= randomNum; i++) {
          data.push({
            href: 'javascript:;',
            text: this.financialReport.currentOptions.year.concat(
              ' ',
              name[Math.floor(Math.random() * name.length)]
            )
          })
        }
        this.financialReport.attachments = data
        resolve()
      })
    },
    resetAttachments() {
      return new Promise(resolve => {
        const attachments = document.querySelectorAll('.attachments li')
        attachments.forEach(el => {
          el.removeClass('active')
        })
        attachments[0].addEventListener('transitionend', () => {
          resolve()
        })
      })
    },
    onMQAChange(event) {
      this.financialReport.currentOptions.tabId = event.target.value
      this.changeAttachments(this.financialReport.currentOptions)
    },
    onYearChange(event) {
      this.financialReport.currentOptions.year = event.target.value
      this.changeAttachments(this.financialReport.currentOptions)
    },
    async changeAttachments() {
      await this.resetAttachments()
      await this.getAttachments()
      this.isConditionChanged = true
      this.activeAttachments()
    }
  }
}
</script>

<style lang="sass">
$theme-color: #2196f3
:root
  --swiper-navigation-color: #{$theme-color}
  --tabs__item-bg: #efefef
  --tabs__item--active-bg: #fcfcfc
  --companyStockPrice-theme-color: #{$theme-color}

.financialInfos
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
  .singlePage__titleContainer,
  .singlePage__nav
    display: none

#companyStockPrice
  .singlePage__context
    height: 300px
    display: flex
    +mobile
      background: linear-gradient(0deg,rgba(#000,.2) 0%,rgba(#000,.2) 100%),url('~@/assets/responsiveImages/pixta_23436504_M.jpg?size=750') center center / cover no-repeat
    +tablet
      background: linear-gradient(0deg,rgba(#000,.2) 0%,rgba(#000,.2) 100%),url('~@/assets/responsiveImages/pixta_23436504_M.jpg?size=1536') center center / cover no-repeat
    +desktop
      background: linear-gradient(0deg,rgba(#000,.2) 0%,rgba(#000,.2) 100%),url('~@/assets/responsiveImages/pixta_23436504_M.jpg?size=1920') center center / cover no-repeat

#financialReport
  .singlePage__context
    padding: 0
  .tabs
    input[type="radio"]
      display: none
    &__nav
      border-bottom: none
    &__item
      min-height: 60px
      padding: 0
      &::after
        top: 0
        bottom: auto
      > label
        +size(100%)
        display: block
        line-height: 60px
        cursor: pointer
    &__content
      background-color: #fff
      border-top: 1px solid #efefef
      +mobile
        padding: 30px gutter() 80px
      +tablet
        padding: 30px gutter() 80px
      +desktop
        padding: 30px gutter() 80px

#yearsCarousel
  background-color: #fcfcfc
  .swiper-slide
    display: block
    text-align: center
    cursor: pointer
    padding: 20px 0
    &.active
      color: $theme-color
      font-weight: 600
      pointer-events: none

.attachments
  @extend %list-style-none
  display: flex
  flex-flow: row wrap
  justify-content: center
  +desktop
    max-width: 1340px
    margin: 0 auto
  .fade
    &-enter-active
      opacity: 1
      transform: translateY(0)
    &-leave-to,
    &-enter
      opacity: 0
      transform: translateY(50px)
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
      width: 33.33%
      &:nth-child(n+4)
        margin-top: 30px
    +aboveTablet
      width: 16.66%
      &:nth-child(n+7)
        margin-top: 30px
  a
    +size(80px)
    margin: 0 auto
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    line-height: 1
    background-color: #f9f9f9
    border-radius: 50%
    transition: color get($time,normal),background-color get($time,normal)
    &::before
      +iconFont(pdf)
      font-size: px2rem(22)
      color: $red-600
      margin-bottom: 5px
      transition: color get($time,normal)
    &:hover
      background-color: $theme-color
      color: #fff
      &::before
        color: #fff

</style>