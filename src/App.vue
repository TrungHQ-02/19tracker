<template>
  <div id="app">
    <a-layout id="components-layout-demo-fixed">
      <a-layout-header
        :style="{ position: 'fixed', zIndex: 1, width: '100%', height: '48px' }"
      >
        <a-menu
          theme="dark"
          mode="horizontal"
          :default-selected-keys="['1']"
          :style="{ lineHeight: '48px' }"
        >
          <a-menu-item key="1">
            <router-link to="/">{{ $t("navTitle.home") }}</router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/vietnam">{{
              $t("navTitle.vietnam")
            }}</router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/about">{{ $t("navTitle.about") }}</router-link>
          </a-menu-item>
        </a-menu>

        <div
          class="logo px-xs-0 px-sm-3 px-md-5 px-lg-5 px-xl-6"
          style="position: absolute; top: -8px; left: 20px"
        >
          <img
            src="https://rastarecords.com/wp-content/uploads/2018/11/mainheadlogo.png"
            style="width: 30px"
            alt=""
          />
        </div>

        <a-dropdown
          class="me-xs-1 me-sm-4 me-md-5 me-lg-5"
          style="position: absolute; top: -10px; right: 10px"
        >
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <div>
              <img
                style="width: 45px"
                v-if="currentLanguage === 'en'"
                src="../public/usa-flag.png"
              />
              <img
                style="width: 45px"
                v-else="currentLanguage === 'vi'"
                src="../public/vietnam-flag.png"
              />
            </div>
          </a>
          <a-menu slot="overlay" @click="onClick">
            <a-menu-item key="1">
              <img style="width: 45px" src="../public/usa-flag.png" />
            </a-menu-item>
            <a-menu-item key="2">
              <img style="width: 45px" src="../public/vietnam-flag.png" />
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content class="bg-wrapper px-0 px-sm-4 px-md-5 py-5">
        <a-layout-content
          :style="{
            padding: '12px 24px',
            minHeight: '280px',
          }"
        >
          <router-view />
        </a-layout-content>
      </a-layout-content>
      <a-layout-footer class :style="{ textAlign: 'center' }">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },
  },
  methods: {
    onClick({ key }) {
      if (this.currentLanguage === "en" && key === "2") {
        this.changeLanguage();
      } else if (this.currentLanguage === "vi" && key === "1") {
        this.changeLanguage();
      }
    },
    changeLanguage() {
      if (this.$i18n.locale === "en") {
        this.$i18n.locale = "vi";
      } else {
        this.$i18n.locale = "en";
      }
    },
  },
};
</script>

<style>
#app {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.bg-wrapper {
  background: url("https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80")
    no-repeat;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}
</style>
