<template>
  <div>
    <CRow>
      <CCol lg="12">
        <CTableWrapper
          :workers="setWorkersToComponent()"
          hover
          striped
          border
          small
          fixed
          dark
          caption="Workers"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import CTableWrapper from './Worker.vue'
import axios from '../../../api-client'
export default {
  name: 'Workers',
  components: { CTableWrapper },
  data: () => {
    return {
      workers: [],
      attributes: {},
      isLoading : true,
      stations : []
    }
  },

  beforeRouteEnter: function (to, from, next) {
    function getWorkers() {
      return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
    }
    function getStations() {
      return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
    }
    axios.all([getWorkers(), getStations()])
            .then(axios.spread((workers, stations) => {
              next(vm => {
                vm.setWorkers(workers);
                vm.setStations(stations)
              })
            }));
  },

  methods: {
    setWorkers (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
        row['dateOfBirth'] = this.dateToYYYYMMDD(row['dateOfBirth']);
      }

      this.workers = response.data.result.rows;
    },
    setStations (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.stations = response.data.result.rows;
    },
    setWorkersToComponent () {

      for(let worker of this.workers){
        if(worker['managerId']) {
          worker['manager'] = this.workers.find((x) => x['id'] === worker['managerId'])['name'];
        } else {
          worker['manager'] = "None"
        }
        if(worker['stationId']) {
          worker['station'] = this.stations.find((x) => x['id'] === worker['stationId'])['name'];
        } else {
          worker['station'] = "None"
        }
      }
      return this.workers
    },
    getWorkersFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
    },
    getStationsFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
    },
    refresh() {
      axios.all([this.getWorkersFromApi(), this.getStationsFromApi()])
        .then(axios.spread((workers, stations) => {
          this.setWorkers(workers);
          this.setStations(stations);
        }));
    },
    dateToYYYYMMDD(d) {
      // alternative implementations in https://stackoverflow.com/q/23593052/1850609
      console.log("dateToYYYYMMDD : ", d);
      return d.split('T')[0]
    }
  }
}
</script>
