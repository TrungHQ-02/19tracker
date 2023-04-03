<template>
  <div style="background-color: turquoise; padding: 20px">
    <h2>WORLD DATA</h2>
    <h3>Last updated at: {{ worldStatistics.statistic_taken_at }}</h3>
    <a-button type="primary" style="margin-bottom: 15px" @click="exportToExcel">
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

export default {
  name: "WorldData",
  computed: {
    ...mapGetters(["worldStatistics"]),
  },
  methods: {
    ...mapActions(["fetchWorldStatistics"]),
    exportToExcel() {
      // Tạo workbook mới
      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("My Sheet");
      worksheet.columns = [
        { header: "Active Cases", key: "active_cases" },
        { header: "Deaths per 1M Population", key: "deaths_per_1m_population" },
        { header: "New Cases", key: "new_cases" },
        { header: "New Deaths", key: "new_deaths" },
        { header: "Serious Critical", key: "serious_critical" },
        { header: "Statistic Taken At", key: "statistic_taken_at" },
        { header: "Total Cases", key: "total_cases" },
        {
          header: "Total Cases per 1M Population",
          key: "total_cases_per_1m_population",
        },
        { header: "Total Deaths", key: "total_deaths" },
        { header: "Total Recovered", key: "total_recovered" },
      ];

      worksheet.addRow({
        active_cases: convertToNumber(this.worldStatistics.active_cases),
        deaths_per_1m_population: convertToNumber(
          this.worldStatistics.deaths_per_1m_population
        ),
        new_cases: convertToNumber(this.worldStatistics.new_cases),
        new_deaths: convertToNumber(this.worldStatistics.new_deaths),
        serious_critical: convertToNumber(
          this.worldStatistics.serious_critical
        ),
        statistic_taken_at: this.worldStatistics.statistic_taken_at,
        total_cases: convertToNumber(this.worldStatistics.total_cases),
        total_cases_per_1m_population: convertToNumber(
          this.worldStatistics.total_cases_per_1m_population
        ),
        total_deaths: convertToNumber(this.worldStatistics.total_deaths),
        total_recovered: convertToNumber(this.worldStatistics.total_recovered),
      });

      // worksheet.autoFitColumns();

      const timeStamp = this.worldStatistics.statistic_taken_at;
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `world-statistics-${timeStamp}.xlsx`);
      });
    },
  },
  mounted() {
    this.fetchWorldStatistics();
  },
};
</script>
