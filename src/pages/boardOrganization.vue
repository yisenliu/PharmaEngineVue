<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="boardOrg" v-bind="boardOrg.subject">
        <div class="boardMembers">
          <BorderMember
            v-for="(member, index) in boardOrg.members"
            :key="index"
            v-bind="member" />
        </div>
      </SinglePageSection>
      <SinglePageSection
        v-if="lang == 'zh-hant'"
        id="boardData"
        v-bind="boardData.subject">
        <Tabs
          :tabs="boardData.tabs"
          :current-tab="currentTab"
          @tab-click="onTabClick">
          <component
            :is="currentTabComponent"
            :attachments="currentTabContent" />
        </Tabs>
      </SinglePageSection>
    </SinglePage>
  </Layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'

import BorderMember from '@/components/BorderMember'
import Breadcrumb from '@/components/Breadcrumb'
import Hero from '@/components/Hero'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
import Tabs from '@/components/Tabs'
import TabComponent from '@/components/TabComponent'

export default {
  components: {
    attach1: TabComponent,
    attach2: TabComponent,
    BorderMember,
    Breadcrumb,
    Hero,
    Layout,
    SinglePage,
    SinglePageSection,
    Tabs
  },
  data() {
    return {
      boardData: {},
      boardOrg: {},
      callback: {},
      htmlLang: '',
      docTitle: '',
      currentTab: '',
      currentTabContent: [],
      hero: {},
      lang: document.documentElement.lang.toLowerCase(),
      loaded: false,
      singlePage: {}
    }
  },
  computed: {
    currentTabComponent() {
      return this.currentTab
    }
  },
  mounted() {
    axios
      .get('../db/boardOrganization.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'boardData', data.boardData)
        this.$set(this, 'boardOrg', data.boardOrg)
        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#boardOrg'
            })
          }
        })
        this.$set(this, 'currentTab', data.boardData.tabs[0].id)
        this.$set(this, 'currentTabContent', data.boardData.tabs[0].content)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            boardOrg() {},
            boardData() {}
          }
        })
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
        document.querySelector('#header').addClass('header--transparent')

        // Pace done
        app.paceDone = () => {
          waypointsPromise.then(() => {
            this.$refs.sp.deploy()
            deployboardMemberWaypoints()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // Board Members waypoints
        const deployboardMemberWaypoints = () => {
          const boardMembers = document.querySelectorAll('.boardMember')

          boardMembers.forEach((el, index) => {
            new Waypoint.Inview({
              element: el,
              group: 'boardMembers',
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
  },
  methods: {
    onTabClick(tab) {
      this.currentTab = tab.id
      this.currentTabContent = tab.content
    }
  }
}
</script>

<style lang="sass">
$theme-color: #e49a6d

:root
  --header__not-top__linkColor: #fff
  --header__not-top__bgColor: #000
  --header__not-top__pinned__logo: url('~@/assets/images/pharmaEngine-neg-full-newtypo.svg')
  --footer-bg: #fff
  --tabs__item-active: #{$theme-color}
  --tabs__nav-bg: transparent
  --dot-borderColor: #{$theme-color}

.boardOrganization
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

.attachments
  @extend %list-style-none
  display: flex
  flex-flow: row wrap
  justify-content: flex-start
  +mobile
    flex-flow: column nowrap
    align-items: center
  li
    +mobile
      + li
        margin-top: 20px
    +tablet
      flex-basis: span(4)
      &:nth-child(2n+1)
        margin-left: gutter()
      &:nth-child(n+3)
        margin-top: 30px
    +desktop
      flex-basis: span(2 of 10)
      margin-left: gutter(of 10)
      &:nth-child(5n+1)
        margin-left: 0
      &:nth-child(n+6)
        margin-top: 30px
  a
    color: #000
    font-weight: 600
    position: relative
    display: inline-flex
    align-items: center
    font-size: px2rem(12)
    &::before
      +size(54px)
      +iconFont(IcoMoon-187-list)
      color: $theme-color
      font-size: px2rem(14)
      background-color: #fff
      border-radius: 50%
      display: flex
      align-items: center
      justify-content: center
      margin-right: 15px

#boardData
  .singlePage__title
    &::after
      +iconFont(basic2-263_download)
      color: $theme-color
  .tabs
    +desktop
      max-width: 1340px
      margin: 0 auto
    &__item
      flex: 0 0 auto

#boardOrg
  .singlePage__context
    background-color: #fff

.boardMembers
  display: flex
  flex-flow: row wrap
  +desktop
    max-width: 1340px
    margin: 0 auto
  > div
    +mobile
      width: 100%
      + div
        margin-top: 30px
    +tablet
      width: span(4)
      &:nth-child(2n+2)
        margin-left: gutter()
      &:nth-child(n+3)
        margin-top: 30px
    +desktop
      width: span(4)
      margin-left: gutter()
      &:nth-child(3n+1)
        margin-left: 0
      &:nth-child(n+4)
        margin-top: 30px

.boardMember
  text-align: center
  transition: all get($time,normal) ease-out
  opacity: 0
  transform: translateY(50%)
  &.active
    transform: translateY(0)
    opacity: 1
  &__name
    font-size: px2rem(18)
    margin-bottom: 0
  &__title
    font-size: px2rem(12)
    font-weight: 600
    &::after
      +size(100%,0)
      content: ''
      display: block
      border-bottom: 1px dotted $theme-color
      margin-top: 15px
  &__desc
    font-size: px2rem(15)
    text-align: left
</style>
