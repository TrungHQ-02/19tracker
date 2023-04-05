<template>
  <div>
    <button @click="toggleLanguage">Đổi ngôn ngữ</button>
    <WorldData></WorldData>
    <WorldChart></WorldChart>
    <CountriesStats></CountriesStats>
  </div>
</template>

<script>
import "ant-design-vue/dist/antd.css";
import WorldData from "../components/WorldData.vue";
import CountriesStats from "../components/CountriesStats.vue";
import WorldChart from "@/components/WorldChart.vue";

export default {
  components: {
    WorldData,
    CountriesStats,
    WorldChart,
  },

  methods: {
    toggleLanguage() {
      if (this.$i18n.locale === "en") {
        this.$i18n.locale = "vi";
      } else {
        this.$i18n.locale = "en";
      }

      console.log("đã đổi ngôn ngữ");
    },
  },
};
</script>
