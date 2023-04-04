const mutations = {
   setWorldStatistics (state, worldStatistics) {
     state.worldStatistics = worldStatistics
   },
   setCountriesStatistics (state, countriesStatistics) {
     state.countriesStatistics = countriesStatistics
   },
   setVietNamStatistics (state, vietNamStatistics) {
    state.vietNamStatistics = vietNamStatistics
   },
   setWorldChartImage(state, image) {
    state.worldChartImage = image;
  },
  setVietnamChartImage(state, image) {
    state.vietnamChartImage = image;
  },
  setCountryChartImage(state, image) {
    state.countryChartImage = image;
  }
 }
 
 export default mutations
 