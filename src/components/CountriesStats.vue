<template>
  <div>
    <h2 style="margin-top: 50px">Countries Stats</h2>
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
          :placeholder="`Search ${column.dataIndex}`"
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
          Search
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="() => handleReset(clearFilters)"
        >
          Reset
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />

      <template slot="customRender" slot-scope="text, record, index, column">
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
        <a-button type="primary" @click="showModal(record)"> Details </a-button>
        <a-modal
          v-model="visible"
          title="Specific statistics"
          @ok="handleOk"
          :footer="null"
        >
          <canvas ref="myChart"></canvas>
          <a-button type="primary" @click="downloadExcel"
            >Download Excel</a-button
          >
        </a-modal>
      </span>
    </a-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

function convertToNumber(str) {
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
      visible: false,
      modalRecord: null,
      country_name: "",
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      columns: [
        {
          title: "Name",
          dataIndex: "country_name",
          key: "country_name",
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
          title: "Cases",
          dataIndex: "cases",
          sorter: (a, b) => compare(a.cases, b.cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Deaths",
          dataIndex: "deaths",
          key: "deaths",
          sorter: (a, b) => compare(a.deaths, b.deaths),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Recovered",
          dataIndex: "total_recovered",
          key: "total_recovered",
          sorter: (a, b) => compare(a.total_recovered, b.total_recovered),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "New deaths",
          dataIndex: "new_deaths",
          key: "new_deaths",
          sorter: (a, b) => compare(a.new_deaths, b.new_deaths),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "New cases",
          dataIndex: "new_cases",
          key: "new_cases",
          sorter: (a, b) => compare(a.new_cases, b.new_cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Critical",
          dataIndex: "serious_critical",
          key: "serious_critical",
          sorter: (a, b) => compare(a.serious_critical, b.serious_critical),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Active",
          dataIndex: "active_cases",
          key: "active_cases",
          sorter: (a, b) => compare(a.active_cases, b.active_cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Tests",
          dataIndex: "total_tests",
          key: "total_tests",
          sorter: (a, b) => compare(a.total_tests, b.total_tests),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Actions",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["countriesStatistics"]),
  },

  methods: {
    ...mapActions(["fetchCountriesStatistics"]),

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

    downloadExcel() {
      console.log("Download excel");
    },
  },

  watch: {
    modalRecord: {
      handler() {
        this.renderChart();
      },
      deep: true,
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
