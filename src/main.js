import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuex from 'vuex';
import Antd from 'ant-design-vue';
import storeConfigs from './store';

Vue.use(Vuex)
Vue.use(Antd)
Vue.config.productionTip = false

const store = new Vuex.Store(storeConfigs);

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
