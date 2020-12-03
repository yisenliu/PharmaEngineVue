<template>
  <Layout>
    <Breadcrumb />
    <h1 class="pageTitle">
      {{ pageTitle }}
    </h1>
    <SinglePage v-if="loaded" ref="sp" v-bind="singlePage">
      <SinglePageSection id="employeeWelfareInsurance" v-bind="employeeWelfareInsurance.subject">
        <div class="context">
          <div class="context__titlebar">
            <h2>{{ employeeWelfareInsurance.heading }}</h2>
            <p>{{ employeeWelfareInsurance.desc }}</p>
          </div>
          <div class="context__content">
            <ul class="welfare">
              <li 
                v-for="(item,index) in employeeWelfareInsurance.welfares"
                :key="index"
                v-html="item">
              </li>
            </ul>
          </div>
        </div>
      </SinglePageSection>
      <SinglePageSection id="educationTraining" v-bind="educationTraining.subject">
        <div class="context">
          <div class="context__titlebar">
            <h2>{{ educationTraining.heading }}</h2>
            <p>{{ educationTraining.desc }}</p>
          </div>
          <div class="context__content">
            <ul class="trainingTypes">
              <li 
                v-for="(item,index) in educationTraining.trainingTypes"
                :key="index"
                v-html="item">
              </li>
            </ul>
          </div>
        </div>
      </SinglePageSection>
      <SinglePageSection id="retirementSystem" v-bind="retirementSystem.subject">
        <div class="context">
          <div class="context__titlebar">
            <h2>{{ retirementSystem.heading }}</h2>
            <p>{{ retirementSystem.desc }}</p>
          </div>
          <div class="context__content"></div>
        </div>
      </SinglePageSection>
      <SinglePageSection id="safeguard" v-bind="safeguard.subject">
        <Accordion id="safeguardItems" v-slot:default="{content}" :items="safeguard.items">
          <p v-for="(item,j) in content" :key="'ad__content'+j">
            {{ item }}
          </p>
        </Accordion>
      </SinglePageSection>
      <SinglePageSection id="resume" v-bind="resume.subject">
        <template #preTitle>
          <Button v-bind="resume.IWantToApply"
                  class="applyBtn"
                  target="_blank"
                  rel="noreferrer" />
        </template>
        <template #default>
          <FormTransition>
            <Form v-if="formStatus !== 'success'"
                  id="applyForm"
                  class="applyForm">
              <FormSelect
                v-model="resume.form.opinion.selected"
                v-bind="resume.form.opinion" />
              <FormInput
                v-model="resume.form.username.value"
                v-bind="resume.form.username" />
              <FormInput
                v-model="resume.form.education.value"
                v-bind="resume.form.education" />
              <FormInput
                v-model="resume.form.email.value"
                v-bind="resume.form.email"
                type="email" />
              <FormInput
                v-bind="resume.form.uploadResume"
                type="file"
                accept=".pdf"
                @change="onFileChange($event)" />
              <FormTextarea
                v-model="resume.form.position.value"
                v-bind="resume.form.position" />
              <FormCaptcha
                v-bind="resume.form.captcha"
                @validate="onValidate" />
              <div v-if="isHuman" class="form__group">
                <Button
                  type="button" 
                  class="btnSubmit"
                  :disabled="formStatus === 'submitting'"
                  @click.prevent="onSubmitForm">
                  {{ resume.form.submit.text }}
                </Button>
              </div>
            </Form>
            <div v-else class="form--success" v-html="resume.form.status.success">
            </div>
          </FormTransition>
        </template>
      </SinglePageSection>
    </SinglePage>
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
import validate from '@/assets/js/validate'

import Accordion from '@/components/Accordion'
import Breadcrumb from '@/components/Breadcrumb'
import Button from '@/components/Button'
import Form from '@/components/Form'
import FormCaptcha from '@/components/FormCaptcha'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import FormTextarea from '@/components/FormTextarea'
import FormTransition from '@/components/FormTransition'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
import Toast from '@/components/Toast'

export default {
  components: {
    Accordion,
    Breadcrumb,
    Button,
    Form,
    FormCaptcha,
    FormInput,
    FormSelect,
    FormTextarea,
    FormTransition,
    Layout,
    SinglePage,
    SinglePageSection,
    Toast
  },
  data() {
    return {
      htmlLang: '',
      docTitle: '',
      employeeWelfareInsurance: {},
      educationTraining: {},
      formData: new FormData(),
      formStatus: 'notReady',
      isHuman: false,
      loaded: false,
      pageTitle: '',
      retirementSystem: {},
      resume: {},
      safeguard: {},
      singlePage: {},
      toast: {
        show: false,
        message: '',
        status: ''
      }
    }
  },
  mounted() {
    axios
      .get('../db/career.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(
          this,
          'employeeWelfareInsurance',
          data.employeeWelfareInsurance
        )
        this.$set(this, 'educationTraining', data.educationTraining)
        this.$set(this, 'retirementSystem', data.retirementSystem)
        this.$set(this, 'safeguard', data.safeguard)
        this.$set(this, 'resume', data.resume)
        this.$set(this, 'pageTitle', data.pageTitle)
        this.$set(this, 'loaded', true)
      })
      .then(() => {
        this.$set(this, 'singlePage', {
          enter: {
            employeeWelfareInsurance() {
              document.querySelector('.singlePage__nav').addClass('light')
              document
                .querySelector('#employeeWelfareInsurance')
                .addClass('active')
            },
            educationTraining() {
              document.querySelector('.singlePage__nav').addClass('light')
              document.querySelector('#educationTraining').addClass('active')
            },
            retirementSystem() {
              document.querySelector('.singlePage__nav').addClass('light')
              document.querySelector('#retirementSystem').addClass('active')
            },
            safeguard() {
              document.querySelector('.singlePage__nav').removeClass('light')
            }
          },
          exit: sectionElement => {
            if (sectionElement.id === 'safeguard') {
              document.querySelector('.singlePage__nav').removeClass('light')
            }
          }
        })
        document.documentElement.lang = this.htmlLang
        document.title = this.docTitle

        // Pace done
        app.paceDone = () => {
          waypointsPromise.then(() => {
            this.$refs.sp.deploy()
          })
        }

        // single page waypoints
        const waypointsPromise = app.loadWaypoint()
      })
      .catch(error => {
        console.log(JSON.stringify(error))
      })
  },
  methods: {
    onToastAppear(timeline) {
      const vm = this
      const form = this.resume.form
      const proxy = DEVELOPMENT
        ? ''
        : 'https://8924db21-fe4e-47e5-b216-dd82266e72c5.mock.pstmn.io'
      timeline.pause()
      axios({
        method: 'post',
        url: proxy + '/api/post?form=career',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: vm.formData,
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
      // const form = this.resume.form
      // if (this.toast.status === 'success') {
      //   // reset all fields
      //   form.opinion.selected = 1
      //   form.username.value = ''
      //   form.education.value = ''
      //   form.email.value = ''
      //   form.position.value = ''
      //   document.querySelector('#applyForm').reset()
      // }
      this.toast.show = false
      if (this.formStatus === 'submitted') {
        this.formStatus = 'success'
      }
    },
    onFileChange(event) {
      this.formData.set('file', event.target.files[0])
      console.log(event.target.files[0])
    },
    onValidate(value) {
      this.isHuman = value
    },
    onSubmitForm() {
      const form = this.resume.form
      const fields = {
        username: form.username,
        email: form.email,
        position: form.position
      }
      let allValid = validate(fields)

      // no error happened, ready to submit
      if (allValid) {
        // customize and stringify json-data to post
        let data = {
          opinion: form.opinion.selected,
          username: form.username.value,
          education: form.education.value,
          email: form.email.value,
          position: form.position.value
        }
        this.formData.set('data', JSON.stringify(data))

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
:root
  --footer-bg: #fff

.career  
  .singlePage
    counter-reset: contextNo
    background-color: #f7f7f7

.applyBtn
  margin: 80px 0
  +mobile
    width: 100%
  +aboveTablet
    position: relative
    left: 50%
    transform: translateX(-50%)

.applyForm
  +aboveTablet
    display: flex
    flex-flow: row wrap
    justify-content: space-between
    > div
      &:first-of-type,
      &:nth-of-type(n+6)
        width: 100%
  +tablet
    width: span(8)
    > div
      width: span(4)
  +desktop
    width: span(8)
    max-width: 1340px
    margin: 0 auto
    > div
      width: span(4 of 8)
  h2
    font-size: px2rem(18)
    padding-bottom: 50px
    border-bottom: 1px solid #efefef
    width: 100%
  textarea
    height: 10em
  .form__control
    width: 100%
  .btnSubmit
    margin: 0 auto
    display: block
    min-width: 9em
    +mobile
      width: 100%
  
@keyframes rotateLoader
  100%
    transform: rotate(360deg)

.context
  +desktop
    display: inline-flex
    width: 100%
  p
    padding: 0
  &__titlebar
    display: flex
    flex-flow: column nowrap
    justify-content: center
    background-color: #68717B
    +belowTablet
      padding: 30px
      min-height: 400px
    +desktop
      width: span(4)
      padding: 80px
      min-height: 500px
    h2
      color: #fff
      font-size: px2rem(17)
      margin: 0 0 20px 0
      &::before
        content: '0'counter(contextNo)'.'
        counter-increment: contextNo
        font-family: 'Playfair Display',serif
        color: $primary
        font-weight: 600
        display: block
        margin-bottom: 20px
        +mobile
          font-size: px2rem(40)
        +tablet
          font-size: px2rem(50)
        +desktop
          font-size: px2rem(60)
    p
      color: #d6d6d6
  &__content
    +mobile
      padding: 80px 30px
      margin-top: gutter()
      min-height: 400px
    +tablet
      padding: 80px 30px
      margin-top: gutter()
    +desktop
      width: span(8)
      padding: 80px
      display: flex
      align-items: center
      justify-content: stretch
    ul
      @extend %list-style-none
      color: #fff
      +desktop
        display: flex
        flex-flow: row wrap
        width: 100%
      li
        padding-left: 2.3em
        position: relative
        font-size: px2rem(13)
        font-weight: 600
        &::before
          +iconFont(basic1-137_bookmark)
          font-size: px2rem(24)
          font-weight: 400
          color: $primary
          display: inline-block
          position: absolute
          left: 0
          top: -8px
        +belowTablet
          + li
            margin-top: 30px
      p
        margin-top: 10px

.pageTitle
  display: none
    
#employeeWelfareInsurance,
#educationTraining
  .singlePage__context
    padding-bottom: 0

#educationTraining,
#retirementSystem
  .singlePage__context
    +mobile
      padding-top: gutter()
    +tablet
      padding-top: gutter()
    +desktop
      padding-top: gutter()

#employeeWelfareInsurance,
#retirementSystem
  &.active
    .context__content,
    .context__titlebar
      opacity: 1
      transform: translateX(0)
  .context__content,
  .context__titlebar
    opacity: 0
    transform: translateX(50%)
    transition: get($time,slow) ease-out
    transition-property: opacity, transform

#employeeWelfareInsurance
  .context__content
    background: linear-gradient(0deg,rgba(32,24,27,0.4) 0%, rgba(32,24,27,0.4) 100%), url('~@/assets/responsiveImages/pixta_28940573_M.jpg?size=1125') center center / cover no-repeat
    +desktop
      margin-left: gutter()
  .welfare
    li
      +desktop
        width: 32%
        margin-left: 2%
        &:nth-child(3n+1)
          margin-left: 0
        &:nth-child(n+4)
          margin-top: 30px
  
#educationTraining
  border-top: none
  &.active
    .context__content,
    .context__titlebar
      opacity: 1
      transform: translateX(0)
  .context__content,
  .context__titlebar
    opacity: 0
    transform: translateX(-50%)
    transition: get($time,slow) ease-out
    transition-property: opacity, transform
  .context__content
    background: linear-gradient(0deg,rgba(32,24,27,0.4) 0%, rgba(32,24,27,0.4) 100%),url('~@/assets/responsiveImages/adam-przewoski-umchkHwkdyM-unsplash.jpg?size=1125') center center / cover no-repeat
    +desktop
      margin-right: gutter()
  .context__titlebar
    +desktop
      order: 2
  .trainingTypes
    li
      +desktop
        flex: 1 0 50%
        &:nth-child(n+3)
          margin-top: 30px

#resume
  .singlePage__title
    &::after
      +iconFont(basic2-253_user_profile)

#retirementSystem
  border-top: none
  .context__content
    background: linear-gradient(0deg,rgba(32,24,27,0.4) 0%, rgba(32,24,27,0.4) 100%),url('~@/assets/responsiveImages/pixta_21794089_M.jpg?size=1125') center center / cover no-repeat
    +desktop
      margin-left: gutter()
      
#safeguard
  .singlePage__title
    &::after
      +iconFont(basic2-270_shield_security)

#safeguardItems
  > div
    &:nth-child(1),
    &:nth-child(3)
      &::before
        +iconFont(basic2-269_shield_security_virus)
    &:nth-child(5)
      &::before
        +iconFont(basic2-060_firewall)
    &:nth-child(7)
      &::before
        +iconFont(basic2-233_help)
  .accordion__label
    &::before
      +iconFont(basic2-269_shield_security_virus)
      color: #9fe14e
      font-size: px2rem(18)
      margin-right: 5px
      vertical-align: middle

.form--success  
  +desktop
    width: span(8)
    max-width: 1340px
    margin: 0 auto
</style>
