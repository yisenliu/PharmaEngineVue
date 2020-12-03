<template>
  <Layout>
    <Hero
      v-bind="hero"
      :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection
        id="comIntro"
        v-bind="comIntro.subject">
        <p
          v-for="(item, index) in comIntro.context"
          :key="index"
          v-html="item"></p>
      </SinglePageSection>
      <SinglePageSection
        id="businessModel"
        v-bind="businessModel.subject"
        :callback="callback.businessModel">
        <p>
          {{ businessModel.context.paragraphy }}
        </p>
        <p v-html="businessModel.context.more"></p>
        <div
          id="businessModelScrollDown"
          class="scrollDown"></div>
      </SinglePageSection>
      <SinglePageSection
        id="comOrgnization"
        v-bind="comOrgnization.subject">
        <ul id="orgnization">
          <template v-for="(el, index) in comOrgnization.context">
            <li
              v-if="el.href"
              :id="'el' + (index + 1)"
              :key="index">
              <a
                :href="el.href"
                v-html="el.text"></a>
            </li>
            <li
              v-else
              :id="'el' + (index + 1)"
              :key="index"
              v-html="el.text"></li>
          </template>
        </ul>
      </SinglePageSection>
      <SinglePageSection
        id="partners"
        v-bind="partners.subject">
        <div
          id="partnersCarousel"
          class="swiper-container">
          <div class="swiper-wrapper">
            <div
              v-for="(partner, index) in partners.items"
              :key="index"
              class="swiper-slide partner">
              <a
                :href="partner.href"
                target="_blank"
                rel="noreferrer">
                <h3 class="partner__name">{{ partner.name }}</h3>
                <p class="partner__desc">{{ partner.desc }}</p>
              </a>
            </div>
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </SinglePageSection>
      <SinglePageSection
        id="joinUs"
        v-bind="joinUs.subject">
        <h2 v-html="joinUs.context.greeting1"></h2>
        <p>{{ joinUs.context.greeting2 }}</p>
        <a :href="joinUs.context.contact.href">{{ joinUs.context.contact.text }}</a>
        <img
          class="lazyload"
          :data-srcset="joinUs.context.image"
          sizes="100vw"
          alt="" />
      </SinglePageSection>
    </SinglePage>
  </Layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'

import Breadcrumb from '@/components/Breadcrumb'
import Hero from '@/components/Hero'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'

export default {
  components: {
    Breadcrumb,
    Hero,
    Layout,
    SinglePage,
    SinglePageSection
  },
  data() {
    return {
      businessModel: {},
      callback: {},
      comIntro: {},
      comOrgnization: {},
      htmlLang: '',
      docTitle: '',
      hero: {},
      joinUs: {},
      loaded: false,
      partners: {},
      singlePage: {}
    }
  },
  mounted() {
    axios
      .get('../db/about.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'businessModel', data.businessModel)
        this.$set(this, 'callback', {
          businessModel() {
            scrollDown({
              trigger: '#businessModelScrollDown',
              target: '#comOrgnization'
            })
          },
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#comIntro'
            })
          }
        })
        this.$set(this, 'comIntro', data.comIntro)
        this.$set(this, 'comOrgnization', data.comOrgnization)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'joinUs', data.joinUs)
        this.$set(this, 'partners', data.partners)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            comIntro() {},
            businessModel() {},
            comOrgnization() {},
            partners() {
              const slides = Array.apply(null, partnersCarousel.slides)
              slides.forEach((slide, index) => {
                setTimeout(() => {
                  slide.addClass('slideUp')
                  // fixing width when sliding up on some devices
                  partnersCarousel.update()
                }, index * 300)
              })
            },
            joinUs() {
              document.querySelector('.singlePage__nav').addClass('light')
            }
          },
          exit: sectionElement => {
            if (sectionElement.id === 'joinUs') {
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
            // deploySinglePageWaypoints()
            deployOrgnizationWaypoints()
          })
        }

        // partners carousel
        let partnersCarousel = null
        const partnersPromise = app.swiper('#partnersCarousel', {
          watchOverflow: true,
          roundLengths: true,
          spaceBetween: 30,
          breakpoints: {
            360: {
              slidesPerView: 1
            },
            1025: {
              slidesPerView: 3
            }
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets'
          }
        })
        partnersPromise.then(response => {
          partnersCarousel = response
        })

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // orgnization waypoints
        const deployOrgnizationWaypoints = () => {
          const orgnizationList = document.querySelectorAll('#orgnization li')

          orgnizationList.forEach(el => {
            new Waypoint.Inview({
              element: el,
              group: 'orgnization',
              enter() {
                el.addClass('active')
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
.about
  .hero
    &::before
      +size(100%)
      content: ''
      display: block
      position: absolute
      left: 0
      top: 0
      z-index: 1
      background-image: linear-gradient(166deg, rgba(90, 240, 127, 0.78)0%, rgba(20, 150, 124, 0.78)80%)

#businessModel
  --scrollDown-color: #556270
  a
    font-weight: 600
    &:hover
      color: $primary
  .singlePage__title
    &::after
      +iconFont(basic3-157_lego_brick)

#comOrgnization
  .singlePage__title
    &::after
      +iconFont(IcoMoon-189-tree)

#comIntro
  .singlePage__title
    &::after
      +iconFont(basic2-087_info)

#joinUs
  padding: 210px 0
  text-align: center
  position: relative
  z-index: 2
  color: #fff
  &::before
    +size(100%)
    content: ''
    display: block
    position: absolute
    z-index: 1
    left: 0
    top: 0
    background-color: rgba(#000,.85)
  .singlePage__context
    position: static
    background-color: transparent
    padding: 0
  h2
    font-family: Lato, sans-serif
    font-size: px2rem(40)
    font-weight: 300
    letter-spacing: 8px
    margin: 0
    line-height: 1.5
    color: #fff
    position: relative
    z-index: 2
    +mobile
      font-size: 5.5vmin
      margin: 0 gutter()
    +tablet
      font-size: 3.5vmin
      margin: 0 gutter()
    +desktop
      font-size: 3.5vmin
      margin: 0 gutter()
    span
      color: $primary
  p
    letter-spacing: 2px
    line-height: 150%
    color: rgba(255, 255, 255, 0.6)
    font-family: Lato, sans-serif
    font-size: 10px
    margin: 20px 0 0 0
    position: relative
    z-index: 2
  img
    +size(100%)
    position: absolute
    z-index: -2
    left: 0
    top: 0
    object-fit: cover
    object-position: center center
  a
    display: inline-block
    color: #fff
    position: relative
    z-index: 3
    font-size: px2rem(12)
    padding-left: 15px
    margin-top: 60px
    &::before
      +size(54px)
      +iconFont(basic1-021_chat_comment_bubble)
      color: #000
      border-radius: 100%
      background-color: #fff
      text-align: center
      line-height: 54px
      font-size: px2rem(20)
      position: absolute
      top: 50%
      right: 100%
      margin-top: -27px

#partners
  .singlePage__title
    &::after
      +iconFont(basic1-116_user_group)

#orgnization
  @extend %list-style-none
  max-width: 1370px
  margin: 0 auto
  +desktop
    width: span(10)
    display: grid
    grid-gap: 30px
    grid-template:
      columns: repeat(10, 1fr)
      rows: repeat(5, 110px) 6px 110px
      areas: '. . . el1 el1 el1 el1 . . .' '. el2 el2 el2 el2 el3 el3 el3 el3 .' '. . . el4 el4 el4 el4 . . .' '. . . el5 el5 el5 el5 . . .' '. . . el6 el6 el6 el6 . . .' '. . . . . . . . . . ' 'el7 el7 el8 el8 el9 el9 el10 el10 el11 el11'
  li
    display: flex
    align-items: center
    position: relative
    padding: 30px
    font-weight: 600
    font-size: px2rem(14)
    line-height: 1.5
    background-color: #fff
    color: #28282e
    transition: all get($time,normal) ease-in-out
    &::before
      content: ''
      position: absolute
      display: block
      background-color: #efefef
      transition: transform get($time,normal) ease-in-out
    a
      +size(calc(100% + 60px))
      display: flex
      align-items: center
      padding: 30px
      margin: -30px
      position: relative
      color: currentColor
      &:hover
        &::before
          transform: scaleX(1)
      &::before
        +size(100%,2px)
        content: ''
        display: block
        position: absolute
        background: #f8a877
        left: 0
        bottom: 0
        transform: scaleX(0)
        transform-origin: center center
        transition: transform get($time,normal) ease-out
      &::after
        +iconFont(forward)
        position: absolute
        right: 9px
        bottom: 3px
        font-size: px2rem(14)
        color: rgba(20,22,24,.35)

@for $i from 1 through 11
  #el#{$i}
    grid-area: el#{$i}

#el1
  &::before
    left: 50%
    top: 100%
    margin-left: -3px
    transform-origin: center top
    transform: scaleY(0)
    transition-duration: get($time,slow)
    +belowTablet
      $h: 110px * 5 + 60px * 5
      +size(6px,$h)
    +desktop
      $h: 110px * 4 + 30px * 6
      +size(6px,$h)
  &.active
    &::before
      transform: scaleY(1)

#el2
  $speed: .6s
  transform: translateX(-20%)
  opacity: 0
  transition-duration: $speed
  +belowTablet
    margin-top: 60px
  &::before
    +desktop
      +size(15px,6px)
      left: 100%
      top: 50%
      margin-top: -3px
      transform-origin: right center
      transform: scaleX(0)
      transition-delay: $speed
  &.active
    transform: translateX(0)
    opacity: 1
    &::before
      +desktop
        transform: scaleX(1)

#el3
  $speed: .6s
  transform: translateX(20%)
  opacity: 0
  transition-duration: $speed
  +belowTablet
    margin-top: 1px
  &::before
    +desktop
      +size(15px,6px)
      right: 100%
      top: 50%
      margin-top: -3px
      transform-origin: left center
      transform: scaleX(0)
      transition-delay: $speed
  &.active
    transform: translateX(0)
    opacity: 1
    &::before
      +desktop
        transform: scaleX(1)

#el4,
#el5,
#el6
  transform: translateY(50%)
  opacity: 0
  +belowTablet
    margin-top: 60px
  &.active
    transform: translateY(0)
    opacity: 1

#el4
  transition-delay: .2s

#el5
  transition-delay: .4s

#el6
  $speed: .4s
  $delay: .6s
  transition-duration: $speed
  transition-delay: $delay
  +belowTablet
    margin-bottom: 60px
  &::before
    +desktop
      +size(calc(200% + 66px),6px)
      margin-left: calc((200% + 66px) / -2)
      left: 50%
      bottom: -36px
      transform-origin: center center
      transform: scaleX(0)
      transition-delay: $speed + $delay
  &.active
    &::before
      transform: scaleX(1)

#el7
  +belowTablet
    transition-delay: 0s

#el8
  +belowTablet
    transition-delay: .1s

#el9
  +belowTablet
    transition-delay: .2s

#el10
  +belowTablet
    transition-delay: .3s

#el11
  +belowTablet
    transition-delay: .4s

#el7,
#el8,
#el9,
#el10,
#el11
  transform: rotateY(90deg)
  transition: 0.6s 1s cubic-bezier(0.26, 0.94, 0.96, 2)
  +belowTablet
    margin-top: 1px
  &::before
    +desktop
      +size(6px,30px)
      left: 50%
      bottom: 100%
      margin-left: -3px
      transform-origin: top center
      transform: scaleY(0)
      transition-delay: 1s
  &.active
    transform: rotateY(0)
    &::before
      transform: scaleY(1)

#partnersCarousel
  --swiper-navigation-color: #000
  counter-reset: partnerNo
  +desktop
    width: span(10)
    margin: 0 auto
  .swiper-slide
    height: auto
    opacity: 0
    transform: translateY(50%)
    transition: transform get($time,slow) get($time,normal) ease-in-out,opacity get($time,slow) ease-in-out
    &.slideUp
      opacity: 1
      transform: translateY(0)

.partner
  padding: 30px
  background-color: #fff
  &::before
    +size(2px,100%)
    content: ''
    background-color: $primary
    position: absolute
    left: 0
    top: 0
    z-index: 1
    display: block
    transition: transform get($time,normal) ease-in-out
    transform-origin: center center
    transform: scaleY(0)
  &:hover
    &::before
      transform: scaleY(1)
  +belowTablet
    width: 100%
  +desktop
    width: span(4)
  &__name
    font-size: px2rem(14)
    margin-bottom: 10px
    &::before
      content: '0'counter(partnerNo)'.'
      counter-increment: partnerNo
      color: $primary
      font-family: "Playfair Display","Helvetica Neue",Helvetica,Arial,sans-serif
      font-size: px2rem(33)
      margin-right: 3px
  &__desc
    color: #556270
    font-size: px2rem(15)
</style>
