<template>
  <div id="app">
    <a-layout id="components-layout-demo-fixed">
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="logo" />
        <a-menu
          theme="dark"
          mode="horizontal"
          :default-selected-keys="['1']"
          :style="{ lineHeight: '64px' }"
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
      <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
        <a-layout style="padding: 24px 0; background: #fff">
          <!-- <a-layout-sider
             width="200"
             style="background: #fff"
             :style="{
               overflow: 'auto',
               height: '100vh',
               position: 'fixed',
               left: 0,
               top: '64px',
             }"
           >
             <a-menu
               mode="inline"
               :default-selected-keys="['1']"
               :default-open-keys="['sub1']"
               style="height: 100%"
             >
               <a-menu-item key="1"> option1 </a-menu-item>
               <a-menu-item key="2"> option2 </a-menu-item>
               <a-menu-item key="3"> option3 </a-menu-item>
               <a-menu-item key="4"> option4 </a-menu-item>
             </a-menu>
           </a-layout-sider> -->
          <a-layout-content
            :style="{
              padding: '0 24px',
              minHeight: '280px',
              // marginLeft: '200px',
            }"
          >
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
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
</style>
