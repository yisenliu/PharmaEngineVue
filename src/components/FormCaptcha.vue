<template>
  <div class="form__group">
    <label class="form__label">
      {{ label }}
    </label>
    <div class="form__data">
      <transition
        name="reCAPTCHA"
        enter-active-class="animate__animated animate__fadeInRight"
        leave-active-class="animate__animated animate__fadeOutLeft"
        mode="out-in">
        <span
          :key="state"
          style="position: relative;display: inline-block">
          {{ reCAPTCHAStatusText }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: null
    },
    robot: {
      type: String,
      default: null
    },
    human: {
      type: String,
      default: null
    },
    siteKey: {
      required: true,
      type: String,
      default: null
    },
    secretKey: {
      required: true,
      type: String,
      default: null
    }
  },
  data() {
    return {
      state: 'init'
    }
  },
  computed: {
    reCAPTCHAStatusText() {
      switch (this.state) {
        case 'human':
          return this.human
        case 'robot':
          return this.robot
        default:
          return 'checking...'
      }
    }
  },
  mounted() {
    this.createRecaptcha()
  },
  beforeDestroy() {
    this.removeRecaptcha()
  },
  methods: {
    createRecaptcha() {
      const vm = this
      const script = document.createElement('script')

      script.setAttribute(
        'src',
        'https://www.google.com/recaptcha/api.js?render=' + vm.siteKey
      )
      script.id = 'reCAPTCHAScript'
      document.head.appendChild(script)
      script.onload = function () {
        grecaptcha.ready(function () {
          grecaptcha
            .execute(vm.siteKey, {
              action: 'doSomething'
            })
            .then(token => {
              // use cors-anywhere to fetch api data
              // const cors = 'https://cors-anywhere.herokuapp.com/https://www.google.com/recaptcha/api/siteverify'

              axios({
                method: 'post',
                // url: DEVELOPMENT ? '/api/recaptcha/siteverify' : 'https://www.google.com/recaptcha/api/siteverify',
                url: '/api/recaptcha/siteverify',
                params: {
                  secret: vm.secretKey,
                  response: token
                }
              }).then(response => {
                console.log(response.data)
                vm.state = response.data.score > 0.7 ? 'human' : 'robot'
                vm.$emit('validate', vm.state === 'human')
              })
            })
        })
      }
    },
    removeRecaptcha() {
      document.getElementById('reCAPTCHAScript').remove()
    }
  }
}
</script>