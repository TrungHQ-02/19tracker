<template>
  <div id="app">
    <a-layout id="components-layout-demo-fixed">
      <a-layout-header
        :style="{ position: 'fixed', zIndex: 1, width: '100%', height: '48px' }"
      >
        <div class="logo" />
        <a-menu
          theme="dark"
          mode="horizontal"
          :default-selected-keys="['1']"
          :style="{ lineHeight: '48px' }"
        >
          <a-menu-item key="1">
            <router-link to="/">World data</router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/vietnam">Vietnam</router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/about">About</router-link>
          </a-menu-item>
        </a-menu>
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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

@media (max-width: 768px) {
  .bg-wrapper {
    padding: 0;
  }
}
</style>
