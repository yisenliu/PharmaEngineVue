<template>
  <transition
    mode="out-in"
    enter-active-class="animate__animated animate__fadeIn animate__faster"
    leave-active-class="animate__animated animate__fadeOutLeft animate__faster">
    <slot></slot>
  </transition>
</template>