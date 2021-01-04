import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Admin from './views/admin'
import Welcome from './views/admin/welcom'
import Chapter from './views/admin/chapter'
import Section from './views/admin/section'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '*',
    redirect: "/login",
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/',
    name: 'admin',
    component: Admin,
    children: [{
      path: 'welcome', // no "/"
      name: 'welcome',
      component: Welcome,
    }, {
      path: 'business/chapter',
      name: 'business/chapter',
      component: Chapter,
    }, {
      path: 'business/section',
      name: "business/section",
      component: Section,
    }]
  }]
})