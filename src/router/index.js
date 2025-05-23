import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Interfaces from '@/components/interfaces/Interfaces.vue'
import Bridges from '@/components/bridge/Bridges.vue'
import Login from '@/components/login/Login.vue'
import { useAuthStore } from '@/components/stores/auth'
import Wireguard from '@/components/wireguard/Wireguard.vue'
import Wireless from '@/components/wireless/Wireless.vue'
import Routes from '@/components/ip/routes/Routes.vue'
import Addresses from '@/components/ip/addresses/Addresses.vue'
import DHCP from '@/components/ip/dhcp/DHCP.vue'
import DNS from '@/components/ip/dns/DNS.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path : '/interfaces',
      name : 'interfaces',
      component : Interfaces,
    },
    {
      path : '/bridges',
      name : 'bridges',
      component : Bridges,
    },
    {
      path : "/login",
      name : "login",
      component : Login
    },
    {
      path: '/wireguard',
      name: 'wireguard',
      component: Wireguard
    },
    {
      path : '/wireless',
      name : 'wireless',
      component: Wireless
    },
    {
      path: '/ip/routes',
      name: 'routes',
      component: Routes
    },
    {
      path: '/ip/addresses',
      name: 'addresses',
      component: Addresses
    },
    {
      path: '/ip/dhcp',
      name: 'dhcp',
      component: DHCP
    },
    {
      path: '/ip/dns',
      name: 'dns',
      component: DNS
    }
  ],
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreLogin()
  }

  if(to.name != 'login' && !storeAuth.ip){
    next({ name: 'login' })
    return
  }
  next()
})

export default router
