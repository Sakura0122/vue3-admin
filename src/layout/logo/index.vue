<script setup lang="ts">
import setting from '@/setting'
import useSettingStore from '@/stores/modules/setting'

defineOptions({ name: 'Logo' })
const settingStore = useSettingStore()
</script>

<template>
  <div class="logo">
    <img v-if="setting.logoHidden" :src="setting.logo" alt="" />
    <p v-show="!settingStore.fold">{{ setting.title }}</p>
  </div>
</template>

<style scoped lang="scss">
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: var(--base-menu-logo-height);

  img {
    width: 40px;
    height: 40px;
  }

  p {
    margin-left: 10px;
    font-size: var(--base-logo-title-fontSize);
    white-space: nowrap;
  }
}
</style>
