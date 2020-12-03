<template>
  <Layout>
    <Breadcrumb />
    <h1 class="pageTitle">
      {{ pageTitle }}
    </h1>
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="CSRZone" v-bind="CSRZone.subject">
        <div class="contextContainer">
          <div v-for="(article, index) in CSRZone.context" :key="index">
            <h3>{{ article.heading }}</h3>
            <p>{{ article.desc }}</p>
          </div>
        </div>
      </SinglePageSection>
      <SinglePageSection id="socialServiceEvents" v-bind="socialServiceEvents.subject">
        <div class="contextContainer">
          <div class="titleContainer">
            <h2>{{ socialServiceEvents.context.heading }}</h2>
            <p>{{ socialServiceEvents.context.desc }}</p>
          </div>
          <ul class="events">
            <li v-for="(event, index) in socialServiceEvents.context.events" :key="index">
              <time :datetime="event.time">{{ event.time }}</time>
              <p>{{ event.content }}</p>
            </li>
          </ul>
        </div>
      </SinglePageSection>
      <SinglePageSection id="CSRReport" v-bind="CSRReport.subject">
        <div class="contextContainer">
          <div class="titleContainer">
            <h2>{{ CSRReport.context.heading }}</h2>
            <p>{{ CSRReport.context.desc }}</p>
          </div>
          <ul class="attachments">
            <li v-for="(attachment, index) in CSRReport.context.attachments" :key="index">
              <a :href="attachment.href">{{ attachment.text }}</a>
            </li>
          </ul>
        </div>
      </SinglePageSection>
      <SinglePageSection id="CIZone" v-bind="CIZone.subject">
        <div class="contextContainer" v-html="CIZone.context"></div>
      </SinglePageSection>
    </SinglePage>
  </Layout>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'

export default {
  components: {
    Breadcrumb,
    Layout,
    SinglePage,
    SinglePageSection
  },
  data() {
    return {
      CIZone: {},
      CSRReport: {},
      CSRZone: {},
      htmlLang: '',
      docTitle: '',
      loaded: false,
      pageTitle: '',
      singlePage: {},
      socialServiceEvents: {}
    }
  },
  mounted() {
    axios
      .get('../db/CSR.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'CIZone', data.CIZone)
        this.$set(this, 'CSRReport', data.CSRReport)
        this.$set(this, 'CSRZone', data.CSRZone)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'pageTitle', data.pageTitle)
        this.$set(this, 'socialServiceEvents', data.socialServiceEvents)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            CSRZone() {},
            socialServiceEvents() {
              document.querySelector('.singlePage__nav').addClass('light')
              document.querySelector('#socialServiceEvents').addClass('active')
            },
            CSRReport() {
              document.querySelector('.singlePage__nav').addClass('light')
              document.querySelector('#CSRReport').addClass('active')
            },
            CIZone() {}
          },
          exit: sectionElement => {
            if (
              sectionElement.id === 'socialServiceEvents' ||
              sectionElement.id === 'CSRReport'
            ) {
              document.querySelector('.singlePage__nav').removeClass('light')
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
        console.log(JSON.stringify(error))
      })
  }
}
</script>

<style lang="sass">
.contextContainer
  p
    padding: 0

.pageTitle
  display: none

.singlePage
  counter-reset: contextNo

#CSRZone,
#CIZone
  .singlePage__context
    background-color: #fff

#CSRZone
  .contextContainer
    +belowTablet
      width: 100%
    +desktop
      width: span(8)
      margin: 0 auto
    div + div
      margin-top: 50px
  h3
    font-size: px2rem(16)
    margin: 0 0 20px 0

#CSRReport,
#socialServiceEvents
  .contextContainer
    +desktop
      display: inline-flex
      width: 100%
  .titleContainer
    display: flex
    flex-flow: column nowrap
    justify-content: center
    background-color: #68717B
    +belowTablet
      padding: 30px
      min-height: 400px
    +desktop
      width: span(4)
      padding: 80px
    h2
      color: #fff
      font-size: px2rem(17)
      margin: 0 0 20px 0
      &::before
        content: '0'counter(contextNo)'.'
        counter-increment: contextNo
        font-family: 'Playfair Display',serif
        color: $primary
        font-weight: 600
        display: block
        margin-bottom: 20px
        +mobile
          font-size: px2rem(40)
        +tablet
          font-size: px2rem(50)
        +desktop
          font-size: px2rem(60)
    p
      color: #d6d6d6
      padding: 0

#socialServiceEvents
  &.active
    .events,
    .titleContainer
      opacity: 1
      transform: translateX(0)
  .events,
  .titleContainer
    opacity: 0
    transform: translateX(50%)
    transition: get($time,slow) ease-out
    transition-property: opacity, transform
  .events
    @extend %list-style-none
    color: #fff
    background: linear-gradient(0deg,rgba(#000,.4) 0%, rgba(#000,.4) 100%), url('~@/assets/responsiveImages/woman-sitting-using-phone-777155.jpg?size=1125') center center / cover no-repeat
    +mobile
      padding: 80px 30px
      margin-top: gutter()
    +tablet
      padding: 80px 30px
      margin-top: gutter()
    +desktop
      width: span(8)
      margin-left: gutter()
      padding: 80px
      display: flex
      flex-flow: row wrap
    li
      padding-left: 2.3em
      position: relative
      &::before
        +iconFont(basic1-137_bookmark)
        font-size: px2rem(24)
        font-weight: 400
        color: $primary
        display: inline-block
        position: absolute
        left: 0
        top: -8px
      +belowTablet
        + li
          margin-top: 30px
      +desktop
        width: 22%
        margin-left: 4%
        &:nth-child(4n+1)
          margin-left: 0
        &:nth-child(n+5)
          margin-top: 30px
    time
      display: block
      font-size: px2rem(13)
      font-weight: 600
      margin-bottom: 10px

#CSRReport
  margin-top: -80px
  border-top: none
  &.active
    .attachments,
    .titleContainer
      opacity: 1
      transform: translateX(0)
  .attachments,
  .titleContainer
    opacity: 0
    transform: translateX(-50%)
    transition: get($time,slow) ease-out
    transition-property: opacity, transform
  .singlePage__context
    +mobile
      padding-top: gutter()
    +tablet
      padding-top: gutter()
    +desktop
      padding-top: gutter()
  .titleContainer
    +desktop
      order: 2
  .attachments
    @extend %list-style-none
    background: linear-gradient(0deg,rgba(#000,.4) 0%, rgba(#000,.4) 100%),url('~@/assets/responsiveImages/pixta_55384406_M.jpg?size=1125') center center / cover no-repeat
    +mobile
      padding: 80px 30px
      margin-top: gutter()
    +tablet
      padding: 80px 30px
      margin-top: gutter()
    +desktop
      width: span(8)
      margin-right: gutter()
      padding: 80px
      display: flex
      flex-flow: row wrap
    li
      +belowTablet
        + li
          margin-top: 30px
      +desktop
        flex-basis: 48%
        &:nth-child(2n+2)
          margin-left: 4%
    a
      color: #fff
      font-weight: 600
      display: inline-flex
      align-items: center
      +mobile
        font-size: px2rem(13)
      &::before
        +iconFont(basic1-043_file_document_text)
        color: $primary
        font-size: px2rem(22)
        font-weight: 40
        margin-right: 10px

#CIZone
  .singlePage__title
    &::after
      +iconFont(basic3-082_winner_medal_first_award_achievement)
  .contextContainer
    +belowTablet
      width: 100%
    +desktop
      width: span(8)
      margin: 0 auto
</style>
