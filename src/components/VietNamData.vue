<template>
  <div style="padding: 20px">
    <h1>VIET NAM DATA</h1>
    <h3>Last updated at: {{ worldStatistics.statistic_taken_at }}</h3>
    <a-button type="primary" style="margin-bottom: 15px" @click="downloadExcel">
      Export VietNam data to excel
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

export default {
  name: "VietNamData",
  computed: {
    ...mapGetters(["vietNamStatistics", "worldStatistics"]),
  },
  methods: {
    downloadExcel() {
      // Tạo workbook mới
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("My Sheet");

      worksheet.mergeCells("A1:I3");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = this.vietNamStatistics.country_name + " Report";
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
        ` ${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      timeStampCell.alignment = { vertical: "middle", horizontal: "center" };
      timeStampCell.font = {
        name: "Arial",
        family: 1,
        size: 13,
      };

      worksheet.mergeCells("A6:I9");
      let desCell = worksheet.getCell("A6");
      desCell.value = `This data provides information on the COVID-19 situation in ${this.vietNamStatistics.country_name}, including the number of cases, deaths, and active cases. Additionally, the data also includes information on the number of people who have recovered and factors related to the virus's spread, such as the number of serious and new cases. The data also includes information on the number of tests conducted and the number of cases and deaths per million population. All of this information helps government officials and healthcare experts to get an overview of the COVID-19 situation in ${this.vietNamStatistics.country_name} and make appropriate decisions to control and prevent the spread of the virus.`;
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
            convertToNumber(this.vietNamStatistics.active_cases),
            convertToNumber(this.vietNamStatistics.deaths_per_1m_population),
            convertToNumber(this.vietNamStatistics.new_cases),
            convertToNumber(this.vietNamStatistics.new_deaths),
            convertToNumber(this.vietNamStatistics.serious_critical),
            convertToNumber(this.vietNamStatistics.cases),
            convertToNumber(
              this.vietNamStatistics.total_cases_per_1m_population
            ),
            convertToNumber(this.vietNamStatistics.deaths),
            convertToNumber(this.vietNamStatistics.total_recovered),
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

      // export file
      const timeStamp = this.worldStatistics.statistic_taken_at;
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(
          blob,
          `${this.vietNamStatistics.country_name}_${timeStamp}.xlsx`
        );
      });
    },
  },
};
</script>

<style scoped>
h1 {
  font-family: "Dancing Script", cursive;
  font-size: 40px;
}
</style>
