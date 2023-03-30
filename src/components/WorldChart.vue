<template>
  <div>
    <h2>World barplot</h2>
    <canvas ref="chart" responsive="true"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import { mapGetters } from "vuex";

function convertToNumber(str) {
  if (!str || str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

export default {
  mounted() {
    this.renderChart();
  },
  computed: {
    ...mapGetters(["worldStatistics"]),
  },
  watch: {
    worldStatistics: {
      handler() {
        this.renderChart();
      },
      deep: true,
    },
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chart.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Total Cases",
            "Total Deaths",
            "Total Recovered",
            "New Cases",
            "New Deaths",
          ],
          datasets: [
            {
              label: "WorldStats",
              data: [
                convertToNumber(this.worldStatistics.total_cases),
                convertToNumber(this.worldStatistics.total_deaths),
                convertToNumber(this.worldStatistics.total_recovered),
                convertToNumber(this.worldStatistics.new_cases),
                convertToNumber(this.worldStatistics.new_deaths),
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function (value) {
                    return value
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  },
                },
              },
            ],
          },
          legend: {
            display: false,
          },
        },
      });
    },
  },
};
</script>
