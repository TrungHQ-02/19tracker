<template>
  <div style="background-color: turquoise; padding: 20px">
    <h2>WORLD DATA</h2>
    <h3>Last updated at: {{ worldStatistics.statistic_taken_at }}</h3>
    <a-button type="primary" style="margin-bottom: 15px">
      Export world data to excel
    </a-button>
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card size="small" title="Total Cases" :bordered="false">
          <p>{{ worldStatistics.total_cases }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="New cases" :bordered="false">
          <p>{{ worldStatistics.new_cases }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Total deaths" :bordered="false">
          <p>{{ worldStatistics.total_deaths }}</p>
        </a-card>
      </a-col>
    </a-row>

    <br />

    <a-row :gutter="16">
      <a-col :span="8">
        <a-card size="small" title="New deaths" :bordered="false">
          <p>{{ worldStatistics.new_deaths }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Total recovered" :bordered="false">
          <p>{{ worldStatistics.total_recovered }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Active cases" :bordered="false">
          <p>{{ worldStatistics.active_cases }}</p>
        </a-card>
      </a-col>
    </a-row>
    <br />

    <a-row :gutter="16">
      <a-col :span="8">
        <a-card size="small" title="Serious critical" :bordered="false">
          <p>{{ worldStatistics.serious_critical }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card
          size="small"
          title="Total cases per one milion"
          :bordered="false"
        >
          <p>{{ worldStatistics.total_cases_per_1m_population }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Death per one milion" :bordered="false">
          <p>{{ worldStatistics.deaths_per_1m_population }}</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import "ant-design-vue/dist/antd.css";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "WorldData",
  computed: {
    ...mapGetters(["worldStatistics"]),
  },
  methods: {
    ...mapActions(["fetchWorldStatistics"]),
  },
  mounted() {
    this.fetchWorldStatistics();
  },
};
</script>
