<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded">
      <SinglePageSection id="team">
        <div class="team">
          <div v-for="(member, index) in team.members" :key="index" class="team__member">
            <img 
              :data-srcset="member.image"
              data-sizes="auto"
              class="team__avator lazyload"
              alt="" />
            <h2 class="team__name">
              {{ member.name }}
            </h2>
            <p class="team__title">
              {{ member.title }}
            </p>
            <p class="team__desc">
              {{ member.desc }}
            </p>
          </div>
        </div>
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
      htmlLang: '',
      docTitle: '',
      hero: {},
      loaded: false,
      team: {}
    }
  },
  mounted() {
    axios
      .get('../db/managementTeam.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#team'
            })
          }
        })
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'team', data.team)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
        document.querySelector('#header').addClass('header--transparent')

        // Pace done
        app.paceDone = () => {
          waypointsPromise.then(() => {
            deployTeamWaypoints()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // team waypoints
        const deployTeamWaypoints = () => {
          const teamMember = document.querySelectorAll('.team__member')

          teamMember.forEach((el, index) => {
            new Waypoint.Inview({
              element: el,
              group: 'teamMember',
              enter: function () {
                setTimeout(() => {
                  this.element.addClass('active')
                }, index * 100)
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
  --header__not-top__linkColor: #fff
  --header__not-top__bgColor: #000
  --header__not-top__pinned__logo: url('~@/assets/images/pharmaEngine-neg-full-newtypo.svg')

.managementTeam
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

#team
  .singlePage__context
    background-color: #fff

.team
  display: flex
  flex-flow: row wrap
  > div
    +mobile
      width: 100%
      &:nth-child(n+2)
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
  &__member
    opacity: 0
    transform: translateY(10%)
    transition: get($time,normal) ease-out
    transition-property: opacity,transform
    &.active
      opacity: 1
      transform: translateY(0)
  &__avator
    object-fit: contain
    object-position: center
  &__name
    text-align: center
    margin: 20px 0 0 0
    font-size: px2rem(18)
  &__title
    text-align: center
    padding: 0
    margin: 0
    font-size: px2rem(12)
  &__desc
    padding: 20px 0 0 0
    margin: 20px 0 0 0
    &::before
      +size(100%,0)
      content: ''
      display: block
      border-top: 1px dotted #e49a6d
      margin-bottom: 20px
</style>
