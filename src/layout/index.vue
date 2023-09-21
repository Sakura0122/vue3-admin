<script setup lang="ts">
import Logo from './logo/index.vue'

defineOptions({ name: 'Layout' })
</script>

<template>
  <el-container class="layout-container">
    <el-aside>
      <Logo />
    </el-aside>

    <el-container>
      <el-header>我是头部</el-header>

      <el-main>
        <el-scrollbar>我是内容</el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
  background-color: #bfa;

  .el-aside {
    width: var(--base-menu-width);
    height: 100vh;
    background-color: var(--base-menu-background);
  }

  .el-header {
    height: var(--base-tabbar-height);
    background-color: aqua;
  }
}
</style>
