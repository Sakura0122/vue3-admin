<script setup lang="ts">
defineOptions({
  name: 'SvgIcon'
})

interface Props {
  width: string
  height: string
  prefix: string
  name: string
  color?: string
}

withDefaults(defineProps<Props>(), {
  width: '16px',
  height: '16px',
  prefix: '#icon-'
})
</script>

<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>
