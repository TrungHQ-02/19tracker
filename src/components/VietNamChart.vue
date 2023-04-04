<template>
  <div style="background-color: #f0f8ff; padding: 12px">
    <h2>Vietnam barplot</h2>
    <canvas ref="vnchart" responsive="true"></canvas>
    <button @click="captureVietNamChart">Capture ảnh đưa vào state</button>
  </div>
</template>

<script>
import Chart from "chart.js";
import { mapActions, mapGetters } from "vuex";
import html2canvas from "html2canvas";

function convertToNumber(str) {
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

export default {
  mounted() {
    this.renderChart();
  },
  computed: {
    ...mapGetters(["vietNamStatistics"]),
  },
  watch: {
    vietNamStatistics: {
      handler() {
        this.renderChart();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(["updateVietnamChartImage"]),
    renderChart() {
      const ctx = this.$refs.vnchart.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Total Cases",
            "Total Deaths",
            "Total Recovered",
            "New Cases",
            "New Deaths",
            "Serious Critical",
            "Active Cases",
            "Total cases per 1M",
          ],
          datasets: [
            {
              label: "WorldStats",
              data: [
                convertToNumber(this.vietNamStatistics.cases),
                convertToNumber(this.vietNamStatistics.deaths),
                convertToNumber(this.vietNamStatistics.total_recovered),
                convertToNumber(this.vietNamStatistics.new_cases),
                convertToNumber(this.vietNamStatistics.new_deaths),
                convertToNumber(this.vietNamStatistics.serious_critical),
                convertToNumber(this.vietNamStatistics.active_cases),
                convertToNumber(
                  this.vietNamStatistics.total_cases_per_1m_population
                ),
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(231, 233, 237, 0.7)",
                "rgba(153, 102, 255, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(231, 233, 237, 1)",
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

    captureVietNamChart() {
      const chart = this.$refs.vnchart;
      console.log("chart được cap");
      html2canvas(chart).then((canvas) => {
        this.updateVietnamChartImage(canvas.toDataURL());
      });

      console.log("Da luu anh vao state");
    },
  },
};
</script>
