import { createApp } from 'vue'
// element样式和图标
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// svg插件配置代码
import 'virtual:svg-icons-register'

import App from '@/App.vue'
import router from '@/router'
import '@/router/permisstion'
import pinia from '@/stores'
import '@/assets/css/index.scss'

const app = createApp(App)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(pinia)

app.mount('#app')
