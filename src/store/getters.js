const getters = {
  worldStatistics (state) {
    return state.worldStatistics
  },
  countriesStatistics (state) {
    return state.countriesStatistics
  },
  vietNamStatistics (state) {
    return state.vietNamStatistics
  },
  worldChartImage: state => state.worldChartImage,
  vietnamChartImage: state => state.vietnamChartImage,
  countryChartImage: state => state.countryChartImage
}

export default getters
