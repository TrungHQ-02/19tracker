<template>
  <div>
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
};
</script>
