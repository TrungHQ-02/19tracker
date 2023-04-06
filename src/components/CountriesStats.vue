<template>
  <div
    :key="$i18n.locale"
    style="background-color: aliceblue; margin-top: 12px"
  >
    <h2 style="font-size: 25px; margin-bottom: 0; padding: 6px 6px">
      {{ $t("countriesStats.countriesTable.title") }}
    </h2>
    <a-table
      :data-source="countriesStatistics"
      :columns="columns"
      :rowKey="(record) => record.country_name"
      :scroll="{ x: 800, y: 300 }"
      :pagination="{ pageSize: 50 }"
    >
      <div
        slot="filterDropdown"
        slot-scope="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="(c) => (searchInput = c)"
          :placeholder="$t('countriesStats.countriesTable.searchPlaceHolder')"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="
            () => handleSearch(selectedKeys, confirm, column.dataIndex)
          "
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          {{ $t("countriesStats.countriesTable.searchButton") }}
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="() => handleReset(clearFilters)"
        >
          {{ $t("countriesStats.countriesTable.resetButton") }}
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />

      <template slot="customRender" slot-scope="text, record, index, column">
        <!-- country flag -->
        <span :class="'fi fi-' + getCountryIsoCode(record.country_name)"></span>

        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
              >{{ fragment }}</mark
            >
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>

      <span slot="action" slot-scope="text, record">
        <a-button type="primary" @click="showModal(record)">
          {{ $t("countriesStats.countriesTable.details") }}
        </a-button>
        <a-modal
          v-model="visible"
          :title="modalTitle"
          @ok="handleOk"
          :footer="null"
        >
          <canvas ref="myChart"></canvas>
          <a-button type="primary" @click="downloadExcel">{{
            $t("countriesStats.countriesTable.downloadExcelButton")
          }}</a-button>
        </a-modal>
      </span>
    </a-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import flags from "../assets/flag";
import html2canvas from "html2canvas";

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

let compare = (a, b) => {
  let intA = convertToNumber(a);
  let intB = convertToNumber(b);
  return intA - intB;
};

export default {
  data() {
    return {
      modalTitle: "",
      visible: false,
      modalRecord: null,
      country_name: "",
      searchText: "",
      searchInput: null,
      searchedColumn: "",
    };
  },

  computed: {
    ...mapGetters([
      "countriesStatistics",
      "worldStatistics",
      "countryChartImage",
    ]),
    columns: function () {
      let cols = [
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.name"),
          dataIndex: "country_name",
          key: "country_name",
          width: 100,
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.country_name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
          ellipsis: true,
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.cases"),
          dataIndex: "cases",
          width: 110,
          sorter: (a, b) => compare(a.cases, b.cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.deaths"),
          dataIndex: "deaths",
          key: "deaths",
          width: 100,
          sorter: (a, b) => compare(a.deaths, b.deaths),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.recovered"),
          dataIndex: "total_recovered",
          key: "total_recovered",
          width: 120,
          sorter: (a, b) => compare(a.total_recovered, b.total_recovered),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.newDeaths"),
          dataIndex: "new_deaths",
          key: "new_deaths",
          width: 100,
          sorter: (a, b) => compare(a.new_deaths, b.new_deaths),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.newCases"),
          dataIndex: "new_cases",
          key: "new_cases",
          width: 100,
          sorter: (a, b) => compare(a.new_cases, b.new_cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.critical"),
          dataIndex: "serious_critical",
          key: "serious_critical",
          width: 100,
          sorter: (a, b) => compare(a.serious_critical, b.serious_critical),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.active"),
          dataIndex: "active_cases",
          key: "active_cases",
          width: 100,
          sorter: (a, b) => compare(a.active_cases, b.active_cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.tests"),
          dataIndex: "total_tests",
          key: "total_tests",
          width: 100,
          sorter: (a, b) => compare(a.total_tests, b.total_tests),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: this.$t("countriesStats.countriesTable.columnTitle.actions"),
          key: "action",
          width: 100,
          scopedSlots: { customRender: "action" },
        },
      ];
      return cols;
    },
  },

  methods: {
    ...mapActions(["updateCountryChartImage"]),

    getCountryIsoCode(country_name) {
      return flags[country_name].toLowerCase();
    },

    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },

    showModal(record) {
      this.visible = true;
      this.modalRecord = record;
      this.modalTitle = record.country_name;
      this.renderChart();
    },

    handleOk(e) {
      this.$refs.myChart.chart.destroy();
      this.visible = false;
    },

    renderChart() {
      this.$nextTick(() => {
        const canvas = this.$refs.myChart;
        const ctx = canvas.getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
              "Cases",
              "Deaths",
              "Recovered",
              "New Cases",
              "New Deaths",
              "Critical",
              "Active",
              "Total per 1M",
            ],
            datasets: [
              {
                label: "WorldStats",
                data: [
                  convertToNumber(this.modalRecord.cases),
                  convertToNumber(this.modalRecord.deaths),
                  convertToNumber(this.modalRecord.total_recovered),
                  convertToNumber(this.modalRecord.new_cases),
                  convertToNumber(this.modalRecord.new_deaths),
                  convertToNumber(this.modalRecord.serious_critical),
                  convertToNumber(this.modalRecord.active_cases),
                  convertToNumber(
                    this.modalRecord.total_cases_per_1m_population
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
      });
    },

    waitForCountryChartImage() {
      return new Promise((resolve) => {
        const intervalId = setInterval(() => {
          if (this.countryChartImage) {
            clearInterval(intervalId);
            resolve();
          }
        }, 100);
      });
    },

    async captureChart() {
      const chart = this.$refs.myChart;
      html2canvas(chart).then((canvas) => {
        this.updateCountryChartImage(canvas.toDataURL());
      });
      await this.waitForCountryChartImage();
    },

    async downloadExcel() {
      //capture
      await this.captureChart();

      // Tạo workbook mới
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        this.modalRecord.country_name + " sheet"
      );

      worksheet.mergeCells("A1:I3");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = this.modalRecord.country_name;
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
        this.$t("countriesStats.sheetExport.script1") +
        this.worldStatistics.statistic_taken_at +
        this.$t("countriesStats.sheetExport.script2") +
        ` ${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      timeStampCell.alignment = { vertical: "middle", horizontal: "center" };
      timeStampCell.font = {
        name: "Arial",
        family: 1,
        size: 13,
      };

      worksheet.mergeCells("A6:I9");
      let desCell = worksheet.getCell("A6");
      desCell.value = this.$t("countriesStats.sheetExport.desCell");
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
          {
            name: this.$t(
              "countriesStats.sheetExport.tableColumns.activeCases"
            ),
          },
          {
            name: this.$t(
              "countriesStats.sheetExport.tableColumns.totalDeathsPer1M"
            ),
          },
          { name: this.$t("countriesStats.sheetExport.tableColumns.newCases") },
          {
            name: this.$t("countriesStats.sheetExport.tableColumns.newDeaths"),
          },
          {
            name: this.$t(
              "countriesStats.sheetExport.tableColumns.seriousCritical"
            ),
          },
          {
            name: this.$t("countriesStats.sheetExport.tableColumns.totalCases"),
          },
          {
            name: this.$t(
              "countriesStats.sheetExport.tableColumns.totalCasesPer1M"
            ),
          },
          {
            name: this.$t(
              "countriesStats.sheetExport.tableColumns.totalDeaths"
            ),
          },
          {
            name: this.$t(
              "countriesStats.sheetExport.tableColumns.totalRecovered"
            ),
          },
        ],
        rows: [
          [
            convertToNumber(this.modalRecord.active_cases),
            convertToNumber(this.modalRecord.deaths_per_1m_population),
            convertToNumber(this.modalRecord.new_cases),
            convertToNumber(this.modalRecord.new_deaths),
            convertToNumber(this.modalRecord.serious_critical),
            convertToNumber(this.modalRecord.cases),
            convertToNumber(this.modalRecord.total_cases_per_1m_population),
            convertToNumber(this.modalRecord.deaths),
            convertToNumber(this.modalRecord.total_recovered),
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

      worksheet.mergeCells("A12:I13");
      let chartCell = worksheet.getCell("B12");
      chartCell.value = this.$t("countriesStats.sheetExport.chartCell");
      chartCell.font = {
        name: "Times New Roman",
        family: 1,
        size: 14,
      };
      chartCell.alignment = { vertical: "middle", horizontal: "center" };

      const imageId = workbook.addImage({
        base64: this.countryChartImage,
        extension: "png",
      });
      worksheet.addImage(imageId, "B14:H26");

      // export file
      const timeStamp = this.worldStatistics.statistic_taken_at;
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${this.modalRecord.country_name}_${timeStamp}.xlsx`);
      });
    },
  },

  watch: {
    modalRecord: {
      handler() {
        this.renderChart();
      },
      deep: true,
    },

    lang: {
      handleChangeLang() {
        this.$forceUpdate();
      },
    },
  },
};
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
