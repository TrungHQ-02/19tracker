<template>
  <div style="padding-bottom: 20px">
    <h1>{{ $t("worldData.worldData") }}</h1>
    <h3>
      {{ $t("worldData.lastUpdatedAt") }} <br />{{
        worldStatistics.statistic_taken_at
      }}
    </h3>
    <a-button type="primary" style="margin-bottom: 15px" @click="handleClick">
      {{ $t("worldData.exportReport") }}
    </a-button>
    <a-row :gutter="20">
      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.totalCases')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
          <p>{{ worldStatistics.total_cases }}</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.newCases')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
          <p>{{ worldStatistics.new_cases }}</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.totalDeaths')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
          <p>{{ worldStatistics.total_deaths }}</p>
        </a-card>
      </a-col>

      <br />

      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.newDeaths')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
          <p>{{ worldStatistics.new_deaths }}</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.totalRecovered')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
          <p>{{ worldStatistics.total_recovered }}</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.activeCases')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
          <p>{{ worldStatistics.active_cases }}</p>
        </a-card>
      </a-col>
      <br />

      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.seriousCritical')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
          <p>{{ worldStatistics.serious_critical }}</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.totalCasesPerMillion')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
          <p>{{ worldStatistics.total_cases_per_1m_population }}</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          size="small"
          :title="$t('worldData.deathsPerMillion')"
          :bordered="false"
          style="margin-bottom: 10px"
        >
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
      const worksheet = workbook.addWorksheet(
        this.$t("worldData.sheetExport.sheetTitle")
      );

      worksheet.mergeCells("A1:I3");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = this.$t("worldData.sheetExport.titleCell");
      titleCell.alignment = { vertical: "middle", horizontal: "center" };
      titleCell.font = {
        name: "Open Sans",
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
        this.$t("worldData.sheetExport.script1") +
        this.worldStatistics.statistic_taken_at +
        this.$t("worldData.sheetExport.script2") +
        `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      timeStampCell.alignment = { vertical: "middle", horizontal: "center" };
      timeStampCell.font = {
        name: "Arial",
        family: 1,
        size: 13,
      };

      worksheet.mergeCells("A6:I9");
      let desCell = worksheet.getCell("A6");
      desCell.value = this.$t("worldData.sheetExport.desCell");
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
          { name: this.$t("worldData.sheetExport.tableColumns.activeCases") },
          {
            name: this.$t(
              "worldData.sheetExport.tableColumns.totalDeathsPer1M"
            ),
          },
          { name: this.$t("worldData.sheetExport.tableColumns.newCases") },
          { name: this.$t("worldData.sheetExport.tableColumns.newDeaths") },
          {
            name: this.$t("worldData.sheetExport.tableColumns.seriousCritical"),
          },
          { name: this.$t("worldData.sheetExport.tableColumns.totalCases") },
          {
            name: this.$t("worldData.sheetExport.tableColumns.totalCasesPer1M"),
          },
          { name: this.$t("worldData.sheetExport.tableColumns.totalDeaths") },
          {
            name: this.$t("worldData.sheetExport.tableColumns.totalRecovered"),
          },
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
      chartCell.value = this.$t("worldData.sheetExport.chartCell");

      chartCell.font = {
        name: "Times New Roman",
        family: 1,
        size: 14,
      };
      chartCell.alignment = { vertical: "middle", horizontal: "center" };

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
  font-family: "Anton", sans-serif;
  font-size: 40px;
}
</style>
