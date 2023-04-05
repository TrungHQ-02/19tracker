import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuex from 'vuex';
import Antd from 'ant-design-vue';
import storeConfigs from './store';
import VueI18n from 'vue-i18n';
import en from './lang/en.json'
import vi from './lang/vi.json'

Vue.use(VueI18n)
Vue.use(Vuex)
Vue.use(Antd)
Vue.config.productionTip = false

const messages = {
  en, vi
}

const store = new Vuex.Store(storeConfigs);

const i18n = new VueI18n({
  locale: 'en',
  messages
})

new Vue({
  router,
  i18n,
  render: h => h(App),
  store
}).$mount('#app')
