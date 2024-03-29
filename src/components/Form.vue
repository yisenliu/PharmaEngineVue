<template>
  <form class="form" action="post" @submit.prevent="onSubmit">
    <slot></slot>
  </form>
</template>

<script>
export default {
  methods: {
    onSubmit($event) {
      this.$emit('submit', $event)
    }
  }
}
</script>

<style lang="sass">
.form
  // Designed to help with the organization and spacing of vertical forms.
  // For horizontal forms, use the custom defined grid system.
  &__group
    +clearfix
    clear: both
    width: 100%
    margin-top: 30px
  // label for form-control
  &__label
    margin-bottom: 0
    color: get($form,label,color)
    display: block
    font-size: px2rem(12)
    font-weight: 600
  // Form data-input section
  &__data
    display: block
    position: relative


// Common form controls
// -------------------------------------
// Shared size and type resets for form controls. Apply `.form__control` to any of the following form controls:
// select
// textarea
// input[type="text"]
// input[type="password"]
// input[type="datetime"]
// input[type="datetime-local"]
// input[type="date"]
// input[type="month"]
// input[type="time"]
// input[type="week"]
// input[type="number"]
// input[type="email"]
// input[type="url"]
// input[type="search"]
// input[type="tel"]
// input[type="color"]

.form__control
  display: block
  width: 100%
  &[type="file"]
    overflow: hidden

  // Customize the `:focus` state to imitate native WebKit styles.
  &:focus
    background-color: get($form,control,focus,bgColor)

  // Disabled and read-only inputs
  // HTML5 says that controls under a fieldset > legend:first-child won't be
  // disabled if the fieldset is disabled. Due to implementation difficulty, we
  // don't honor that edge case we style them as disabled anyway.
  &[disabled],
  fieldset[disabled] &
    cursor: not-allowed
    background-color: get($form,control,disabled,bgColor)
    opacity: 1 // iOS fix for unreadable disabled content
    color: get($form,control,disabled,color)
    border-color: currentColor

  &[readonly]
    cursor: not-allowed
    background-color: get($form,control,readonly,bgColor)
    opacity: 1 // iOS fix for unreadable disabled content

  // autofill
  &:-webkit-autofill
    -webkit-box-shadow: 0 0 0 1000px get($form,control,default,bgColor) inset
    // -webkit-text-fill-color: #fff;

  // Reset height for `textarea`s
  @at-root
    textarea#{&}
      height: auto
      resize: vertical


// Checkboxes and radios
// -------------------------------------
%checkboxradio
  $iconSize: px2em(18)
  overflow: hidden
  label
    position: relative
    padding-left: px2em(24)
    font-weight: normal
    cursor: pointer
    min-height: px2em(30)
    vertical-align: top
  input
    display: none
    + *
      transition: color get($time,fast)
      min-height: $iconSize
      overflow: hidden
      display: block
      &::before,
      &::after
        +size($iconSize)
        content: ''
        font-family: get($font-family,icon)
        line-height: $iconSize
        text-align: center
        display: block
        position: absolute
        left: 0
        top: px2em(4)
        overflow: hidden
      &::before
        transition: background-color get($time,fast), border-color get($time,fast)
        background-color: get($form,control,default,bgColor)
        border: 1px solid get($border,color,normal)
      &::after
        transform: scale(0)
        transform-origin: center center
        transition: color get($time,fast), transform get($time,fast) ease-in-out get($time,fast)/2
        color: transparent
    &:checked + *
      color: $success
      &::before
        background-color: get($form,control,checked,bgColor)
        background-image: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,.05) 100%)
        border-color: $success
      &::after
        transform: scale(.7)
        color: get($form,control,checked,color)
    &:disabled + *
      cursor: not-allowed
      color: get($form,control,disabled,color)
      &::before
        background-color: get($form,control,disabled,bgColor)
    &:disabled:checked + *
      color: get($form,control,disabled,color)
      &::after
        color: currentColor
  span
    a
      text-decoration: underline
      @supports(text-decoration-style: wavy)
        text-decoration: underline wavy $warning
        
.form__checkbox,
.form__radio
  @extend %checkboxradio
  label
    float: left
    clear: left

.form__checkbox
  label
    &:before
      border-radius: get($border,radius,s)
  input[type="checkbox"]
    + *
      &::before
        border-radius: get($border,radius,s)
      &::after
        content: iconfont-item(check)

.form__radio
  label
    &::before
      border-radius: 50%
  input[type="radio"]
    + *
      &::before
        border-radius: 50%
      &::after
        content: iconfont-item(circle)


// Static form control text
// -------------------------------------
.form__control--plaintext
  border: none
  pointer-events: none


// Feedback states
// -------------------------------------
.form__group--error
  // .form__label,
  // .form__radio,
  // .form__checkbox,
  // .radio-inline,
  // .checkbox-inline
  //   color: $danger
  .form__control
    border: 1px dashed $danger

.form__invalidFeedback
  position: absolute
  z-index: 1
  right: 0
  bottom: calc(100% + 5px)
  border-radius: 4px
  background-color: $danger
  color: #fff
  font-size: px2rem(12)
  padding: 2px 4px
  display: inline-block
  line-height: normal
  &::before
    +triangle('down', 10px, 5px, $danger)
    content: ''
    display: block
    position: absolute
    z-index: 1
    transform: translateX(-50%)
    top: 100%
    left: 50%

.form--success
  display: flex
  flex-flow: column wrap
  align-items: center
  justify-content: center
  text-align: center
  &::before
    +iconFont(basic1-174_ok_success_check)
    color: $success
    display: block
    width: 100%
    text-align: center
    margin-bottom: 15px
    font-size: px2rem(48)


// Help text
// -------------------------------------
// Apply to any element you wish to create light text for placement immediately below a form control. Use for general help, formatting, or instructional text.

.help-block
  display: block
  margin-top: 5px
  margin-bottom: 10px
  color: $gray-500


// Input Group
// -------------------------------------
.input-group
  display: flex
  flex-flow: row nowrap
  align-items: stretch
  max-width: 12rem
  margin-bottom: get($spacer,m)
  &-btn,
  &-value
    vertical-align: middle
    text-align: center
  &-btn
    +size(40px)
    border-radius: 50%
    line-height: 44px
    padding: 0
    color: #fff
    background-color: $gray-900
    position: relative
    z-index: 1
    &:hover
      background-color: $gray-800
    &:disabled
      opacity: .6
      background-color: #FFF
      color: get($border,color,default)
      border: dashed 2px get($border,color,default)
  // use '&' for css priority
  & &-value
    background-color: transparent
    width: 4rem
    position: relative
    z-index: 2
    font-weight: bold
</style>
