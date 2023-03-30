<template>
  <div style="background-color: turquoise; padding: 20px">
    <h2>VIET NAM DATA</h2>
    <h3>Last updated at: {{ worldStatistics.statistic_taken_at }}</h3>
    <a-button type="primary" style="margin-bottom: 15px">
      <export-excel :data="arrayOfVietNam" name="vietnam.xls">
        Export VietNam data to excel
      </export-excel>
    </a-button>
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card size="small" title="Total Cases" :bordered="false">
          <p>{{ vietNamStatistics.cases }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="New cases" :bordered="false">
          <p>{{ vietNamStatistics.new_cases }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Total deaths" :bordered="false">
          <p>{{ vietNamStatistics.deaths }}</p>
        </a-card>
      </a-col>
    </a-row>

    <br />

    <a-row :gutter="16">
      <a-col :span="8">
        <a-card size="small" title="New deaths" :bordered="false">
          <p>{{ vietNamStatistics.new_deaths }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Total recovered" :bordered="false">
          <p>{{ vietNamStatistics.total_recovered }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Active cases" :bordered="false">
          <p>{{ vietNamStatistics.active_cases }}</p>
        </a-card>
      </a-col>
    </a-row>
    <br />

    <a-row :gutter="16">
      <a-col :span="8">
        <a-card size="small" title="Serious critical" :bordered="false">
          <p>{{ vietNamStatistics.serious_critical }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card
          size="small"
          title="Total cases per one milion"
          :bordered="false"
        >
          <p>{{ vietNamStatistics.total_cases_per_1m_population }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Death per one milion" :bordered="false">
          <p>{{ vietNamStatistics.deaths_per_1m_population }}</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import "ant-design-vue/dist/antd.css";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "VietNamData",
  computed: {
    ...mapGetters([
      "vietNamStatistics",
      "worldStatistics",
      "countriesStatistics",
    ]),

    arrayOfVietNam: function () {
      let arr = [];
      arr.push(this.vietNamStatistics);
      return arr;
    },
  },
  methods: {
    ...mapActions(["fetchWorldStatistics"]),
  },
};
</script>
