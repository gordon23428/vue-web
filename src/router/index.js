import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Helloworld from '@/components/Helloworld'
import Login from '@/components/pages/Login'
import Products from '@/components/pages/Products'
import CustomerOrders from '@/components/pages/CustomerOrders'
import Orders from '@/components/pages/Orders'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/test',
      name: 'Test',
      component: Helloworld,
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/',
      name: 'Dash',
      component: Dashboard,
      children: [
        {
          path: 'customer_orders',
          name: 'CustomerOrders',
          component: CustomerOrders,
        }
      ],
    },
  ]
})
