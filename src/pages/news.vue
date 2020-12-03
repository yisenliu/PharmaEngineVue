<template>
  <Layout>
    <Hero
      v-bind="hero"
      :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection
        id="news"
        v-bind="news.subject">
        <Tabs 
          id="list"
          :tabs="news.tabs"
          :current-tab="currentTabId"
          @tab-click="onTabClick">
          <div 
            v-for="(item,index) in currentNews"
            :key="index"
            class="brief">
            <a :href="item.href">
              <time :datetime="item.date">{{ item.date }}</time>
              <p>{{ item.brief }}</p>
              <img
                :srcset="item.image"
                :sizes="mobile.concat(' 0px,100px')"
                alt />
            </a>
          </div>
        </Tabs>
      </SinglePageSection>
    </SinglePage>
  </layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'

import Breadcrumb from '@/components/Breadcrumb'
import Hero from '@/components/Hero'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
import Tabs from '@/components/Tabs'

export default {
  components: {
    Breadcrumb,
    Hero,
    Layout,
    SinglePage,
    SinglePageSection,
    Tabs
  },
  data() {
    return {
      callback: {
        hero() {
          scrollDown({
            trigger: '#heroScrollDown',
            target: '#news'
          })
        }
      },
      currentTabId: '',
      htmlLang: '',
      docTitle: '',
      hero: {},
      loaded: false,
      mobile: MOBILE,
      news: {},
      singlePage: {}
    }
  },
  computed: {
    currentNews() {
      let targetTabObj = this.news.tabs.find(tab => {
        return tab.id === this.currentTabId
      })
      return targetTabObj.content
    }
  },
  mounted() {
    axios
      .get('../db/news.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'news', data.news)
        this.$set(this.news, 'tabs', [
          {
            id: 'all',
            label: '全部',
            content: (() => {
              let __allNews = []
              data.news.tabs.forEach(el => {
                __allNews = __allNews.concat(el.content)
              })
              return __allNews
            })()
          },
          ...data.news.tabs
        ])
        this.$set(this, 'currentTabId', this.news.tabs[0].id)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
        document.querySelector('#header').addClass('header--transparent')
      })
      .catch(error => {
        console.log(JSON.stringify(error))
      })
  },
  methods: {
    onTabClick(tab) {
      const vm = this
      const tl = anime.timeline({
        duration: 250,
        easing: 'easeInOutSine'
      })
      tl.add({
        targets: '.brief',
        opacity: 0,
        scale: 0,
        complete() {
          vm.currentTabId = tab.id
        }
      })

      tl.finished.then(() => {
        anime({
          targets: '.brief',
          delay: anime.stagger(100),
          duration: 300,
          easing: 'easeInOutSine',
          opacity: [0, 1],
          scale: [0, 1]
        })
      })
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
  --tabs__item-active: #{$theme-color}
  --tabs__nav-bg: transparent

.news
  .hero
    &::before
      +size(100%)  
      content: ''
      display: block
      position: absolute
      left: 0
      top: 0
      z-index: 1
      background-color: rgba(#000,.4)
  .singlePage__context
    padding-top: 0

#list
  .tabs__content
    +aboveTablet
      display: flex
      flex-flow: row wrap
    > div
      +mobile
        &:nth-child(n+2)
          margin-top: 20px
      +tablet
        width: span(4)
        &:nth-child(2n+2)
          margin-left: gutter()
      +desktop
        width: span(6)
        &:nth-child(2n+2)
          margin-left: gutter()
      +aboveTablet
        &:nth-child(n+3)
          margin-top: 20px

#news
  .singlePage__titleContainer
    display: none
  .tabs
    +desktop
      max-width: 1340px
      margin: 0 auto
    &__item
      flex: 0 0 auto
    
.brief
  border-bottom: 1px solid #efefef
  padding-bottom: 20px
  a
    width: 100%
    display: grid
    grid-template:
      columns: 1fr auto
      rows: 1fr auto
      areas: 'time time' 'desc img'
    grid-gap: 0
  time
    grid-area: time
    display: flex
    align-items: center
    color: $gray-600
    &::before
      +iconFont(basic1-013_time_clock)
      color: $gray-500
      vertical-align: middle
      margin-right: 5px
  img
    grid-area: img
    +mobile
      display: none
    +tablet
      width: 13vw
      height: auto
      margin-left: 20px
    +desktop
      width: 100px
      height: auto
      margin-left: 20px
</style>
