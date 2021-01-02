<template>
  <div>
    <CRow>
      <CCol lg="12">
        <CTableWrapper
          :items="setTaxisToComponent()"
          hover
          striped
          border
          small
          fixed
          dark
          caption="Taxis"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import CTableWrapper from './Taxi.vue'
import axios from '../../../api-client'
export default {
  name: 'Taxis',
  components: { CTableWrapper },
  data: () => {
    return {
      taxis: [],
      attributes: {},
      isLoading : true,
      stations : []
    }
  },

  beforeRouteEnter: function (to, from, next) {
    function getTaxis() {
      return axios.get(`${process.env.VUE_APP_API_URL}/taxi`, {responseType: 'json'});
    }
    function getStations() {
      return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
    }
    axios.all([getTaxis(), getStations()])
            .then(axios.spread((taxis, stations) => {
              next(vm => {
                vm.setTaxis(taxis);
                vm.setStations(stations);
              })
            }));
  },

  methods: {
    setTaxis (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.taxis = response.data.result.rows;
    },
    setStations (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.stations = response.data.result.rows;
    },
    setTaxisToComponent () {
      for(let taxi of this.taxis){
        if(taxi['stationId']) {
          taxi['station'] = this.stations.find((x) => x['id'] === taxi['stationId'])['name'];
        } else {
          taxi['station'] = "None"
        }
      }
      return this.taxis
    },
    getTaxisFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/taxi`, {responseType: 'json'});
    },
    getStationsFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
    },
    refresh() {
      axios.all([this.getTaxisFromApi(), this.getStationsFromApi()])
        .then(axios.spread((taxis, stations) => {
          this.setTaxis(taxis);
          this.setStations(stations);
        }));
    }
  }
}
</script>
