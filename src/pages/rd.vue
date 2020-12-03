<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection
        id="ourRDProject"
        v-bind="ourRDProject.subject">
        <div class="projects">
          <div 
            v-for="(project,i) in ourRDProject.projects"
            :key="i"
            class="project">          
            <a :href="project.href">
              <img :srcset="project.image" :sizes="`${mobile} 100px,200px`" alt="" />
              <h3>{{ project.heading }}</h3>
              <p>{{ project.desc }}</p>
            </a>
          </div>
        </div>
      </SinglePageSection>
      <SinglePageSection
        id="indicationsDevelopmentStage"
        v-bind="indicationsDevelopmentStage.subject">
        <IDSStages :stages="indicationsDevelopmentStage.stages" />
        <div 
          v-for="(indications,i) in indicationsDevelopmentStage.indications"             
          :key="i"
          class="IDS__indications"
          :style="{'--indications-theme-color': indications.themeColor}">
          <h3 class="IDS__indications__pdtName">
            {{ indications.productName }}
            <small>{{ indications.subtitle }}</small>
          </h3>
          <IDSIndication             
            :name="indications.indicationName"
            :current-stage="indications.currentStage"
            :stage-name="indications.stageName" />
          <Accordion v-slot:default="{content}" :items="indications.more">
            <IDSIndication 
              v-for="(indication,j) in content.list"
              :key="j"
              v-bind="indication" />              
            <p v-if="content.comment" class="IDS__indication__comment">
              {{ content.comment }}
            </p>
          </Accordion>
        </div>
      </SinglePageSection>
      <SinglePageSection
        id="nounExplanationConnection"
        v-bind="nounExplanationConnection.subject">
        <div class="nounExplanations">
          <div 
            v-for="(noun,i) in nounExplanationConnection.nounExplanations"
            :key="i"
            class="noun">
            <h3>{{ noun.name }}</h3>
            <template v-for="(exp,j) in noun.desc">
              <p :key="'exp'+j">
                {{ exp }}
              </p>
            </template>
          </div>
        </div>
        <ul v-if="nounExplanationConnection.links.length" class="links">
          <li v-for="(link,index) in nounExplanationConnection.links" :key="index">
            <a 
              :rel="link.target==='_blank' ? 'noreferrer' : false" 
              :href="link.href"
              :target="link.target==='_blank' ? link.target : false">
              {{ link.text }}
            </a>
          </li>
        </ul>
      </SinglePageSection>
    </SinglePage>
  </Layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'

import Accordion from '@/components/Accordion'
import Breadcrumb from '@/components/Breadcrumb'
import Hero from '@/components/Hero'
import IDSIndication from '@/components/IDSIndication'
import IDSStages from '@/components/IDSStages'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
import {
  deployStages,
  deployIndicationsCurrentStages,
  initStages
} from '@/assets/js/indicationsDevelopmentStage.js'

export default {
  components: {
    Accordion,
    Breadcrumb,
    Hero,
    IDSIndication,
    IDSStages,
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
      indicationsDevelopmentStage: {},
      loaded: false,
      mobile: MOBILE,
      nounExplanationConnection: {},
      ourRDProject: {},
      singlePage: {}
    }
  },
  mounted() {
    axios
      .get('../db/rd.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#ourRDProject'
            })
          }
        })
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'hero', data.hero)
        this.$set(
          this,
          'indicationsDevelopmentStage',
          data.indicationsDevelopmentStage
        )
        this.$set(
          this,
          'nounExplanationConnection',
          data.nounExplanationConnection
        )
        this.$set(this, 'ourRDProject', data.ourRDProject)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            indicationsDevelopmentStage() {},
            nounExplanationConnection() {},
            ourRDProject() {}
          }
        })
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
        document.querySelector('#header').addClass('header--transparent')

        // Pace done
        app.paceDone = () => {
          initStages()
          deployStages()
          waypointsPromise.then(() => {
            this.$refs.sp.deploy()
            deployNounWaypoints()
            deployLinksWaypoints()
            deployIndicationsCurrentStages()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()

        // noun explanations waypoints
        const deployNounWaypoints = () => {
          const nouns = document.querySelectorAll('.noun')

          nouns.forEach((el, index) => {
            new Waypoint.Inview({
              element: el,
              group: 'nouns',
              enter() {
                setTimeout(() => {
                  el.addClass('active')
                }, index * 100)
              }
            })
          })
        }

        // links waypoints
        const deployLinksWaypoints = () => {
          const links = document.querySelectorAll('.links li')

          links.forEach((el, index) => {
            new Waypoint.Inview({
              element: el,
              group: 'links',
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
  }
}
</script>

<style lang="sass">
:root
  --footer-bg: #fff
  
.rd
  .hero
    &::before
      +size(100%)  
      content: ''
      display: block
      position: absolute
      left: 0
      top: 0
      z-index: 1
      opacity: .78
      background-image: linear-gradient(166deg,#5af07f 0%, #14967c 80%)
  #main
    overflow: visible

#indicationsDevelopmentStage
  .singlePage
    &__title
      &::after
        +iconFont(basic2-236_graph_pie_chart)
    &__context
      padding: 0 0 80px 0

#nounExplanationConnection
  .singlePage
    &__title
      &::after
        +iconFont(glyphicons-basic-63-paperclip)

#ourRDProject
  .singlePage__title
    &::after
      +iconFont(basic3-064_database)
  .singlePage__context
    background-color: #fff
    padding-top: 0

.links,
.nounExplanations,
.projects
  max-width: 1340px
  margin: 0 auto

.links
  @extend %list-style-none
  display: flex
  flex-flow: row wrap  
  margin-top: 80px
  li
    flex: 1 0 auto
    opacity: 0
    transform: translateY(50%)
    transition: get($time,normal) ease-out
    &.active
      opacity: 1
      transform: translateY(0)
    +mobile
      width: 100%
      + li
        margin-top: 30px
    +tablet
      width: span(1 of 3)
      margin-left: gutter(of 3)
      &:nth-child(3n+1)
        margin-left: 0
      &:nth-child(n+4)
        margin-top: gutter()
    +desktop
      width: span(4)
      margin-left: gutter()
      &:nth-child(3n+1)
        margin-left: 0
      &:nth-child(n+4)
        margin-top: gutter()
  a
    display: inline-flex
    flex-flow: row nowrap
    justify-content: flex-start
    align-items: center
    font-size: px2rem(13)
    font-weight: 600
    &::before
      +size(54px)
      +iconFont(basic2-055_world_international)
      border-radius: 50%
      background-color: #fff
      font-size: px2rem(24)
      margin-right: 10px
      color: $primary
      text-align: center
      line-height: 54px
      flex: 0 0 auto

.projects
  display: flex
  flex-flow: row wrap
  > div
    flex: 1 0 auto
    +mobile
      width: 100%
      + div
        margin-top: 50px
    +tablet
      width: span(4)
      &:nth-child(even)
        margin-left: gutter()
      &:nth-child(n+3)
        margin-top: 50px
    +desktop
      width: span(6)
      &:nth-child(even)
        margin-left: gutter()
      &:nth-child(n+3)
        margin-top: 50px

.project
  a
    width: 100%
    display: block
  h3
    margin: 0
    font-size: px2rem(16)
  p
    margin: 10px 0 0
    padding: 0
  img
    margin-right: 10px
    float: left
    width: 15vw
    min-width: 100px
    max-width: 200px

.header__pinned
  + #main
    .IDS__stages
      +desktop
        top: get($header-height, desktop)

.IDS__indications
  .accordion
    +mobile
      margin-top: 50px
    &__label
      padding-left: 0
    &__content
      padding: 0

.nounExplanations
  display: flex
  flex-flow: row wrap
  counter-reset: nounNo
  > div
    flex: 1 0 auto
    +mobile
      width: 100%
      + div
        margin-top: gutter()
    +tablet
      width: 100%
      + div
        margin-top: gutter()
    +desktop
      width: span(4)
      margin-left: gutter()
      &:nth-child(3n+1)
        margin-left: 0
      &:nth-child(n+4)
        margin-top: gutter()

.noun
  padding: 30px
  background-color: #fff
  opacity: 0
  transform: translateY(50%)
  transition: get($time,normal) ease-out
  &.active
    opacity: 1
    transform: translateY(0)
  +belowTablet
    width: 100%
  +desktop
    width: span(4)
  h3
    font-size: px2rem(16)
    margin: 0
    &::before
      content: '0'counter(nounNo)'.'
      counter-increment: nounNo
      color: $primary
      font-family: "Playfair Display","Helvetica Neue",Helvetica,Arial,sans-serif
      font-size: px2rem(33)
      margin-right: 3px
  p
    color: #556270
    font-size: px2rem(15)
    margin-top: 20px
    padding: 0

</style>