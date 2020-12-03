<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="communicationWay" v-bind="communicationWay.subject">
        <ol>
          <li v-for="(content, index) in communicationWay.context" :key="index">
            {{ content }}
          </li>
        </ol>
      </SinglePageSection>
      <SinglePageSection id="communicationResult" v-bind="communicationResult.subject">
        <table v-for="(table, i) in communicationResult.tables" :key="i">
          <caption>
            {{
              table.caption
            }}
          </caption>
          <thead>
            <tr>
              <th v-for="(th, j) in table.th" :key="j">
                {{ th }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(td, k) in table.td" :key="k">
              <td>{{ td.date }}</td>
              <td>{{ td.issue }}</td>
              <td>{{ td.result }}</td>
            </tr>
          </tbody>
        </table>
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
      callback: {},
      communicationWay: {},
      communicationResult: {},
      htmlLang: '',
      docTitle: '',
      hero: {},
      loaded: false,
      singlePage: {}
    }
  },
  mounted() {
    axios
      .get('../db/IDCP.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#communicationWay'
            })
          }
        })
        this.$set(this, 'communicationWay', data.communicationWay)
        this.$set(this, 'communicationResult', data.communicationResult)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            communicationWay() {},
            communicationResult() {}
          }
        })
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
        document.querySelector('#header').addClass('header--transparent')

        // Pace done
        app.paceDone = () => {
          waypointsPromise.then(() => {
            this.$refs.sp.deploy()
            deployListWaypoints()
            deployTableWaypoints()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // table waypoints
        const deployListWaypoints = () => {
          const list = document.querySelectorAll('#communicationWay li')

          list.forEach(el => {
            new Waypoint.Inview({
              element: el,
              group: 'list',
              enter: function () {
                this.element.addClass('active')
              }
            })
          })
        }

        // table waypoints
        const deployTableWaypoints = () => {
          const rows = document.querySelectorAll('table tr')

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
        console.log(JSON.stringify(error))
      })
  }
}
</script>

<style lang="sass">
:root
  --footer-bg: #fff

.IDCP
  .hero
    &::before
      +size(100%)
      content: ''
      display: block
      position: absolute
      left: 0
      top: 0
      z-index: 1
      background-color: rgba(70,57,46,0.51)

#communicationWay,
#communicationResult
  .singlePage__title
    &::after
      +iconFont(glyphicons-basic-554-handshake)

#communicationWay
  li
    opacity: 0
    transform: translateY(50%)
    transition: all get($time,slow) ease-in-out
    &.active
      transform: translateY(0)
      opacity: 1
    + li
      margin-top: 30px

#communicationResult
  td,
  th
    &:first-child
      white-space: nowrap
  th
    +mobile
      display: none
  tbody
    tr
      opacity: 0
      transition: all get($time,slow) ease-in-out
      &:nth-child(odd)
        transform: translateX(-50%)
      &:nth-child(even)
        transform: translateX(50%)
      &.active
        transform: translateX(0)
        opacity: 1
      +mobile
        display: block
        + tr
          margin-top: 15px
        td
          display: block
          padding-left: 6em
          position: relative
          border-top: none
          &::before
            content: attr(data-th)
            position: absolute
            left: 15px
            top: 15px
            font-size: 13px
            opacity: 0.7
          + td
            &::after
              content: ''
              display: block
              width: calc(100% - 30px)
              height: 0
              border-top: 1px solid #efefef
              position: absolute
              left: 15px
              top: 0
</style>
