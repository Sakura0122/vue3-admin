/// <reference types="vite/client" />
import 'vue-router'

declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
  }
}
