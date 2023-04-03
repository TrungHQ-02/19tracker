<template>
  <div>
    <VietNamData></VietNamData>
    <VietNamChart></VietNamChart>
  </div>
</template>

<script>
import "ant-design-vue/dist/antd.css";
import VietNamData from "../components/VietNamData.vue";
import VietNamChart from "@/components/VietNamChart.vue";

export default {
  components: {
    VietNamData,
    VietNamChart,
  },
};
</script>
