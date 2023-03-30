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
        <a-button type="primary" @click="showModal"> Details </a-button>
        <a-modal v-model="visible" title="Basic Modal" @ok="handleOk">
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
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
      country_name: "",
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      columns: [
        {
          title: "Country name",
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
        },
        {
          title: "Cases",
          dataIndex: "cases",
          sorter: (a, b) => compare(a.cases, b.cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "deaths",
          dataIndex: "deaths",
          key: "deaths",
          sorter: (a, b) => compare(a.deaths, b.deaths),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "total_recovered",
          dataIndex: "total_recovered",
          key: "total_recovered",
          sorter: (a, b) => compare(a.total_recovered, b.total_recovered),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "new_deaths",
          dataIndex: "new_deaths",
          key: "new_deaths",
          sorter: (a, b) => compare(a.new_deaths, b.new_deaths),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "new_cases",
          dataIndex: "new_cases",
          key: "new_cases",
          sorter: (a, b) => compare(a.new_cases, b.new_cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "serious_critical",
          dataIndex: "serious_critical",
          key: "serious_critical",
          sorter: (a, b) => compare(a.serious_critical, b.serious_critical),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "active_cases",
          dataIndex: "active_cases",
          key: "active_cases",
          sorter: (a, b) => compare(a.active_cases, b.active_cases),
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "total_tests",
          dataIndex: "total_tests",
          key: "total_tests",
          sorter: (a, b) => compare(a.total_tests, b.total_tests),
          sortDirections: ["descend", "ascend"],
          width: 150,
        },
        {
          title: "Actions",
          key: "action",
          width: 80,
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["countriesStatistics"]),
    arrayOfSpecificCountry: function () {
      let arr = [];
      arr.push(this.worldStatistics);
      return arr;
    },
  },

  methods: {
    ...mapActions(["fetchCountriesStatistics"]),
    showStats: function () {
      console.log(this.countriesStatistics);
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

    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
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
