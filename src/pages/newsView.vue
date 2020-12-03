<template>
  <Layout>
    <Breadcrumb />
    <h1 class="pageTitle">
      {{ pageTitle }}
    </h1>
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection>
        <div class="socialShare">
          <!-- 社群分享連結已由前端處理 -->
          <a
            id="facebook"
            href="javascript:void(0);"
            target="_blank"
            rel="noreferrer">Facebook</a>
          <a
            id="line"
            href="javascript:void(0);"
            target="_blank"
            rel="noreferrer">Line</a>
        </div>
        <div class="news">
          <time class="news__publishDate">{{ newsView.publishDate }}</time>
          <h1 class="news__title">
            {{ newsView.title }}
          </h1>
          <img
            :srcset="newsView.figure"
            :sizes="`${mobile} 86vw, ${tablet} 92vw, 97vw`"
            alt=""
            class="news__figure" />
          <div class="news__download">
            <a :href="newsView.download.href">{{ newsView.download.text }}</a>
          </div>
          <div class="news__context">
            {{ newsView.context }}
          </div>
          <div class="news__quote">
            <h3 class="news__quote__subject">
              {{ newsView.quote.subject }}
            </h3>
            <div class="news__quote__context">
              {{ newsView.quote.context }}
            </div>
          </div>
          <section class="news__brief">
            <h3 class="news__brief__subject">
              {{ newsView.brief.subject }}
            </h3>
            <div class="news__brief__context">
              {{ newsView.brief.context }}
            </div>
          </section>
          <div class="news__links">
            <a 
              v-for="(link,index) in newsView.links"
              :key="index"
              :href="link.href">
              {{ link.text }}
            </a>
          </div>
          <section class="news__descs">
            <div 
              v-for="(desc,index) in newsView.descs"
              :key="index"
              class="news__desc">
              <h3 class="news__desc__subject">
                {{ desc.subject }}
              </h3>
              <div 
                class="news__desc__context"
                v-html="desc.context">
              </div>
            </div>
          </section>
          <Button v-bind="newsView.goBack" class="goBack" />
        </div>
      </SinglePageSection>
      <div class="contact">
        <h3 class="contact__subject">
          <a :href="newsView.contact.subject.href">
            {{ newsView.contact.subject.text }}            
          </a>
        </h3>
        <div class="contact__window" v-html="newsView.contact.window"></div>
      </div>
    </SinglePage>
  </layout>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Button from '@/components/Button'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'

export default {
  components: {
    Breadcrumb,
    Button,
    Layout,
    SinglePage,
    SinglePageSection
  },
  data() {
    return {
      htmlLang: '',
      docTitle: '',
      loaded: false,
      mobile: MOBILE,
      newsView: {},
      pageTitle: '',
      singlePage: {},
      tablet: TABLET
    }
  },
  mounted() {
    axios
      .get('../db/newsView.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'newsView', data.newsView)
        this.$set(this, 'pageTitle', data.pageTitle)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle

        // 社群分享
        const socialShare = {
          title: encodeURIComponent(document.title),
          url: encodeURIComponent(window.location.href)
        }

        document
          .querySelector('#line')
          .setAttribute(
            'href',
            'http://line.naver.jp/R/msg/text/?' +
              socialShare.title +
              '%0D%0A' +
              socialShare.url
          )
        document
          .querySelector('#facebook')
          .setAttribute(
            'href',
            'http://www.facebook.com/share.php?u=' +
              socialShare.url +
              '&t=' +
              socialShare.title
          )
      })
      .catch(error => {
        console.log(JSON.stringify(error))
      })
  },
  methods: {
    onClick(event) {
      console.log(event.target)
    }
  }
}
</script>

<style lang="sass">

$theme-color: #e49a6d 

%bleeding
  +mobile
    $gutter: #{1vw * strip-unit(gutter())}
    margin-left: -#{$gutter}
    margin-right: -#{$gutter}
    padding-left: $gutter
    padding-right: $gutter
  +tablet
    $gutter: #{1vw * strip-unit(gutter())}
    margin-left: -#{$gutter}
    margin-right: -#{$gutter}
    padding-left: $gutter
    padding-right: $gutter
  +desktop
    $gutter: #{1vw * strip-unit(gutter())}
    margin-left: -#{$gutter}
    margin-right: -#{$gutter}
    padding-left: $gutter
    padding-right: $gutter

.newsView
  .singlePage__context
    background-color: #fff
    padding-top: 30px

.pageTitle
  display: none
    
.socialShare
  display: flex
  justify-content: flex-end
  a
    +hide-text
    +size(36px)
    background: center center / contain no-repeat
    margin-left: 10px

#line
  background-image: sprite(Line)

#facebook
  background-image: sprite(facebook)

.news
  &__publishDate
    display: inline-flex
    justify-content: center
    font-size: px2rem(15)
    &::before
      +iconFont(basic1-013_time_clock)
      margin-right: 5px
      opacity: 0.4
  &__title
    font-size: px2rem(18)
    margin: 15px 0 0
  &__figure
    margin-top: 30px
  &__download
    @extend %bleeding
    background-color: #f7f7f7
    display: flex
    justify-content: center
    align-items: center
    padding: 30px
    margin-top: 30px
    margin-bottom: 0
    a
      display: inline-flex
      align-items: center
      font-weight: 600
      &::before
        +iconFont(basic2-263_download)
        +size(54px)
        background-color: #fff
        border-radius: 50%
        font-size: px2rem(26)
        color: $theme-color
        text-align: center
        line-height: 54px
        margin-right: 10px
  &__context
    padding: 30px 0
  &__quote
    @extend %bleeding
    background-color: #f7f7f7
    border-top: 1px solid #c6c6c6
    border-bottom: 1px solid #c6c6c6
    margin-top: 0
    margin-bottom: 0
    padding-top: 50px
    padding-bottom: 50px
    &__subject
      font-size: px2rem(13)
      margin: 0
      text-align: center
    &__context
      margin: 30px auto 0
      font-size: px2rem(18)
      +tablet
        width: span(6)
      +desktop
        width: span(8)
      &::before,
      &::after
        display: block
        width: 100%
        color: $theme-color
        font-size: px2rem(21)
        +iconFont(basic1-138_quotes)
      &::after
        transform: rotate(180deg)
        text-align: left
  &__brief
    &__subject
      font-size: px2rem(18)
      text-align: center
      position: relative
      border-bottom: 1px solid #efefef
      max-width: 1340px
      margin: 30px auto 0
      +mobile
        width: 100%
      +aboveTablet
        padding: 0 30px
        display: inline-block
        left: 50%
        transform: translateX(-50%)
      &::after
        +iconFont(basic1-147_target)
        +size(2em,1em)
        margin: 3px auto 0
        background-color: #fff
        font-size: px2rem(24)
        display: block
        color: $theme-color
        transform: translateY(50%)
    &__context
      margin: 30px auto 0
      +desktop
        width: span(10)
  &__links
    @extend %bleeding
    background-color: #f7f7f7
    margin-top: 30px
    display: flex
    align-items: center
    justify-content: space-around
    +mobile
      flex-flow: column nowrap
      padding-top: 30px
      padding-bottom: 30px
    +aboveTablet
      flex-direction: row
      padding-top: 80px
      padding-bottom: 80px
    a
      display: flex
      flex-flow: row nowrap
      align-items: center
      font-weight: 600
      line-height: get($line-height,s)
      +mobile
        width: 70%
        flex: 1 0 auto
      +aboveTablet
        max-width: 30%
        flex: 0 0 auto
      &::before
        +iconFont(basic2-055_world_international)
        +size(54px)
        background-color: #fff
        border-radius: 50%
        font-size: px2rem(26)
        color: $theme-color
        text-align: center
        line-height: 54px
        margin-right: 10px
        flex: 0 0 auto
      + a
        +mobile
          margin-top: 15px
  &__descs
    +aboveTablet
      display: flex
      flex-flow: row wrap
      padding-top: 30px
    > div
      +mobile
        padding-top: 30px
        + div
          margin-top: 30px
          border-top: 1px solid #efefef
      +tablet
        width: span(4)
        &:nth-child(2)
          margin-left: gutter()
          position: relative
          &::before
            +size(0,100%)
            content: ''
            display: block
            border-left: 1px solid #efefef
            position: absolute
            left: -#{gutter()}
            top: 0
        &:nth-child(3)
          width: 100%
          margin-top: 30px
          padding-top: 30px
          border-top: 1px solid #efefef
      +desktop
        width: span(4)
        padding: 0 20px
        flex: 1 0 0
        &:nth-child(n+2)
          margin-left: gutter()
          position: relative
          &::before
            +size(0,100%)
            content: ''
            display: block
            border-left: 1px solid #efefef
            position: absolute
            left: -#{gutter()}
    a
      color: #000
  &__desc
    &__subject
      margin: 0
      font-size: px2rem(18)
      display: flex
      align-items: flex-start
      line-height: 24px
      &::before
        +iconFont(basic1-147_target)
        color: $theme-color
        font-size: px2rem(24)
        margin-right: 5px
    &__context
      margin-top: 20px

.contact
  width: 100%
  background: center center / cover no-repeat
  +mobile
    background-image: linear-gradient(0deg,rgba(32,24,27,0.7) 0%, rgba(32,24,27,0.7) 100%),url('~@/assets/responsiveImages/iStock-1046832538.jpg?size=750') 
    padding: 50px gutter()
  +tablet
    background-image: linear-gradient(0deg,rgba(32,24,27,0.7) 0%, rgba(32,24,27,0.7) 100%),url('~@/assets/responsiveImages/iStock-1046832538.jpg?size=1536') 
    padding: 50px gutter()
  +desktop
    background-image: linear-gradient(0deg,rgba(32,24,27,0.7) 0%, rgba(32,24,27,0.7) 100%),url('~@/assets/responsiveImages/iStock-1046832538.jpg?size=1920') 
    padding: 50px gutter()
  &__subject
    text-align: center
    color: #fff
    margin: 0
    font-size: px2rem(16)
    a
      color: currentColor
      display: flex
      flex-flow: row nowrap
      align-items: center
      justify-content: center
      &::before
        +iconFont(basic1-036_phone_call)
        +size(54px)
        text-align: center
        line-height: 54px
        background-color: #fff
        border-radius: 50%
        margin-right: 10px
        font-size: px2rem(26)
        color: $theme-color
  &__window
    margin: 30px auto 0
    padding-top: 30px
    text-align: center
    border-top: 1px solid rgba(#fff,.2)
    color: #fff
    +tablet
      width: span(4)
    +desktop
      width: span(4)
    
.goBack
  +button-prepend-icon(glyphicons-basic-157-thumbnails)
  margin: 50px auto 0
  position: relative
  left: 50%
  transform: translateX(-50%)
</style>
