<template>
  <div style="padding-bottom: 20px">
    <h1>WORLD DATA</h1>
    <h3>Last updated at: {{ worldStatistics.statistic_taken_at }}</h3>
    <a-button type="primary" style="margin-bottom: 15px" @click="handleClick">
      Export world data to excel
    </a-button>
    <a-row :gutter="20">
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

    <a-row :gutter="20">
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

    <a-row :gutter="20">
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
import EventBus from "@/event-bus/event-bus";

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

export default {
  name: "WorldData",
  computed: {
    ...mapGetters(["worldStatistics", "worldChartImage"]),
  },
  methods: {
    ...mapActions(["fetchWorldStatistics"]),
    async handleClick() {
      EventBus.$emit("capture-chart");
      await this.waitForWorldChartImage();
      this.exportToExcel();
    },
    waitForWorldChartImage() {
      return new Promise((resolve) => {
        const intervalId = setInterval(() => {
          if (this.worldChartImage) {
            clearInterval(intervalId);
            resolve();
          }
        }, 100);
      });
    },
    exportToExcel() {
      // Tạo workbook mới
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Global Sheet");

      worksheet.mergeCells("A1:I3");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = "Global Report";
      titleCell.alignment = { vertical: "middle", horizontal: "center" };
      titleCell.font = {
        name: "Arial Black",
        family: 2,
        size: 38,
      };

      const now = new Date();
      const date = now.getDate(); // Lấy ngày trong tháng (1-31)
      const month = now.getMonth() + 1; // Lấy tháng (0-11). Cộng thêm 1 để lấy tháng từ 1-12
      const year = now.getFullYear(); // Lấy năm (4 chữ số)
      const hours = now.getHours(); // Lấy giờ (0-23)
      const minutes = now.getMinutes(); // Lấy phút (0-59)
      const seconds = now.getSeconds().toString().padStart(2, "0"); // Lấy giây (0-59) và hiển thị dưới dạng 2 chữ số nếu giá trị là từ 0-9

      worksheet.mergeCells("A4:I5");
      let timeStampCell = worksheet.getCell("A4");
      timeStampCell.value =
        "This data was taken at " +
        this.worldStatistics.statistic_taken_at +
        " and downloaded at " +
        `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      timeStampCell.alignment = { vertical: "middle", horizontal: "center" };
      timeStampCell.font = {
        name: "Arial",
        family: 1,
        size: 13,
      };

      worksheet.mergeCells("A6:I9");
      let desCell = worksheet.getCell("A6");
      desCell.value =
        "This table contains the following information related to COVID-19: Active Cases, Deaths per 1M Population, New Cases, New Deaths, Serious Critical cases, Total Cases, Total Cases per 1M Population, Total Deaths, and Total Recovered cases. The data in the table is updated regularly to provide accurate information on the global situation of the pandemic. This information can be used to analyze trends and make informed decisions related to travel, social distancing, and other measures to prevent the spread of COVID-19. By understanding the data in this table, individuals and organizations can take necessary precautions to protect themselves and others from the virus.";
      desCell.font = {
        name: "Times New Roman",
        family: 1,
        size: 10,
      };

      desCell.alignment = { wrapText: true };

      // Init table data
      let table = {
        name: "MyTable",
        ref: "A10",
        headerRow: true,
        style: {
          showRowStripes: true,
          showColumnStripes: true,
        },
        columns: [
          { name: "Active Cases" },
          { name: "Deaths per 1M Population" },
          { name: "New Cases" },
          { name: "New Deaths" },
          { name: "Serious Critical" },
          { name: "Total Cases" },
          { name: "Total Cases per 1M Population" },
          { name: "Total Deaths" },
          { name: "Total Recovered" },
        ],
        rows: [
          [
            convertToNumber(this.worldStatistics.active_cases),
            convertToNumber(this.worldStatistics.deaths_per_1m_population),
            convertToNumber(this.worldStatistics.new_cases),
            convertToNumber(this.worldStatistics.new_deaths),
            convertToNumber(this.worldStatistics.serious_critical),
            convertToNumber(this.worldStatistics.total_cases),
            convertToNumber(this.worldStatistics.total_cases_per_1m_population),
            convertToNumber(this.worldStatistics.total_deaths),
            convertToNumber(this.worldStatistics.total_recovered),
          ],
        ],
      };
      worksheet.addTable(table);

      // adjust column width
      const columnCount = table.columns.length;
      for (let i = 1; i <= columnCount; i++) {
        const column = worksheet.getColumn(i);
        let maxLength = 0;

        column.eachCell({ includeEmpty: true }, function (cell) {
          if (
            cell.address[1] != "4" &&
            cell.address[1] != "5" &&
            cell.address[1] != "6" &&
            cell.address[1] != "7" &&
            cell.address[1] != "8" &&
            cell.address[1] != "9"
          ) {
            const length = cell.value ? cell.value.toString().length : 10;
            if (length > maxLength) {
              maxLength = length;
            }
          }
        });

        column.width = maxLength + 2; // add some padding to the width
      }

      worksheet.mergeCells("B12:H13");
      let chartCell = worksheet.getCell("B12");
      chartCell.value =
        "This graph shows the number of Covid-19 cases and deaths worldwide over time since the outbreak began to the present day.";
      chartCell.font = {
        name: "Times New Roman",
        family: 1,
        size: 14,
      };
      chartCell.alignment = { vertical: "middle", horizontal: "center" };

      console.log(this.worldChartImage);
      const imageId = workbook.addImage({
        base64: this.worldChartImage,
        extension: "png",
      });
      worksheet.addImage(imageId, "B14:H30");
      // export file
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

<style scoped>
h1 {
  font-family: "Dancing Script", cursive;
  font-size: 40px;
}
</style>
