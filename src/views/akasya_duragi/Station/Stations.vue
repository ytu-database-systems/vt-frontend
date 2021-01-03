<template>
  <div>
    <CRow>
      <CCol lg="12">
        <CTableWrapper
          :items="setStationsToComponent()"
          hover
          striped
          border
          small
          fixed
          dark
          caption="Stations"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import CTableWrapper from './Station.vue'
import axios from '../../../api-client'
export default {
  name: 'Stations',
  components: { CTableWrapper },
  data: () => {
    return {
      stations: [],
      workers: [],
      attributes: {},
      isLoading : true
    }
  },

  beforeRouteEnter: function (to, from, next) {
    function getStations() {
      return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
    }
    function getWorkers() {
      return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
    }
    axios.all([getStations(), getWorkers()])
      .then(axios.spread((stations, workers) => {
        next(vm => {
          vm.setStations(stations);
          vm.setWorkers(workers);
        })
      }));
  },

  methods: {
    setStations (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.stations = response.data.result.rows;
    },
    setWorkers (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.workers = response.data.result.rows;
    },
    setStationsToComponent () {
      for(let station of this.stations){
        if(station['managerId']) {
          station['manager'] = this.workers.find((x) => x['id'] === station['managerId'])['name'];
        } else {
          station['manager'] = "None"
        }

      }
      return this.stations
    },
    getStationsFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
    },
    getWorkersFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
    },
    refresh() {
      axios.all([this.getStationsFromApi(), this.getWorkersFromApi()])
        .then(axios.spread((stations, workers) => {
          this.setStations(stations);
          this.setWorkers(workers);
        }));
    }
  }
}
</script>
