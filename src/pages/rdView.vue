<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection
        id="productBrief"
        v-bind="productBrief.subject">
        <div 
          v-for="(brief,i) in productBrief.briefs"
          :key="i"
          class="brief">
          <h2 class="brief__title">
            {{ brief.title }}
          </h2>
          <p v-for="(paragraphy,j) in brief.context" :key="j">
            {{ paragraphy }}
          </p>
        </div>
      </SinglePageSection>
      <SinglePageSection
        id="clinicalDevelopment"
        v-bind="clinicalDevelopment.subject">
        <p v-for="(paragraphy,j) in clinicalDevelopment.context" :key="j">
          {{ paragraphy }}
        </p>
      </SinglePageSection>
      <SinglePageSection
        id="clinicalTrialResults"
        v-bind="clinicalTrialResults.subject">
        <p v-for="(paragraphy,j) in clinicalTrialResults.context" :key="j">
          {{ paragraphy }}
        </p>
      </SinglePageSection>
      <SinglePageSection
        id="marketSize"
        v-bind="marketSize.subject">
        <div class="marketSize">
          <h2 class="marketSize__title">
            {{ marketSize.title }}
          </h2>
          <div class="marketSize__content">
            <p v-for="(paragraphy,index) in marketSize.context" :key="index">
              {{ paragraphy }}
            </p>
          </div>
        </div>
      </SinglePageSection>
      <SinglePageSection
        id="indicationsDevelopmentStage"
        v-bind="indicationsDevelopmentStage.subject">
        <IDSStages :stages="indicationsDevelopmentStage.stages" />
        <div 
          class="IDS__indications"
          :style="{'--indications-theme-color': indicationsDevelopmentStage.indications.themeColor}">
          <h3 class="IDS__indications__pdtName">
            {{ indicationsDevelopmentStage.indications.productName }}
            <small>{{ indicationsDevelopmentStage.indications.subtitle }}</small>
          </h3>
          <IDSIndication 
            v-for="(indication,j) in indicationsDevelopmentStage.indications.list"
            :key="j"
            v-bind="indication" />              
          <p v-if="indicationsDevelopmentStage.indications.comment" class="IDS__indication__comment">
            {{ indicationsDevelopmentStage.indications.comment }}
          </p>
        </div>
      </SinglePageSection>
      <SinglePageSection
        id="references"
        v-bind="references.subject">
        <Accordion id="refData" :items="references.refData" />
      </SinglePageSection>
      <SinglePageSection
        id="download"
        v-bind="download.subject">
        <div class="attachments__container">
          <ul class="attachments">
            <li v-for="(attachment,index) in download.attachments" :key="index">
              <a :href="attachment.href">{{ attachment.text }}</a>
            </li>
          </ul>
        </div>
        <div id="otherProducts" class="swiper-container">
          <div class="swiper-wrapper">
            <div v-for="(pdt,index) in download.otherProducts" :key="index" class="swiper-slide">
              <a :href="pdt.href">
                <img
                  class="lazyload"
                  :data-srcset="pdt.image"
                  sizes="`${mobile} 100vw,50vw`"
                  alt="" />
                <span>{{ pdt.name }}</span>
              </a>
            </div>
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </SinglePageSection>
    </SinglePage>
    <Button v-bind="goBack" class="goBack" />
  </Layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'

import Accordion from '@/components/Accordion'
import Breadcrumb from '@/components/Breadcrumb'
import Button from '@/components/Button'
import Hero from '@/components/Hero'
import IDSIndication from '@/components/IDSIndication'
import IDSStages from '@/components/IDSStages'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
import {
  deployStages,
  deployIndicationsCurrentStages,
  initStages
} from '@/assets/js/indicationsDevelopmentStage.js'

export default {
  components: {
    Accordion,
    Breadcrumb,
    Button,
    Hero,
    IDSIndication,
    IDSStages,
    Layout,
    SinglePage,
    SinglePageSection
  },
  data() {
    return {
      callback: {},
      clinicalDevelopment: {},
      clinicalTrialResults: {},
      htmlLang: '',
      docTitle: '',
      download: {},
      goBack: {},
      hero: {},
      indicationsDevelopmentStage: {},
      loaded: false,
      marketSize: {},
      mobile: MOBILE,
      productBrief: {},
      references: {},
      singlePage: {}
    }
  },
  mounted() {
    axios
      .get('../db/rdView.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#productBrief'
            })
          }
        })
        this.$set(this, 'clinicalDevelopment', data.clinicalDevelopment)
        this.$set(this, 'clinicalTrialResults', data.clinicalTrialResults)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'download', data.download)
        this.$set(this, 'goBack', data.goBack)
        this.$set(this, 'hero', data.hero)
        this.$set(
          this,
          'indicationsDevelopmentStage',
          data.indicationsDevelopmentStage
        )
        this.$set(this, 'marketSize', data.marketSize)
        this.$set(this, 'productBrief', data.productBrief)
        this.$set(this, 'references', data.references)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            clinicalDevelopment() {},
            clinicalTrialResults() {},
            download() {
              document.querySelector('.singlePage__nav').hide()
            },
            indicationsDevelopmentStage() {},
            marketSize() {
              document.querySelector('.marketSize').addClass('active')
            },
            productBrief() {},
            references() {}
          },
          exit: sectionElement => {
            if (sectionElement.id === 'download') {
              document.querySelector('.singlePage__nav').show()
            }
          }
        })
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle

        // Pace done
        app.paceDone = () => {
          initStages()
          deployStages()
          waypointsPromise.then(() => {
            this.$refs.sp.deploy()
            deployIndicationsCurrentStages()
            setAttachmentWidth()
            deployAttachmentsWaypoints()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // other products carousel
        app.swiper('#otherProducts', {
          watchOverflow: true,
          roundLengths: true,
          spaceBetween: 0,
          breakpoints: {
            360: {
              slidesPerView: 1
            },
            768: {
              slidesPerView: 2
            }
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        })

        // setting width of each attachment according to devices
        const attachments = document.querySelector('.attachments')
        const attachmentLinks = document.querySelectorAll('.attachments a')
        const setAttachmentWidth = () => {
          if (attachments) {
            attachments.removeAttribute('style')
            if (attachmentLinks.length > 1) {
              let itemIn2ColumnsWidths = {
                col1: [0],
                col2: [0],
                max: Math.floor(window.innerWidth / 2)
              }
              let itemIn3ColumnsWidths = {
                col1: [0],
                col2: [0],
                col3: [0],
                max: Math.floor(window.innerWidth / 3)
              }

              attachmentLinks.forEach((el, index) => {
                const thisWidth = el.clientWidth
                itemIn2ColumnsWidths['col' + ((index % 2) + 1)].push(
                  thisWidth < itemIn2ColumnsWidths.max
                    ? thisWidth
                    : itemIn2ColumnsWidths.max
                )
                itemIn3ColumnsWidths['col' + ((index % 3) + 1)].push(
                  thisWidth < itemIn3ColumnsWidths.max
                    ? thisWidth
                    : itemIn3ColumnsWidths.max
                )
              })
              switch (app.getDevice()) {
                case 'tablet':
                  attachments.style.cssText = `grid-template-columns: ${Math.max(
                    ...itemIn2ColumnsWidths.col1
                  )}px ${Math.max(...itemIn2ColumnsWidths.col2)}px`
                  break
                case 'desktop':
                  attachments.style.cssText = `grid-template-columns: ${Math.max(
                    ...itemIn3ColumnsWidths.col1
                  )}px ${Math.max(...itemIn3ColumnsWidths.col2)}px ${Math.max(
                    ...itemIn3ColumnsWidths.col3
                  )}px`
                  break
                default:
                  break
              }
            }
          }
        }
        app.addToWindowOnResize(setAttachmentWidth)

        // attachments waypoints
        const deployAttachmentsWaypoints = () => {
          const attachmentItems = document.querySelectorAll('.attachments li')
          attachmentItems.forEach((el, index) => {
            new Waypoint.Inview({
              element: el,
              group: 'attachmentItems',
              enter() {
                setTimeout(() => {
                  el.addClass('active')
                }, index * 100)
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

.rdView
  .hero
    +belowTablet
      height: calc(100vh - #{get($header-height,belowTablet)})
    +desktop
      height: calc(100vh - #{get($header-height,desktop)})
    &.theme--light
      small
        color: #42bd41
      .hero__title
        color: #000
        text-shadow: 2px 0 0 #fff,0 2px 0 #fff,-2px 0 0 #fff,0 -2px 0 #fff
      .scrollDown
        --scrollDown-color: #000
    &__title
      left: 50%
      bottom: auto
      font-weight: 400
      line-height: 1.2
      text-align: center
      text-shadow: 0 0 4px #000,0 0 4px #000,0 0 4px #000,0 0 4px #000
      +mobile
        width: span(3)
        font-size: 10vw
      +tablet
        width: span(6)
        font-size: 5vw
      +belowTablet
        top: 35%
        transform: translate(-50%,0)
      +desktop
        bottom: 10px
        transform: translateX(-50%)
        font-size: 4vw
    small
      display: block
      color: $primary
      font-family: 'Playfair Display', serif
      font-size: 100%
  #main
    overflow: visible
    
a.goBack
  +button-prepend-icon(glyphicons-basic-157-thumbnails)
  margin: 50px auto 80px
  position: relative
  left: 50%
  transform: translateX(-50%)

.attachments
  @extend %list-style-none
  display: grid
  grid-template-columns: 1fr
  grid-gap: 30px
  li
    opacity: 0
    transform: translateY(50%)
    transition: get($time,normal) ease-out
    transition-property: opacity,transform
    &.active
      opacity: 1
      transform: translateY(0)
  a
    display: inline-flex
    flex-flow: row nowrap
    align-items: center
    font-weight: 600
    line-height: get($line-height,s)
    color: #fff
    &::before
      +size(54px)
      +iconFont(basic2-117_open_reading_book)
      background-color: #fff
      border-radius: 50%
      font-size: px2rem(26)
      color: $primary
      text-align: center
      line-height: 54px
      flex: 0 0 auto
      margin-right: 10px
  &__container
    background: center center / cover no-repeat
    padding: 30px
    min-height: 250px
    display: flex
    justify-content: center
    align-items: center
    +mobile
      background-image: linear-gradient(0deg,rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 100%),url('~@/assets/responsiveImages/DSC09572.jpg?size=1125')
    +tablet
      background-image: linear-gradient(0deg,rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 100%),url('~@/assets/responsiveImages/DSC09572.jpg?size=1536')
    +desktop
      background-image: linear-gradient(0deg,rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 100%),url('~@/assets/responsiveImages/DSC09572.jpg?size=1920')

.brief
  +tablet
    column:
      count: 2
      gap: 30px
  +desktop
    column:
      count: 2
      gap: 30px
  + .brief
    margin-top: 50px
  p
    padding: 0
    margin-bottom: 20px
  &__title
    position: relative
    overflow: hidden
    padding-bottom: 50px
    margin: 0 0 10px
    font-size: px2rem(16)
    column-span: all
    &::before
      +size(calc(100% - 30px),0)
      content: ''
      border-bottom: 1px solid #efefef
      position: absolute
      right: 0
      bottom: 12px
    &::after
      +iconFont(glyphicons-basic-137-cogwheel)
      position: absolute
      left: 0
      bottom: 0
      font-size: px2rem(24)
      color: $primary

.marketSize
  background: center center / cover no-repeat
  text-align: center  
  color: #fff
  opacity: 0
  transform: translateY(50%)
  transition: get($time,normal) ease-out
  &.active
    opacity: 1
    transform: translateY(0)
  +mobile
    padding: 30px
    background-image: linear-gradient(0deg,rgba(#1b7bc8,.8) 0%, rgba(#1b7bc8,.8) 100%),url('~@/assets/responsiveImages/iStock-513905573.jpg?size=1125')
  +tablet
    padding: 30px
    background-image: linear-gradient(0deg,rgba(#1b7bc8,.8) 0%, rgba(#1b7bc8,.8) 100%),url('~@/assets/responsiveImages/iStock-513905573.jpg?size=1536')
  +desktop
    padding: 80px
    max-width: 1111px
    width: span(10 wider)
    margin: 0 auto
    background-image: linear-gradient(0deg,rgba(#1b7bc8,.8) 0%, rgba(#1b7bc8,.8) 100%),url('~@/assets/responsiveImages/iStock-513905573.jpg?size=1920')
  &__title
    margin: 0 0 20px 0
    font-size: px2rem(18)
    color: currentColor
    &::before
      +iconFont(basic2-237_line_chart_analytics)
      color: #64b5f6
      display: block
      margin-bottom: 30px
      font-size: px2rem(30)

#clinicalDevelopment
  .singlePage
    &__titleContainer
      display: flex
      align-items: center
      background: center center / cover no-repeat fixed
      +mobile
        min-height: 200px
        background-image: linear-gradient(166deg, rgba(#b7f430,.9) 0%, rgba(#90db5f,.9) 50%,rgba(#14967c, 0.9) 100%),url('~@/assets/responsiveImages/iStock-504483458.jpg?size=1125')
      +tablet
        min-height: 200px
        background-image: linear-gradient(166deg, rgba(#b7f430,.9) 0%, rgba(#90db5f,.9) 50%,rgba(#14967c, 0.9) 100%),url('~@/assets/responsiveImages/iStock-504483458.jpg?size=1536')
      +desktop
        min-height: 300px
        background-image: linear-gradient(166deg, rgba(#b7f430,.9) 0%, rgba(#90db5f,.9) 50%,rgba(#14967c, 0.9) 100%),url('~@/assets/responsiveImages/iStock-504483458.jpg?size=1920')
    &__title
      font-family: 'Playfair Display',serif
      color: #fff
      border: none
      +mobile
        font-size: px2rem(30)
      +tablet
        font-size: px2rem(40)
      +desktop
        font-size: px2rem(50)
    &__context
      background-color: #fff
      +desktop
        padding-left: span(3)
        padding-right: span(3)

#clinicalTrialResults
  .singlePage__title
    &::after
      +iconFont(basic3-019_presentation_keynote)

#download
  .singlePage
    &__titleContainer
      display: none
    &__context
      padding: 0

#indicationsDevelopmentStage
  .singlePage
    &__title
      &::after
        +iconFont(basic2-236_graph_pie_chart)
    &__context
      padding: 0 0 80px 0

#marketSize
  .singlePage
    // &__title
    //   &::after
    //     +iconFont(basic2-237_line_chart_analytics)
    &__context
      background-color: #fff

#otherProducts
  background-color: #000
  .swiper-slide
    height: auto
    a
      display: block
      position: relative
      height: 100%
      &::before
        +size(100%)
        content: ''
        display: block
        position: absolute
        z-index: 1
        left: 0
        top: 0
        background: linear-gradient(135deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%)
        transition: opacity get($time,normal) ease-out
      &:hover
        span,
        &::before
          opacity: 0
    span
      color: #fff
      position: absolute
      z-index: 2
      bottom: 30px
      right: 30px
      left: 30px
      display: block
      text-align: center
      color: #fff
      font-size: px2rem(20)
      font-weight: 600
      transition: opacity get($time,normal) ease-out
    img
      +size(100%)
      object-fit: cover
      object-position: center
      filter: grayscale(100%)

#productBrief
  .singlePage
    &__context
      background-color: #fff

#references
  .singlePage__title
    &::after
      +iconFont(basic1-002_write_pencil_new_edit)

#refData
  +desktop
    width: span(10 wider)
    max-width: 1340px
    margin: 0 auto
  .accordion__label
    &::before
      +iconFont(basic1-043_file_document_text)    
      color: $primary
      font-size: px2rem(18)
      margin-right: 5px
      vertical-align: middle  

</style>