import Vue from 'vue'
import App from './app.vue'
import router from './router'
import axios from 'axios'
import filter from './filter/filter'

Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;

/**
 * axios interceptor
 */
axios.interceptors.request.use(function (request) {
    console.log("request: ", request);
    return request;
}, error => {
});
axios.interceptors.response.use(function (response) {
    console.log("response: ", response)
    return response;
}, error => {
});

//filter
Object.keys(filter).forEach(key => {
    Vue.filter(key, filter[key])
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');

console.log('env: ', process.env.NODE_ENV);
