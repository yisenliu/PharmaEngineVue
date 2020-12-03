<template>
  <Layout>
    <Hero v-bind="hero" :callback="callback.hero" />
    <Breadcrumb />
    <SinglePage v-if="loaded">
      <SinglePageSection id="eventsList" v-bind="eventsList.subject">
        <Tabs 
          :tabs="eventsList.tabs"
          :current-tab="currentTabId"
          @tab-click="onTabClick">
          <div 
            v-for="(event,index) in currentEvents"
            :key="index"
            class="event">
            <a :href="event.href">
              <img
                class="lazyload"
                :srcset="event.image"
                data-sizes="auto"
                alt />
              <h3>{{ event.heading }}</h3>
              <time :datetime="event.date">{{ event.date }}</time>
              <address>{{ event.address }}</address>
            </a>
          </div>
        </Tabs>
      </SinglePageSection>
      <SinglePageSection id="msgForm" v-bind="msgForm.subject">
        <FormTransition>
          <Form v-if="formStatus !== 'success'"
                id="leaveMsg"
                class="leaveMsg">
            <FormSelect
              v-model="msgForm.opinion.selected"
              v-bind="msgForm.opinion" />
            <FormInput
              v-model="msgForm.username.value"
              v-bind="msgForm.username" />
            <FormInput
              v-model="msgForm.company.value"
              v-bind="msgForm.company" />
            <FormInput
              v-model="msgForm.email.value"
              v-bind="msgForm.email"
              type="email" />
            <FormInput
              v-model="msgForm.meeting.value"
              v-bind="msgForm.meeting" />
            <FormTextarea
              v-model="msgForm.message.value"
              v-bind="msgForm.message" />
            <FormCaptcha
              v-bind="msgForm.captcha"
              @validate="onValidate" />
            <div v-if="isHuman" class="form__group">
              <Button
                type="button" 
                class="btnSubmit"
                :disabled="formStatus === 'submitting'"
                @click.prevent="onSubmitForm">
                {{ msgForm.submit.text }}
              </Button>
            </div>
          </Form>
          <div v-else class="form--success" v-html="msgForm.status.success">
          </div>
        </FormTransition>
      </SinglePageSection>
    </SinglePage>
    <InvestorsNav />
    <template #root>
      <Toast
        v-if="toast.show"
        v-bind="toast"
        @appear="onToastAppear"
        @disappear="onToastDisappear" />
    </template>
  </Layout>
</template>

<script>
import axios from 'axios'
import scrollDown from '@/assets/js/scrollDown'
import validate from '@/assets/js/validate'

import Breadcrumb from '@/components/Breadcrumb'
import Button from '@/components/Button'
import Form from '@/components/Form'
import FormCaptcha from '@/components/FormCaptcha'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import FormTextarea from '@/components/FormTextarea'
import FormTransition from '@/components/FormTransition'
import Hero from '@/components/Hero'
import InvestorsNav from '@/components/InvestorsNav'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
import Tabs from '@/components/Tabs'
import Toast from '@/components/Toast'

export default {
  components: {
    Breadcrumb,
    Button,
    Form,
    FormCaptcha,
    FormInput,
    FormSelect,
    FormTextarea,
    FormTransition,
    Hero,
    InvestorsNav,
    Layout,
    SinglePage,
    SinglePageSection,
    Tabs,
    Toast
  },
  data() {
    return {
      callback: {},
      currentTabId: '',
      htmlLang: '',
      docTitle: '',
      eventsList: {},
      eventsTimer: 0,
      formStatus: 'notReady',
      hero: {},
      isHuman: false,
      loaded: false,
      msgForm: {},
      msgFormData: new FormData(),
      toast: {
        show: false,
        message: '',
        status: '',
        onStart: null,
        afterShow: null,
        callback: null
      }
    }
  },
  computed: {
    currentEvents() {
      let targetTabObj = this.eventsList.tabs.find(tab => {
        return tab.id === this.currentTabId
      })
      return targetTabObj.content
    }
  },
  mounted() {
    axios
      .get('../db/events.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'callback', {
          hero() {
            scrollDown({
              trigger: '#heroScrollDown',
              target: '#eventsList'
            })
          }
        })
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'eventsList', data.eventsList)
        this.$set(this.eventsList, 'tabs', [
          {
            id: 'all',
            label: '全部',
            content: (() => {
              let _allEvents = []
              data.eventsList.tabs.forEach(el => {
                _allEvents = _allEvents.concat(el.content)
              })
              return _allEvents
            })()
          },
          ...data.eventsList.tabs
        ])
        this.$set(this, 'currentTabId', this.eventsList.tabs[0].id)
        this.$set(this, 'hero', data.hero)
        this.$set(this, 'msgForm', data.msgForm)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle
      })
      .catch(error => {
        console.log(JSON.stringify(error))
      })
  },
  methods: {
    onToastAppear(timeline) {
      const vm = this
      const form = this.msgForm
      const proxy = DEVELOPMENT
        ? ''
        : 'https://8924db21-fe4e-47e5-b216-dd82266e72c5.mock.pstmn.io'
      timeline.pause()
      axios({
        method: 'post',
        url: proxy + '/api/post?form=events',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: vm.msgFormData,
        timeout: 3000
      })
        .then(res => {
          if (res.status === 200) {
            vm.formStatus = 'submitted'
          } else {
            console.log(res.status)
          }
        })
        .catch(err => {
          if (err.code === 'ECONNABORTED') {
            vm.formStatus = 'notReady'
            vm.toast.status = 'warning'
            vm.toast.message = form.status.timeout
          } else {
            console.error(err)
          }
        })
        .finally(() => {
          timeline.play()
        })
    },
    onToastDisappear() {
      // const form = this.msgForm
      // if (this.toast.status === 'success') {
      //   // reset all fields
      //   form.opinion.selected = 1
      //   form.username.value = ''
      //   form.company.value = ''
      //   form.email.value = ''
      //   form.meeting.value = ''
      //   form.message.value = ''
      //   document.querySelector('#leaveMsg').reset()
      // }
      this.toast.show = false
      if (this.formStatus === 'submitted') {
        this.formStatus = 'success'
      }
    },
    onTabClick(tab) {
      const vm = this
      const tl = anime.timeline({
        duration: 250,
        easing: 'easeInOutSine'
      })
      tl.add({
        targets: '.event',
        opacity: 0,
        scale: 0,
        complete() {
          vm.currentTabId = tab.id
        }
      })

      tl.finished.then(() => {
        anime({
          targets: '.event',
          delay: anime.stagger(100),
          duration: 300,
          easing: 'easeInOutSine',
          opacity: [0, 1],
          scale: [0, 1]
        })
      })
    },
    onValidate(value) {
      this.isHuman = value
    },
    onSubmitForm() {
      const form = this.msgForm
      const fields = {
        username: form.username,
        email: form.email,
        message: form.message
      }
      let allValid = validate(fields)

      // no error happened, ready to submit
      if (allValid) {
        // customize and stringify json-data to post
        let data = {
          opinion: form.opinion.selected,
          username: form.username.value,
          company: form.company.value,
          email: form.email.value,
          meeting: form.meeting.value,
          message: form.message.value
        }
        this.msgFormData.set('data', JSON.stringify(data))

        this.formStatus = 'submitting'
        this.toast = {
          show: true,
          status: 'pending',
          message: form.status.pending
        }
      }
    }
  }
}
</script>

<style lang="sass">
$theme-color: #64b5f6

:root
  --tabs__item-active: #{$theme-color}
  --tabs__nav-bg: transparent
  --singlePage-icon-color: #{$theme-color}
  --form__control--focus-brColor: #{$theme-color}
  --footer-bg: #fff

.events
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
      
#eventsList
  .singlePage__titleContainer
    display: none
  .singlePage__context
    padding-top: 0
  .tabs
    +desktop
      max-width: 1340px
      margin: 0 auto
    &__item
      flex: 0 0 auto
      +mobile
        flex-grow: 1
    &__content
      padding-left: 0
      padding-right: 0
  .tabs__content
    +aboveTablet
      display: flex
      flex-flow: row wrap
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
          margin-top: gutter()
      +desktop
        width: span(4)
        margin-left: gutter()
        &:nth-child(3n+1)
          margin-left: 0
        &:nth-child(n+4)
          margin-top: 30px

.event
  overflow: hidden
  a
    +size(100%,240px)
    height: 240px
    position: relative
    padding: 30px
    display: grid
    grid-template:
      columns: 1fr
      rows: 1fr auto auto
      areas: 'title' 'time' 'address'
    grid-gap: 5px 0
    &::before
      +size(100%)
      content: ''
      background-color: rgba(#000,.6)
      transition: opacity get($time,normal) ease-out
      display: block
      position: absolute
      z-index: 1
      left: 0
      top: 0
    &:hover
      &::before
        opacity: 0
  img
    +size(100%)
    position: absolute
    z-index: 0
    left: 0
    top: 0
    object-position: center
    object-fit: cover
  h3,
  time,
  address  
    display: block
    color: #fff
    position: relative
    z-index: 1
  h3
    font-size: px2rem(18)
    justify-self: start
    margin: 0
  time,
  address
    font-size: px2rem(13)
    display: inline-flex
    justify-content: flex-start
    margin: 0
    line-height: px2rem(15)
    &::before
      +size(px2rem(15))
      font-size: px2rem(15)
      margin-right: 5px
  time
    &::before
      +iconFont(f073)
  address
    &::before
      +iconFont(basic1-017_location)

.leaveMsg
  +tablet
    display: flex
    flex-flow: row wrap
    align-items: flex-start
    > div:nth-of-type(2),
    > div:nth-of-type(3),
    > div:nth-of-type(4),
    > div:nth-of-type(5)
      color: green
      width: 48.0144404332%
    > div:nth-of-type(3),
    > div:nth-of-type(5)
      margin-left: 3.9711191336%
  +desktop
    display: flex
    flex-flow: row wrap
    align-items: flex-start
    width: span(8)
    margin: 0 auto
    > div:nth-of-type(2),
    > div:nth-of-type(3),
    > div:nth-of-type(4),
    > div:nth-of-type(5)
      color: green
      width: span(4 of 8)
    > div:nth-of-type(3),
    > div:nth-of-type(5)
      margin-left: gutter(of 8)
  textarea    
    min-height: 15em
  .btnSubmit
    margin: 0 auto
    display: block
    min-width: 9em
  
@keyframes rotateLoader
  100%
    transform: rotate(360deg)

#msgForm
  .singlePage__title
    &::after
      +iconFont(f073)

.form--success
  +desktop
    width: span(8)
    max-width: 1340px
    margin: 0 auto

</style>