<template>
  <Layout>
    <Breadcrumb />
    <h1 class="pageTitle">
      {{ pageTitle }}
    </h1>
    <SinglePage v-if="loaded">
      <SinglePageSection>
        <template #surffixTitle>
          <div class="titleBar">
            <span v-html="titleBar.subject"></span>
            <a
              :href="titleBar.href"
              target="_blank"
              rel="noreferrer">
              <img
                :srcset="titleBar.image"
                :sizes="desktop.concat(' 60vw, 100vw')"
                alt />
            </a>
          </div>
        </template>
        <template #default>
          <FormTransition>
            <Form v-if="formStatus !== 'success'"
                  id="contactForm"
                  class="contactForm">
              <h2>{{ form.legend }}</h2>
              <FormSelect
                v-model="form.opinion.selected"
                v-bind="form.opinion" />
              <FormInput
                v-model="form.username.value"
                v-bind="form.username" />
              <FormInput
                v-model="form.company.value"
                v-bind="form.company" />
              <FormInput
                v-model="form.email.value"
                v-bind="form.email"
                type="email" />
              <FormTelInput
                v-model="form.phone.value"
                v-bind="form.phone"
                @input="onTelInput" />
              <FormSelect
                v-model="form.companyLocation.selected"
                v-bind="form.companyLocation" />
              <FormTextarea
                v-model="form.message.value"
                v-bind="form.message" />
              <FormCaptcha
                v-bind="form.captcha"
                @validate="onValidate" />
              <div v-if="isHuman" class="form__group">
                <Button
                  type="button" 
                  class="btnSubmit"
                  :disabled="formStatus === 'submitting'"
                  @click.prevent="onSubmitForm">
                  {{ form.submit.text }}
                </Button>
              </div>
            </Form>
            <div v-else class="form--success" v-html="form.status.success">
            </div>
          </FormTransition>
          <div class="contactInfo">
            <h2>{{ contactInfo.title1 }}</h2>
            <address v-html="contactInfo.address"></address>
            <h2>{{ contactInfo.title2 }}</h2>
            <p>{{ contactInfo.phone }}</p>
            <p>{{ contactInfo.fax }}</p>
            <p>
              <a :href="`mailto:` + contactInfo.email">
                {{ contactInfo.email }}
              </a>
            </p>
          </div>
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

import Breadcrumb from '@/components/Breadcrumb'
import Button from '@/components/Button'
import Form from '@/components/Form'
import FormCaptcha from '@/components/FormCaptcha'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import FormTelInput from '@/components/FormTelInput'
import FormTextarea from '@/components/FormTextarea'
import FormTransition from '@/components/FormTransition'
import Layout from '@/components/Layout'
import SinglePage from '@/components/SinglePage'
import SinglePageSection from '@/components/SinglePageSection'
import Toast from '@/components/Toast'

export default {
  components: {
    Breadcrumb,
    Button,
    Form,
    FormCaptcha,
    FormInput,
    FormSelect,
    FormTelInput,
    FormTextarea,
    FormTransition,
    Layout,
    SinglePage,
    SinglePageSection,
    Toast
  },
  data() {
    return {
      contactInfo: {},
      desktop: DESKTOP,
      docTitle: '',
      form: {},
      formData: new FormData(),
      formStatus: 'notReady',
      htmlLang: '',
      isHuman: false,
      loaded: false,
      pageTitle: '',
      titleBar: {},
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
  mounted() {
    axios
      .get('../db/contact.json')
      .then(res => {
        const data = res.data

        this.$set(this, 'contactInfo', data.contactInfo)
        this.$set(this, 'docTitle', data.docTitle)
        this.$set(this, 'htmlLang', data.htmlLang)
        this.$set(this, 'form', data.form)
        this.$set(this, 'pageTitle', data.pageTitle)
        this.$set(this, 'titleBar', data.titleBar)
        this.$set(this, 'toast', {
          show: false,
          message: '',
          status: ''
        })
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
      const form = this.form
      const proxy = DEVELOPMENT
        ? ''
        : 'https://8924db21-fe4e-47e5-b216-dd82266e72c5.mock.pstmn.io'
      timeline.pause()
      axios({
        method: 'post',
        url: proxy + '/api/post?form=contact',
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
      // const form = this.form
      // if (this.toast.status === 'success') {
      //   // reset all fields
      //   form.opinion.selected = 1
      //   form.username.value = ''
      //   form.company.value = ''
      //   form.email.value = ''
      //   form.phone.value = ''
      //   form.companyLocation.selected = 1
      //   form.message.value = ''
      //   document.querySelector('#contactForm').reset()
      // }
      this.toast.show = false
      if (this.formStatus === 'submitted') {
        this.formStatus = 'success'
      }
    },
    onValidate(value) {
      this.isHuman = value
    },
    onTelInput(value, detail) {
      this.form.phone.value = value
      this.form.phone.detail = detail
    },
    onSubmitForm() {
      const form = this.form
      const fields = {
        username: form.username,
        company: form.company,
        email: form.email,
        phone: form.phone,
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
          phone: form.phone.detail.number.international,
          companyLocation: form.companyLocation.selected,
          message: form.message.value
        }
        this.formData.set('data', JSON.stringify(data))

        this.formStatus = 'submitting'
        this.toast = {
          show: true,
          status: 'pending',
          message: form.status.pending
        }
      }
    },
    validateField(data) {
      const keys = Object.keys(data)
      const hasError = keys.some(key => {
        if (key === 'errorType' && data[key]) {
          return true
        }
        if (Object.prototype.toString.call(data[key]) === '[object Object]') {
          return this.validateField(data[key])
        }
      })

      return hasError
    }
  }
}
</script>

<style lang="sass">
:root
  --footer-bg: #fff

.contact
  .singlePage__context  
    +desktop
      display: flex

.pageTitle
  display: none
    
.titleBar
  +desktop
    +size(100%,500px)
    display: flex
  span
    margin: 0
    display: grid
    place-items: center
    color: #fff
    font-family: 'Playfair Display', serif
    font-style: italic
    font-size: px2rem(42)
    font-weight: 600
    line-height: normal
    text-align: center
    +mobile
      background: linear-gradient(0deg,rgba(32,24,27,0.5) 0%, rgba(32,24,27,0.5) 100%),url('~@/assets/responsiveImages/iStock-499421001.jpg?size=750') 0% 0% / cover no-repeat 
      +size(100%,300px)
      font-size: px2rem(30)
    +tablet
      background: linear-gradient(0deg,rgba(32,24,27,0.5) 0%, rgba(32,24,27,0.5) 100%),url('~@/assets/responsiveImages/iStock-499421001.jpg?size=1536') 0% 0% / cover no-repeat 
      +size(100%,400px)
    +desktop
      width: 33.3%
      background: linear-gradient(0deg,rgba(32,24,27,0.5) 0%, rgba(32,24,27,0.5) 100%),url('~@/assets/responsiveImages/iStock-499421001.jpg?size=750') 0% 0% / auto 140% no-repeat 
  a
    display: block
    +mobile
      +size(100%,300px)
    +tablet
      +size(100%,400px)
    +desktop
      flex: 1 0 0
  img
    object-position: center center
    object-fit: cover
    height: 100%

.contactForm
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

.contactInfo
  +desktop
    width: span(4)
    margin-left: gutter()
  h2
    font-size: px2rem(18)
    margin-bottom: 30px
  p
    padding: 0
    a
      font-weight: 600

.form--success
  +tablet
    width: span(8)
  +desktop
    width: span(8) 
</style>
