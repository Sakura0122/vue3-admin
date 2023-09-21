import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/404',
      component: () => import('@/views/404/index.vue')
    }
  ]
})

export default router
