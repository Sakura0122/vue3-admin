<script setup lang="ts">
import Logo from './logo/index.vue'
import MenuItem from './menu-item/index.vue'
import useUserStore from '@/stores/modules/user'
import { useRoute } from 'vue-router'

defineOptions({ name: 'Layout' })

const route = useRoute()

// 用户仓库
const userStore = useUserStore()
</script>

<template>
  <el-container class="layout-container">
    <el-aside>
      <Logo />
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu :default-active="route.path" background-color="#001529" text-color="#fff">
          <menu-item :menu-list="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header>我是头部</el-header>

      <el-main>
        <el-scrollbar>
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;

  .el-aside {
    width: var(--base-menu-width);
    height: 100vh;
    background-color: var(--base-menu-background);
    color: #fff;

    .scrollbar {
      width: 100%;
      height: calc(100vh - var(--base-menu-logo-height));

      .el-menu {
        border-right: none;
      }
    }
  }

  .el-header {
    height: var(--base-tabbar-height);
    background-color: aqua;
  }
}
</style>
