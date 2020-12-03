<template>
  <Layout>
    <Breadcrumb />
    <h1 class="pageTitle">
      {{ pageTitle }}
    </h1>
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="model01" data-point-id="core" v-bind="model01.subject">
        <article>
          <h3 v-html="model01.context.heading"></h3>
          <p v-for="(content, index) in model01.context.paragraphy" :key="index">
            {{ content }}
          </p>
        </article>
        <div id="coreSVG" class="inlineSVG"></div>
      </SinglePageSection>
      <SinglePageSection id="model02" v-bind="model02.subject">
        <article>
          <h3 v-html="model02.context.heading"></h3>
          <p v-for="(content, index) in model02.context.paragraphy" :key="index">
            {{ content }}
          </p>
        </article>
        <div id="NRDOSVG" class="inlineSVG"></div>
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
      htmlLang: '',
      docTitle: '',
      loaded: false,
      model01: {},
      model02: {},
      pageTitle: '',
      singlePage: {}
    }
  },
  mounted() {
    axios
      .get('../db/businessModel.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'model01', data.model01)
        this.$set(this, 'model02', data.model02)
        this.$set(this, 'pageTitle', data.pageTitle)
        this.$set(this, 'singlePage', {
          enter: {
            boardOrg() {},
            boardData() {}
          }
        })
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle

        // Pace done
        app.paceDone = () => {
          waypointsPromise.then(() => {
            this.$refs.sp.deploy()
            importSVGs().then(() => {
              deploySVGAnimation()
            })
          })
        }

        // inject inline SVG by language
        const lang = document.documentElement.lang.toLowerCase()
        const coreSVGContainer = document.querySelector('#coreSVG')
        const NRDOSVGContainer = document.querySelector('#NRDOSVG')
        const importSVGs = async () => {
          const svg1 = await import(
            /* webpackChunkName: '[request]' */ `@/assets/inlineSVG/coreCompetence_${lang}.svg`
          )
          const svg2 = await import(
            /* webpackChunkName: '[request]' */ `@/assets/inlineSVG/NRDO_${lang}.svg`
          )

          coreSVGContainer.innerHTML = svg1.default
          NRDOSVGContainer.innerHTML = svg2.default
          return
        }

        coreSVGContainer.dataset.animated = false
        NRDOSVGContainer.dataset.animated = false

        // deploy svg animation
        const waypointsPromise = app.loadWaypoint()
        const deploySVGAnimation = () => {
          const svgContainer = document.querySelectorAll('.inlineSVG')

          svgContainer.forEach(el => {
            new Waypoint.Inview({
              element: el,
              enter() {
                const paths = el.querySelectorAll('.svg_circles path')
                const animated = el.dataset.animated === 'true'

                if (!animated) {
                  anime({
                    targets: paths,
                    strokeDashoffset: [anime.setDashoffset, 0],
                    strokeWidth: [0, 14],
                    easing: 'easeInOutSine',
                    duration: 1000,
                    begin() {
                      el.style.visibility = 'visible'
                    },
                    delay: function (el, i) {
                      return i * 250
                    }
                  })
                  el.dataset.animated = true
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
:root
  --dot-borderColor: rgb(228,154,109)
  --singlePage-icon-color: rgb(228,154,109)

.pageTitle
  display: none

.singlePage
  counter-reset: modelNo
  &__context
    display: flex
    +mobile
      padding: 0
    +tablet
      padding: 0
    +belowTablet
      flex-flow: column nowrap
    +desktop
      padding: 0
      flex-flow: row nowrap
      > *
        flex-basis: 50%
    article
      background-color: #fff
      +mobile
        padding: 30px gutter()
      +tablet
        padding: 30px gutter()
      +desktop
        padding: 90px
        display: flex
        flex-flow: column nowrap
        justify-content: center
    h3
      margin-bottom: 10px
      font-size: px2rem(16)
      line-height: 1.5
      &::before
        content: '0'counter(modelNo)'.'
        counter-increment: modelNo
        font-family: 'Playfair Display','Helvetica Neue',Helvetica,Arial,sans-serif
        font-size: px2rem(33)
        color: #e49a6d
        margin-right: 3px
    p
      font-size: px2rem(15)
      + p
        padding-top: 80px
        position: relative
        font-size: px2rem(13)
        &::before
          +iconFont(basic1-147_target)
          +size(26px)
          color: rgb(228,154,109)
          display: block
          position: absolute
          z-index: 2
          left: 0
          top: 30px
          background-color: #fff
          line-height: 25px
        &::after
          +size(50%,0)
          content: ''
          border-top: 1px solid #efefef
          display: block
          position: absolute
          z-index: 1
          left: 0
          top: 40px
    .inlineSVG
      visibility: hidden
      +belowTablet
        padding: 20px
        display: flex
      +desktop
        padding: 50px
      svg
        +size(100%)
        max-height: 100vmin
        text,
        tspan
          text-anchor: middle
          font-size: 1em
        .companyName
          font-weight: 600
          font-size: 1.6em
          font-family: Poppins,'Helvetica Neue',Helvetica,Arial,sans-serif

#model01
  .singlePage__titleContainer
    border-bottom: 1px solid #efefef
  .singlePage__title
    &::after
      +iconFont(basic3-156_dna_structure_genome)
  +desktop
    #coreSVG
      order: 1
    article
      order: 2

[lang="zh-Hant"]
  #coreSVG,
  #NRDOSVG
    +mobile
      font-size: 70px
    +tablet
      font-size: 52px
    +desktop
      font-size: 52px

[lang="en"]
  #coreSVG,
  #NRDOSVG
    +mobile
      font-size: 48px
      font-weight: 600
    +tablet
      font-size: 48px
      font-weight: 600
    +desktop
      font-size: 46px
      text,
      tspan
        font-weight: 600
  #NRDOSVG
    .circleTitle
      font-size: 1.2em

#NRDOSVG
  .phases
    text
      font-size: 0.8em
  .circleTitle
    font-size: 1.4em

#model02
  .singlePage__titleContainer
    display: none
</style>
