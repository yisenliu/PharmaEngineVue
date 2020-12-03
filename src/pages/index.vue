<template>
  <Layout>
    <div id="kvCarousel" class="swiper-container">
      <div class="swiper-wrapper">
        <!-- data-theme="dark | light"表示上稿的圖片偏暗(dark)或偏亮(light) -->
        <div 
          v-for="(slide, index) in swiper"
          :key="index"
          class="swiper-slide"
          :data-theme="slide.theme">
          <template v-if="slide.image">
            <span class="imgMask">
              <img :srcset="slide.image" sizes="100vw" alt="" />
            </span>
            <div class="animateElements">
              <div class="animateElements__el el0">
                <span class="text">{{ slide.animateElements.subtitle }}</span>
              </div>
              <div class="animateElements__el el1">
                <span 
                  class="text" 
                  v-html="slide.animateElements.heading"></span>
              </div>
              <div class="animateElements__el el2">
                <a :href="slide.animateElements.href" class="text">{{ slide.animateElements.more }}</a>
              </div>
            </div>
          </template>
          <video 
            v-else
            :src="slide.video"
            preload="none"
            muted
            controls
            playsinline
            webkit-playsinline></video>
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
      <div class="scrollDown"></div>
    </div>
    <div class="primaryLinks">
      <Scale 
        v-for="(item, index) in primaryLinks"
        :key="index"
        class="primaryLinks__item"
        :item="item" />
    </div>
    <div class="news">
      <div v-for="(item, index) in news" :key="index" class="news__item">
        <a :href="item.href">
          <h2 class="news__title">
            {{ item.title }}
          </h2>
          <time :datetime="item.date" class="news__date">{{ item.date }}</time>
        </a>
      </div>
    </div>
    <div class="secondaryLinks">
      <Scale 
        v-for="(item, index) in secondaryLinks"
        :key="index"
        class="secondaryLinks__item"
        :item="item" />
    </div>
  </Layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'

import Layout from '@/components/Layout'
import Scale from '@/components/Scale'

export default {
  components: {
    Layout,
    Scale
  },
  data() {
    return {
      htmlLang: '',
      docTitle: '',
      news: null,
      primaryLinks: null,
      secondaryLinks: null,
      swiper: null
    }
  },
  mounted() {
    axios
      .get('../db/index.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'news', data.news)
        this.$set(this, 'primaryLinks', data.primaryLinks)
        this.$set(this, 'secondaryLinks', data.secondaryLinks)
        this.$set(this, 'swiper', data.swiper)
      })
      .then(() => {
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle

        // Pace done
        app.paceDone = () => {
          kvCarousel.init()
        }

        // Swiper
        const mySwiper = document.querySelector('#kvCarousel')
        const prevBtn = mySwiper.querySelector('.swiper-button-prev')
        const nextBtn = mySwiper.querySelector('.swiper-button-next')
        const animateElementsEnter = element => {
          const el = element.querySelectorAll('.animateElements__el')
          const text = element.querySelectorAll('.text')
          const tl = anime.timeline({
            easing: 'easeInOutSine',
            duration: 600,
            begin() {
              element.addClass('enter-to')
            }
          })

          tl.add({
            targets: text[0],
            opacity: [0, 1],
            scale: [1, 1],
            translateY: ['100%', '0%'],
            begin() {
              el[0].addClass('enter-to')
            },
            complete() {
              el[0].removeClass('enter-to')
              el[0].addClass('leave')
            }
          })
            .add(
              {
                targets: text[1],
                opacity: [0, 1],
                scale: [1, 1],
                translateY: ['20%', '0%']
              },
              '-=400'
            )
            .add({
              targets: text[2],
              opacity: [0, 1],
              scale: [0.5, 1],
              duration: 1000,
              delay: 300,
              begin() {
                el[2].addClass('enter-to')
              }
            })
        }
        const animateElementsLeave = element => {
          const el = element.querySelectorAll('.animateElements__el')
          const text = element.querySelectorAll('.text')
          const tl = anime.timeline({
            easing: 'easeInOutSine',
            duration: 600,
            begin() {
              el[0].removeClass('leave')
              el[0].addClass('leave-to')
              el[2].removeClass('enter-to')
            },
            complete() {
              element.removeClass('enter-to')
              el[0].removeClass('leave-to')
            }
          })
          tl.add({
            targets: text,
            easing: 'easeInOutSine',
            opacity: [1, 0],
            scale: [1, 0.5]
          })
          return tl.finished
        }
        const handleSwiperAutoplay = (swiperInstance, autoplay) => {
          const currentSlide = swiperInstance.slides[swiperInstance.activeIndex]
          const video = currentSlide.querySelector('video')

          if (!video && autoplay) {
            swiperAutoplayTimeout = setTimeout(() => {
              slideToNext(swiperInstance)
            }, 5000)
          }
        }
        const stopSwiperAutoplay = () => {
          clearTimeout(swiperAutoplayTimeout)
        }
        const slideToNext = swiperInstance => {
          const activeSlide = swiperInstance.slides[swiperInstance.activeIndex]
          const activeAnimateElements = activeSlide.querySelector(
            '.animateElements'
          )
          if (activeAnimateElements) {
            animateElementsLeave(activeAnimateElements).then(() => {
              turnOffCarousel().then(() => {
                swiperInstance.slideNext()
                handleSwiperAutoplay(swiperInstance, isAutoplay)
              })
            })
          } else {
            turnOffCarousel().then(() => {
              swiperInstance.slideNext()
              handleSwiperAutoplay(swiperInstance, isAutoplay)
            })
          }
        }
        const slideToPrev = swiperInstance => {
          const activeSlide = swiperInstance.slides[swiperInstance.activeIndex]
          const activeAnimateElements = activeSlide.querySelector(
            '.animateElements'
          )
          if (activeAnimateElements) {
            animateElementsLeave(activeAnimateElements).then(() => {
              turnOffCarousel().then(() => {
                swiperInstance.slidePrev()
                handleSwiperAutoplay(swiperInstance, isAutoplay)
              })
            })
          } else {
            turnOffCarousel().then(() => {
              swiperInstance.slidePrev()
              handleSwiperAutoplay(swiperInstance, isAutoplay)
            })
          }
        }
        const disableSwiperNavigation = () => {
          prevBtn.addClass('swiper-button-disabled')
          nextBtn.addClass('swiper-button-disabled')
        }
        const enableSwiperNavigation = () => {
          prevBtn.removeClass('swiper-button-disabled')
          nextBtn.removeClass('swiper-button-disabled')
        }
        const checkSwiperButtonState = swiperInstance => {
          if (swiperInstance.isBeginning) {
            prevBtn.addClass('swiper-button-disabled')
          } else {
            prevBtn.removeClass('swiper-button-disabled')
          }
          if (swiperInstance.isEnd) {
            nextBtn.addClass('swiper-button-disabled')
          } else {
            nextBtn.removeClass('swiper-button-disabled')
          }
        }
        const handleSwiperTheme = swiperInstance => {
          const activeSlide = swiperInstance.slides[swiperInstance.activeIndex]
          if (kvThemeClass) {
            swiperInstance.el.removeClass(kvThemeClass)
          }
          kvThemeClass =
            activeSlide.dataset.theme === 'light'
              ? 'theme--light'
              : 'theme--dark'
          swiperInstance.el.addClass(kvThemeClass)
        }
        const turnOffCarousel = () => {
          const animation = anime({
            targets: '#kvCarousel',
            filter: ['brightness(1)', 'brightness(0)'],
            easing: 'linear',
            duration: 600,
            complete: enableSwiperNavigation
          })
          return animation.finished
        }
        const turnOnCarousel = () => {
          const animation = anime({
            targets: '#kvCarousel',
            filter: ['brightness(0)', 'brightness(1)'],
            easing: 'linear',
            duration: 600
          })
          return animation.finished
        }
        let kvThemeClass = ''
        let isAutoplay = true
        let swiperAutoplayTimeout = null
        let kvCarousel = null
        const kvPromise = Promise.resolve(
          app.swiper('#kvCarousel', {
            init: false,
            effect: 'fade',
            roundLengths: true,
            pagination: false,
            allowTouchMove: false,
            loop: true,
            watchOverflow: true,
            on: {
              init() {
                scrollDown({
                  trigger: '.scrollDown',
                  target: '.primaryLinks'
                })
                this.el.addEventListener('mouseleave', () => {
                  app.myConsole.log(event.type)
                  isAutoplay = true
                  handleSwiperAutoplay(this, isAutoplay)
                })
                this.el.addEventListener('mousemove', () => {
                  app.myConsole.log(event.type)
                  isAutoplay = false
                  stopSwiperAutoplay()
                })
                prevBtn.addEventListener('click', () => {
                  disableSwiperNavigation()
                  slideToPrev(this)
                })
                nextBtn.addEventListener('click', () => {
                  disableSwiperNavigation()
                  slideToNext(this)
                })

                if (!this.params.loop) {
                  checkSwiperButtonState(this)
                }
                handleSwiperAutoplay(this, isAutoplay)
                handleSwiperTheme(this)
                handleVideoPlay(this)
                turnOnCarousel().then(() => {
                  const activeSlide = this.slides[this.activeIndex]
                  const activeAnimateElements = activeSlide.querySelector(
                    '.animateElements'
                  )
                  if (activeAnimateElements) {
                    animateElementsEnter(activeAnimateElements)
                  }
                })
              },
              slideChange() {
                const self = this
                if (!this.params.loop) {
                  checkSwiperButtonState(this)
                }
                handleSwiperTheme(this)
                pauseAllVideosInSwiper()
                turnOnCarousel().then(() => {
                  const activeSlide = this.slides[this.activeIndex]
                  const activeAnimateElements = activeSlide.querySelector(
                    '.animateElements'
                  )
                  if (activeAnimateElements) {
                    animateElementsEnter(activeAnimateElements)
                  } else {
                    handleVideoPlay(self)
                  }
                })
              }
            }
          })
        )
        kvPromise.then(res => {
          kvCarousel = res
        })

        // mediaelement player
        let mejsPlayer = null
        const pauseAllVideosInSwiper = () => {
          mejsPlayer.forEach(playerId => {
            if (mejs.players[playerId].node.closest('#kvCarousel')) {
              mejs.players[playerId].pause()
            }
          })
        }
        const handleVideoPlay = swiperInstance => {
          const currentSlide = swiperInstance.slides[swiperInstance.activeIndex]
          const media = currentSlide.querySelector('.mejs__container')
          if (media) {
            stopSwiperAutoplay()
            mejs.players[media.id].play()
          }
        }
        import(
          /* webpackChunkName: "mediaelement" */ 'mediaelement/src/css/mediaelementplayer.css'
        ).then(() => {
          import(
            /* webpackChunkName: "mediaelement" */ 'mediaelement/full'
          ).then(() => {
            const videos = Array.apply(null, document.querySelectorAll('video'))
            videos.map(video => {
              new MediaElementPlayer(video, {
                shimScriptAccess: 'always',
                // stretching: 'responsive',
                // stretching: 'fill',
                setDimensions: false,
                youtube: {
                  rel: 0
                },
                success(media, node, instance) {
                  media.addEventListener('ended', () => {
                    mejs.players[instance.id].setCurrentTime(0)
                    if (node.closest('#kvCarousel')) {
                      slideToNext(kvCarousel)
                    }
                  })
                }
              })
            })

            const mejsContainers = Array.apply(
              null,
              document.querySelectorAll('.mejs__container')
            )
            mejsPlayer = mejsContainers.map(item => {
              return item.id
            })
          })
        })
      })
      .catch(error => {
        console.log(JSON.stringify(error))
      })
  }
}
</script>

<style lang="sass">
.news
  +mobile
    padding: 0 gutter()
  +tablet
    padding: 0 gutter()
    display: flex
    flex-flow: row wrap
    align-items: stretch
    > *
      width: span(4)
      &:nth-child(2n+2)
        margin-left: gutter()
  +desktop
    padding: 0 gutter()
  a
    display: inline-block
    +belowTablet
      padding: 30px 0
    +tablet
      display: flex
      flex-flow: column wrap
      justify-content: center
    +desktop
      padding: 30px
  &__item
    text-align: center
    position: relative
    +mobile
      & + &
        &::after
          +size(30%,1px)
          content: ''
          display: block
          position: absolute
          background: #f4f4f4
          top: 0
          left: 50%
          transform: translateX(-50%)
    +tablet
      display: flex
      justify-content: center
      &:nth-child(n+3)
        &::after
          +size(30%,1px)
          content: ''
          display: block
          position: absolute
          background: #f4f4f4
          top: 0
          left: 50%
          transform: translateX(-50%)
    +desktop
      margin: 0 auto
      width: span(10)
      & + &
        &::after
          +size(24%,1px)
          content: ''
          display: block
          position: absolute
          background: #f4f4f4
          top: 0
          left: 50%
          transform: translateX(-50%)
  &__title
    font-weight: 600
    +belowTablet
      font-size: 15px
      margin-bottom: 10px
    +desktop
      font-size: 20px
      margin: 0
      padding-bottom: 15px
      position: relative
      overflow: hidden
      &:hover
        &::after
          transform: translateX(-50%)
      &::after
        +size(80%,0)
        content: ''
        position: absolute
        left: 50%
        bottom: 9px
        border-top: 1px dotted #d59066
        transform: translateX(-200%)
        transition: transform get($time,normal) ease-in-out
  &__date
    display: inline-block
    font-weight: 600
    color: #556270
    +belowTablet
      font-size: 12px
    +desktop
      font-size: 13px

.primaryLinks
  +mobile
    padding: 60px gutter()
  +tablet
    padding: 60px gutter()
  +desktop
    padding: 60px gutter()
    display: flex
    flex-flow: row wrap
  > :nth-child(1)
    +desktop
      flex-basis: span(4)
    +belowTablet
      margin-bottom: 30px
  > :nth-child(2)
    &::before
      +size(100%)
      content: ''
      display: block
      position: absolute
      z-index: 1
      left: 0
      top: 0
      background-image: linear-gradient(141deg, rgba(183, 244, 48, 0.9), rgba(144, 219, 95, 0.9) 15.13%, rgba(121, 206, 100, 0.56) 44.96%, rgba(88, 187, 108, 0.68) 63.03%, rgba(48, 165, 118, 0.82) 76.47%, rgba(20, 150, 124, 0.9))
    +desktop
      flex-basis: span(8)
      margin-left: gutter()
  &__item
    +belowTablet
      +size(100%,240px)
    +desktop
      height: 360px
    h2
      margin: 0

.secondaryLinks
  +mobile
    margin: 60px gutter()
  +tablet
    margin: 60px gutter()
  +desktop
    margin: 60px gutter()
    display: flex
    flex-flow: row wrap
  > *
    +desktop
      flex-basis: span(4)
      margin-left: gutter()
      &:nth-child(3n+1)
        margin-left: 0
      &:nth-child(n+4)
        margin-top: 30px
    +belowTablet
      margin-bottom: 30px
  &__item
    background-color: #000
    +belowTablet
      +size(100%,240px)
    +desktop
      height: 360px
    h2
      margin: 0

#kvCarousel
  filter: brightness(0)
  --themeColor: #fff
  --themeColor-link: #{$primary}
  --themeColor-link-hover: #{$primary}
  --themeColor-bg-hover: transparent
  --swiper-navigation-color: var(--themeColor)
  --scrollDown-color: var(--themeColor)
  +belowTablet
    +size(100%,calc(100vh - 76px))
  +desktop
    +size(100%,calc(100vh - 96px))
  &.theme--dark
    .imgMask
      &::before
        +size(100%)
        content: ''
        display: block
        position: absolute
        z-index: 1
        left: 0
        top: 0
        background-color: rgba(10, 4, 4, 0.33)
  &.theme--light
    --themeColor: #000
    --themeColor-link: #000
    --themeColor-link-hover: #fff
    --themeColor-bg-hover: #{$primary}
  .swiper-slide
    background-color: #000
    img
      object-fit: cover
      object-position: center center
      height: 100%

.animateElements
  user-select: none
  width: 100%
  height: 70vh
  position: absolute
  z-index: 2
  margin: auto
  right: 0
  left: 0
  top: 0
  bottom: 0
  visibility: hidden
  display: flex
  flex-flow: column nowrap
  align-items: center
  justify-content: center
  +mobile
    justify-content: space-between
  &.enter-to
    visibility: visible
    &::before
      opacity: 1
  &::before
    +size(26px)
    content: ''
    display: block
    opacity: 0
    transition: opacity get($time, fast)
    background-color: $primary
    border-radius: 100%
    +mobile
      top: -26px
  &__el
    width: 100%
    text-align: center
    white-space: nowrap
    position: relative
    sup
      font-size: 30%
      top: -1.9em
  .el0
    font-size: 13px
    line-height: 1
    color: $primary
    font-family: Lato, sans-serif
    +mobile
      font-size: 12px
    &::before
      +size(0,12vh)
      content: ''
      border-left: 1px solid $primary
      display: block
      margin: 0 auto 30px
      transition: transform .6s ease-in-out
      transform: scaleY(0)
      transform-origin: center top
    &.enter-to
      &::before
        transform: scaleY(1)
        transform-origin: center top
    &.leave
      &::before
        transform: scaleY(1)
        transform-origin: center bottom
    &.leave-to
      &::before
        transform: scaleY(0)
        transform-origin: center bottom
    .text
      display: block
      transform-origin: center center
  .el1
    font-size: 6.5vmin
    line-height: 1
    color: var(--themeColor)
    font-family: 'Playfair Display', serif
    +mobile
      font-size: 8.5vmin
      margin: 10px auto
    +mobile(landscape)
      font-size: 6vmin
    +tablet
      margin: 20px auto
    +desktop
      margin: 0 auto 20px
    .text
      display: block
  .el2
    &::before
      +size(0,12vh)
      content: ''
      border-left: 1px solid $primary
      display: block
      margin: 0 auto
      transition: transform .6s ease-in-out
      transform-origin: center top
      transform: scaleY(0)
    &.enter-to
      &::before
        transform: scaleY(1)
    a
      display: inline-block
      font-size: 15px
      line-height: 13px
      color: var(--themeColor-link)
      letter-spacing: 2px
      font-family: Lato, sans-serif
      border: 1px solid rgba($primary, 0.25)
      background-color: transparent
      padding: 15px 50px
      transition: color get($time,normal),border-color get($time,normal),background-color get($time,normal)
      opacity: 0
      transform: translateY(-50%)
      +mobile
        margin-top: 3vh
        font-size: 12px
      +tablet
        margin-top: 5vh
      +desktop
        margin-top: 8vh
      &:hover
        color: var(--themeColor-link-hover)
        border-color: rgba(201,242,152)
        background-color: var(--themeColor-bg-hover)

.mejs__container
  +size(100%)
  max-height: 100%
  video
    max-width: 100%
    max-height: 100%
    object-fit: contain
    object-position: center center
  iframe
    +size(100%)
  .mejs__overlay-play,
  .mejs__overlay-loading
    top: 50%
    left: 50%
    transform: translate(-50%,-50%)
  .mejs__overlay-play,
  .mejs__overlay
    +size(100%)
  .mejs__overlay-loading
    position: absolute
</style>
