import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

const Roles = () => import('@/views/management/Roles')
const Typography = () => import('@/views/theme/Typography')

// Views - Components
const Stations = () => import('@/views/akasya_duragi/Station/Stations')
const Workers = () => import('@/views/akasya_duragi/Worker/Workers')
const Taxis = () => import('@/views/akasya_duragi/Taxi/Taxis')
const Voyages = () => import('@/views/akasya_duragi/Voyage/Voyages')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/akasya_duragi/stations',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'management',
          redirect: '/management/roles',
          name: 'Role',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'roles',
              name: 'Roles',
              component: Roles
            },
            {
              path: 'typography',
              name: 'Typography',
              component: Typography
            }
          ]
        },
        {
          path: 'akasya_duragi',
          redirect: '/akasya_duragi',
          name: 'Akasya Durağı',
          component: {
              render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'stations',
              name: 'Stations',
              component: Stations
            },
              {
              path: 'workers',
              name: 'Workers',
              component: Workers
            },
              {
              path: 'taxis',
              name: 'Taxis',
              component: Taxis
            },
              {
              path: 'voyages',
              name: 'Voyages',
              component: Voyages
            }
          ]
        }
      ]
    }
  ]
}

