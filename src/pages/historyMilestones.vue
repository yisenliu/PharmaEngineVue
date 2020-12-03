<template>
  <Layout>
    <Breadcrumb />
    <h1 class="pageTitle">
      {{ pageTitle }}
    </h1>
    <SinglePage v-if="loaded">
      <SinglePageSection v-for="milestone in milestones" :id="`ad${milestone.year}`" :key="milestone.year">
        <div class="milestone">
          <h2 class="milestone__year">
            {{ milestone.year }}
          </h2>
          <ul class="milestone__monthes">
            <li v-for="(item, index) in milestone.monthes" :key="index">
              <strong>{{ item.month }}</strong>
              <p>{{ item.desc }}</p>
            </li>
          </ul>
        </div>
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
      milestones: [],
      pageTitle: ''
    }
  },
  mounted() {
    axios
      .get('../db/historyMilestones.json')
      .then(res => {
        const data = res.data
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'milestones', data.milestones)
        this.$set(this, 'pageTitle', data.pageTitle)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle

        // Pace done
        app.paceDone = () => {
          waypointsPromise.then(() => {
            deployMilestoneWaypoints()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // milestone waypoints
        const deployMilestoneWaypoints = () => {
          const milestones = document.querySelectorAll('.milestone')

          milestones.forEach(milestone => {
            new Waypoint.Inview({
              element: milestone,
              enter: function () {
                milestone.addClass('active')
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
.historyMilestones
  .singlePage__context
    background-color: #fff
  .singlePage__section
    + .singlePage__section
      margin-top: -80px

.pageTitle
  display: none

.singlePage
  > :nth-child(odd)
    .milestone__year
      transform: translateX(100%)
    .milestone__monthes
      transform: translateX(100%)
      border-left: 3px solid $primary
      +desktop
        margin-left: 30px
  > :nth-child(even)
    .milestone__year
      transform: translateX(-100%)
      +desktop
        order: 2
    .milestone__monthes
      transform: translateX(-100%)
      border-right: 3px solid $primary
      +desktop
        margin-right: 30px

.milestone
  +desktop
    display: inline-flex
    width: 100%
  &.active
    .milestone__year,
    .milestone__monthes
      opacity: 1
      transform: translateX(0)
  &__year
    font-family: 'Playfair Display', serif
    font-size: px2rem(40)
    color: $primary
    background-color: #141618
    display: grid
    place-items: center
    padding: 80px
    margin: 0
    opacity: 0
    transition: get($time,normal) ease-out
    transition-property: opacity, transform
    +aboveTablet
      min-height: 400px
    +mobile
      font-size: px2rem(40)
    +tablet
      font-size: px2rem(50)
    +desktop
      font-size: px2rem(60)
      width: span(3)
  &__monthes
    @extend %list-style-none
    opacity: 0
    transition: get($time,normal) get($time,fast) ease-out
    transition-property: opacity, transform
    background-color: #fcfcfc
    line-height: get($line-height,l)
    flex-grow: 1
    display: flex
    flex-flow: column nowrap
    justify-content: center
    +aboveTablet
      min-height: 500px
    +mobile
      margin-top: gutter()
      padding: 30px 30px
    +tablet
      margin-top: gutter()
      padding: 30px 30px
    +desktop
      padding: 80px
    li
      display: inline-flex
      + li
        margin-top: 30px
  strong
    color: #89c243
    font-weight: 600
    margin-right: 10px
    font-size: px2rem(15)
    &::before
      +iconFont(basic2-201_ship_anchor_navy)
      margin-right: 5px
  p
    padding: 0
</style>
