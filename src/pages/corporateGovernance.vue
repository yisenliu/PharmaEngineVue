<template>
  <Layout>
    <Breadcrumb />
    <h1 class="pageTitle">
      {{ pageTitle }}
    </h1>
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="regulations" v-bind="regulations.subject">
        <h2 class="contextTitle">
          {{ regulations.contextTitle }}
        </h2>
        <ul class="attachments">
          <li
            v-for="(file,index) in regulations.attachments"
            :key="index">
            <a :href="file.href">{{ file.text }}</a>
          </li>
        </ul>
      </SinglePageSection>
      <SinglePageSection id="committeeOrganization" v-bind="committeeOrganization.subject">
        <div class="committees">
          <div class="salaryCommitte">
            <h2 class="contextTitle">
              {{ committeeOrganization.salaryCommitte.title }}
            </h2>
            <ul class="attachments">
              <li
                v-for="(file,index) in committeeOrganization.salaryCommitte.attachments"
                :key="index">
                <a :href="file.href">{{ file.text }}</a>
              </li>
            </ul>
          </div>
          <div class="auditCommittee">
            <h2 class="contextTitle">
              {{ committeeOrganization.auditCommittee.title }}
            </h2>
            <ul class="attachments">
              <li
                v-for="(file,index) in committeeOrganization.auditCommittee.attachments"
                :key="index">
                <a :href="file.href">{{ file.text }}</a>
              </li>
            </ul>
          </div>
        </div>
      </SinglePageSection>
    </SinglePage>
    <InvestorsNav />
  </Layout>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'
import Layout from '@/components/Layout'
import InvestorsNav from '@/components/InvestorsNav'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
export default {
  components: {
    Breadcrumb,
    Layout,
    InvestorsNav,
    SinglePage,
    SinglePageSection
  },
  data() {
    return {
      committeeOrganization: {},
      htmlLang: '',
      docTitle: '',
      loaded: false,
      pageTitle: '',
      regulations: {},
      singlePage: {}
    }
  },
  mounted() {
    axios
      .get('../db/corporateGovernance.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'committeeOrganization', data.committeeOrganization)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'pageTitle', data.pageTitle)
        this.$set(this, 'regulations', data.regulations)
        this.$set(this, 'singlePage', {
          enter: {
            regulations() {
              const attachments = document.querySelectorAll(
                '#regulations .attachments li'
              )
              attachments.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            },
            committeeOrganization() {
              const attachments = document.querySelectorAll(
                '#committeeOrganization .attachments li'
              )
              attachments.forEach((el, index) => {
                setTimeout(() => {
                  el.addClass('active')
                }, (index + 1) * 150)
              })
            }
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
            document.querySelector('.singlePage__nav').addClass('light')
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()
      })
      .catch(error => {
        console.error(error)
      })
  }
}
</script>

<style lang="sass">

$theme-color: #2196f3

.corporateGovernance
  .singlePage__section
    position: relative
    &::before
      +triangle('up-left',30px, 30px ,#fff)
      content: ''
      position: absolute
      left: 0
      top: 0
      z-index: 1
  .singlePage__context
    background-color: rgba($theme-color,.6) 

.pageTitle
  display: none

#regulations
  +mobile
    background: url('~@/assets/responsiveImages/iStock-649495828.jpg?size=750') center center / cover no-repeat
  +tablet
    background: url('~@/assets/responsiveImages/iStock-649495828.jpg?size=1536') center center / cover no-repeat
  +desktop
    background: url('~@/assets/responsiveImages/iStock-649495828.jpg?size=1920') center center / cover no-repeat
  .attachments
    +desktop
      max-width: 1340px
    li
      +tablet
        width: span(2)
        margin-left: gutter()
        &:nth-child(4n+1)
          margin-left: 0
        &:nth-child(n+5)
          margin-top: 50px
      +desktop
        width: span(2)
        margin-left: gutter()
        &:nth-child(6n+1)
          margin-left: 0
        &:nth-child(n+7)
          margin-top: 50px

#committeeOrganization
  border: none
    
.attachments
  @extend %list-style-none
  display: flex
  flex-flow: row wrap
  +desktop
    margin: 0 auto
  li
    opacity: 0
    transform: translateY(50px)
    transition: get($time,normal) ease-out
    transition-property: opacity,transform
    &.active
      opacity: 1
      transform: translateY(0)
    +mobile
      width: 100%
      &:nth-child(n+2)
        margin-top: 40px
  a
    display: block
    color: #fff
    font-size: px2rem(13)
    font-weight: 600
    padding-left: 40px
    position: relative
    &::before
      +iconFont(glyphicons-basic-63-paperclip)
      font-size: px2rem(24)
      position: absolute
      left: 0
      top: -10px

.committees
  max-width: 1340px
  margin: 0 auto
  display: flex
  +mobile
    flex-direction: column
  > div
    +mobile
      width: 100%
      + div
        margin-top: 80px 
    +tablet
      &:nth-child(1)      
        width: span(5)
      &:nth-child(2)      
        width: span(3)
        margin-left: gutter()
    +desktop
      &:nth-child(1)      
        width: span(6)
      &:nth-child(2)      
        width: span(5)
        margin-left: span(1 wider)
          
.auditCommittee
  .attachments
    li
      +tablet
        width: 100%
        &:nth-child(n+2)
          margin-top: 30px
      +desktop
        width: 45%
        &:nth-child(even)
          margin-left: 10%
        &:nth-child(n+3)
          margin-top: 30px

.salaryCommitte
  .attachments
    li
      +tablet
        width: 45%
        &:nth-child(even)
          margin-left: 5%
        &:nth-child(n+3)
          margin-top: 30px
      +desktop
        width: span(2 of 6)
        margin-left: gutter(of 6)
        &:nth-child(3n+1)
          margin-left: 0
        &:nth-child(n+4)
          margin-top: 30px

.contextTitle
  margin: 0
  color: #fff
  text-align: center
  font-size: px2rem(20)
  width: 100%
  &::after
    +size(60%,0)
    content: ''
    border-bottom: 1px solid rgba(#fff,.32)
    display: block
    margin: 30px auto 40px

</style>