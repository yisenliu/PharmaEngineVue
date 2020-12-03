<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="stakeholder" v-bind="stakeholder.subject">
        <p>{{ stakeholder.context }}</p>
        <div class="chart"></div>
      </SinglePageSection>
      <SinglePageSection id="collectMajorThemes" v-bind="collectMajorThemes.subject">
        <p>{{ collectMajorThemes.context }}</p>
        <div class="chart"></div>
      </SinglePageSection>
      <SinglePageSection id="majorThemesBoundaries" v-bind="majorThemesBoundaries.subject">
        <p>{{ majorThemesBoundaries.context }}</p>
        <div class="table--responsive">
          <table>
            <thead>
              <tr>
                <th 
                  v-for="th in first3thInMajorThemesBoundaries"
                  :key="th"
                  rowspan="2"
                  v-html="th">
                </th>
                <th colspan="2" v-html="majorThemesBoundaries.table.thead[3]">
                </th>
              </tr>
              <tr>
                <th 
                  v-for="th in last2thInMajorThemesBoundaries"
                  :key="th"
                  v-html="th">
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(tr,index) in majorThemesBoundaries.table.tbody"
                :key="index">
                <td
                  v-for="td in tr"
                  :key="td"
                  v-html="td"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </SinglePageSection>
      <SinglePageSection id="identificationCommunication" v-bind="identificationCommunication.subject">
        <p>{{ identificationCommunication.context }}</p>
        <div class="table--responsive">
          <table>
            <caption>{{ identificationCommunication.table.caption }}</caption>
            <thead>
              <tr>
                <th 
                  v-for="th in identificationCommunication.table.thead"
                  :key="th">
                  {{ th }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(tr,i) in identificationCommunication.table.tbody"
                :key="i">
                <td
                  v-for="(td,j) in tr"
                  :key="j">
                  <template v-if="td instanceof Array">
                    <ul>
                      <li 
                        v-for="(item,k) in td"
                        :key="k">
                        {{ item }}
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    {{ td }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SinglePageSection>
      <SinglePageSection id="responseResponsibility" v-bind="responseResponsibility.subject">
        <p>{{ responseResponsibility.context }}</p>
        <div class="table--responsive">
          <table>
            <thead>
              <tr>
                <th 
                  v-for="th in responseResponsibility.table.thead" 
                  :key="th">
                  {{ th }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(td,i) in responseResponsibility.table.tbody" :key="i">
                <td v-html="td[0]"></td>
                <td>{{ td[1] }}</td>
                <td>
                  <ul class="responseSystem">
                    <li v-for="(item,j) in td[2]" :key="j">
                      {{ item.event }}
                      <span class="frequency">
                        {{ item.frequency }}
                      </span>
                    </li>
                  </ul>
                </td>
                <td>
                  <ul v-if="td[3] instanceof Array">
                    <li v-for="(item,k) in td[3]" :key="k">
                      {{ item }}
                    </li>
                  </ul>
                  <template v-else>
                    {{ td[3] }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SinglePageSection>
      <SinglePageSection id="feedbackReview" v-bind="feedbackReview.subject">
        <p>{{ feedbackReview.context }}</p>
      </SinglePageSection>
      <SinglePageSection id="improvement" v-bind="improvement.subject">
        <p>{{ improvement.context }}</p>
      </SinglePageSection>
    </SinglePage>
    <InvestorsNav />
  </Layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'

import Breadcrumb from '@/components/Breadcrumb'
import Hero from '@/components/Hero'
import InvestorsNav from '@/components/InvestorsNav'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
export default {
  components: {
    Breadcrumb,
    Hero,
    InvestorsNav,
    Layout,
    SinglePage,
    SinglePageSection
  },
  data() {
    return {
      callback: {},
      collectMajorThemes: {},
      htmlLang: '',
      docTitle: '',
      feedbackReview: {},
      hero: {},
      identificationCommunication: {},
      improvement: {},
      loaded: false,
      majorThemesBoundaries: {},
      pageTitle: '',
      responseResponsibility: {},
      singlePage: {},
      stakeholder: {}
    }
  },
  computed: {
    first3thInMajorThemesBoundaries() {
      return this.majorThemesBoundaries.table.thead.filter((item, index) => {
        return index < 3
      })
    },
    last2thInMajorThemesBoundaries() {
      return this.majorThemesBoundaries.table.thead.filter((item, index) => {
        return index >= 4
      })
    }
  },
  mounted() {
    axios
      .get('../db/stakeholder.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#stakeholder'
            })
          }
        })
        this.$set(this, 'collectMajorThemes', data.collectMajorThemes)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'feedbackReview', data.feedbackReview)
        this.$set(this, 'hero', data.hero)
        this.$set(
          this,
          'identificationCommunication',
          data.identificationCommunication
        )
        this.$set(this, 'improvement', data.improvement)
        this.$set(this, 'majorThemesBoundaries', data.majorThemesBoundaries)
        this.$set(this, 'responseResponsibility', data.responseResponsibility)
        this.$set(this, 'stakeholder', data.stakeholder)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            collectMajorThemes() {},
            feedbackReview() {},
            identificationCommunication() {},
            improvement() {},
            majorThemesBoundaries() {},
            responseResponsibility() {},
            stakeholder() {}
          }
        })
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
        document.querySelector('#header').addClass('header--transparent')

        // Pace done
        app.paceDone = () => {
          waypointsPromise.then(() => {
            this.$refs.sp.deploy()
            deployTableRows()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // table transition
        const deployTableRows = () => {
          const rows = document.querySelectorAll('.table--responsive tr')

          rows.forEach(row => {
            new Waypoint.Inview({
              element: row,
              group: 'rows',
              enter: function () {
                this.element.addClass('active')
              }
            })
          })
        }
      })
      .catch(error => {
        console.error(error)
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

.stakeholder
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
  .singlePage__context
    > *
      margin: 0 auto
      +desktop
        max-width: 1340px

#collectMajorThemes
  .singlePage__title
    &::after
      +iconFont(IcoMoon-172-magnet)
  .chart
    $ratio: 455 / 304
    margin: 15px auto 0
    background: url('~@/assets/images/majorThemesChart.svg') center center /contain no-repeat
    +mobile
      $width: 100%
      +size($width,0)
      padding-bottom: $width / $ratio
    +tablet
      $width: span(6)
      +size($width,0)
      padding-bottom: $width / $ratio
    +desktop
      $width: 600px
      +size($width,0)
      padding-bottom: $width / $ratio
      
#feedbackReview
  .singlePage__title
    &::after
      +iconFont(basic1-116_user_group)
      
#identificationCommunication
  .singlePage__title
    &::after
      +iconFont(basic1-114_user_man)
      
#improvement
  .singlePage__title
    &::after
      +iconFont(basic2-234_graph_up_chart)
      
#majorThemesBoundaries
  .singlePage__title
    &::after
      +iconFont(IcoMoon-180-target)
      
#responseResponsibility
  .singlePage__title
    &::after
      +iconFont(basic1-116_user_group)
      
#stakeholder
  .singlePage__title
    &::after
      +iconFont(basic1-116_user_group)
  .chart
    $ratio-landscape: 806 / 207
    $ratio-portrait: 207 / 806
    margin: 15px auto 0
    +mobile
      +size(span(2 wider),0)
      padding-bottom: span(2 wider) / $ratio-portrait
      background: url('~@/assets/images/stakeholderSteps-portrait.svg') center center / contain no-repeat
    +tablet
      $width: 100%
      +size($width,0)
      padding-bottom: $width / $ratio-landscape
    +desktop
      $width: span(10)
      +size($width,0)
      padding-bottom: $width / $ratio-landscape
    +aboveTablet
      background: url('~@/assets/images/stakeholderSteps-landscape.svg') center center /contain no-repeat

.table--responsive
  tbody
    td
      +belowTablet
        white-space: nowrap
    tr
      opacity: 0
      transition: all .6s ease-in-out
      transform-origin: left top
      transform: translateX(10%)
      &:nth-child(even)
        transition-delay: .2s
      &.active
        transform: translateX(0)
        opacity: 1    
  ul
    margin-top: 0
    margin-left: 0
    padding-left: 20px 

.response
  th,
  td
    &:nth-child(3)
      min-width: 20em
      white-space: normal
    
.responseSystem
  li
    position: relative
    padding-right: 6em
    min-width: 20em
    + li
      margin-top: 10px
  .frequency
    position: absolute
    top: 5px
    right: 0
    font-size: px2rem(13)
    color: #fff
    background-color: #556270
    display: inline-block
    padding: 0 10px
    border-radius: 4px    
</style>