/*
 * @Description: 路由
 * @Author: your name
 * @Date: 2019-09-06 13:30:40
 */
import Vue from 'vue'
import Router from 'vue-router'
import registerRouterHook from './routerPermission'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/onemapApplication'
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/login')
    },
    {
      path: '/onemapApplication',
      component: () => import('@/views/onemapApplication'),
      children: [
        {
          path: '',
          name: 'onemap',
          component: () => import('@/views/onemapApplication/OneMap')
        },
        {
          path: 'HDLTool',
          name: 'HDLTool',
          component: () => import('@/views/onemapApplication/HDLTool')
        },
        {
          path: 'SpatialAnalysis',
          name: 'SpatialAnalysis',
          component: () => import('@/views/onemapApplication/SpatialAnalysis')
        },
        {
          path: 'StatisticalAnalysis',
          name: 'StatisticalAnalysis',
          component: () => import('@/views/onemapApplication/StatisticalAnalysis')
        }
      ]
    },
    {
      path: '/territorialPlanEvaluate',
      component: () => import('@/views/territorialPlanEvaluate'),
      children: [
        {
          path: '',
          name: 'Suitability',
          component: () => import('@/views/territorialPlanEvaluate/Suitability')
        }
      ]
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('@/views/entry')
    }
  ]
})

registerRouterHook(router)

export default router
