<template>
  <Layout>
    <Breadcrumb />
    <h1 class="pageTitle">
      {{ pageTitle }}
    </h1>
    <SinglePage v-if="loaded">
      <SinglePageSection>
        <div class="event">
          <div class="event__heading">
            <h3>{{ event.heading }}</h3>
            <time>{{ event.time }}</time>
            <address>{{ event.address }}</address>
          </div>
          <div class="event__context" v-html="event.context"></div>
          <Button v-bind="event.goBack" class="goBack" />
        </div>
      </SinglePageSection>
      <div class="contact">
        <h3 class="contact__subject">
          <a href="tel:+8862-2515-8228p700">{{ contact.subject }}</a>
        </h3>
        <div class="contact__window">
          {{ contact.name }}<br />
          {{ contact.title }}<br />
          TEL +886 2 2515 8228, ext. 700
        </div>
      </div>
    </SinglePage>
  </Layout>
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
      contact: {},
      htmlLang: '',
      docTitle: '',
      event: {},
      pageTitle: '',
      loaded: false
    }
  },
  mounted() {
    axios
      .get('../db/eventView.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'contact', data.contact)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'event', data.event)
        this.$set(this, 'pageTitle', data.pageTitle)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
      })
      .catch(error => {
        console.error(error)
      })
  }
}
</script>

<style lang="sass">
$theme-color: #64b5f6 

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

.eventView
  .singlePage__context
    background-color: #fff

.pageTitle
  display: none

.event
  &__heading
    h3,
    time,
    address  
      display: block
      width: 100%
    h3
      font-size: px2rem(18)
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
      margin-top: 15px
      &::before
        +iconFont(f073)
    address
      &::before
        +iconFont(basic1-017_location)
  &__context
    padding: 30px 0

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
    
a.goBack
  +button-prepend-icon(glyphicons-basic-157-thumbnails)
  margin: 50px auto 0
  position: relative
  left: 50%
  transform: translateX(-50%)

</style>