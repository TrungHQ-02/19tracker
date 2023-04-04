import axios from 'axios'

const headers = {
  'X-RapidAPI-Key': '671223b19fmsh5500a57e27e473fp1a850ejsnb9d5a49074e5',
  'X-RapidAPI-Host': 'corona-virus-world-and-india-data.p.rapidapi.com'
}

const apiList = {
  getWorldStatistics: {
    endpoint: 'https://corona-virus-world-and-india-data.p.rapidapi.com/api',
    method: 'GET'
  }
}

const actions = {
  async fetchWorldStatistics({ commit }) {
    try {
      const response = await axios.get(apiList.getWorldStatistics.endpoint, { headers })
      const worldStatistics = response.data.world_total
      const countriesStatistics = response.data.countries_stat
      
      const vietnamStats = countriesStatistics.find(country => country.country_name === 'Vietnam');

      commit('setVietNamStatistics', vietnamStats)
      commit('setCountriesStatistics', countriesStatistics)
      commit('setWorldStatistics', worldStatistics)
    } catch (error) {
      console.error(error)
    }
  },
  updateWorldChartImage({ commit }, image) {
    commit('setWorldChartImage', image);
  },
  updateVietnamChartImage({ commit }, image) {
    commit('setVietnamChartImage', image);
  },
  updateCountryChartImage({ commit }, image) {
    commit('setCountryChartImage', image);
  }

  
}

export default actions
