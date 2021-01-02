<template>
  <div>
    <CRow>
      <CCol lg="12">
        <CTableWrapper
          :items="setVoyagesToComponent()"
          hover
          striped
          border
          small
          fixed
          dark
          caption="Voyages"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import CTableWrapper from './Voyage.vue'
import axios from '../../../api-client'
export default {
  name: 'Voyage',
  components: { CTableWrapper },
  data: () => {
    return {
      voyages: [],
      attributes: {},
      isLoading : true,
      workers : [],
      taxis : []
    }
  },

  beforeRouteEnter: function (to, from, next) {
    function getVoyages() {
      return axios.get(`${process.env.VUE_APP_API_URL}/voyage`, {responseType: 'json'});
    }
    function getWorkers() {
      return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
    }
    function getTaxis() {
      return axios.get(`${process.env.VUE_APP_API_URL}/taxi`, {responseType: 'json'});
    }


    axios.all([getVoyages(), getWorkers(), getTaxis()])
      .then(axios.spread((voyages, workers, taxis) => {
        next(vm => {
          vm.setVoyages(voyages);
          vm.setWorkers(workers);
          vm.setTaxis(taxis);
        })
      }));
  },

  methods: {
    setVoyages (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.voyages = response.data.result.rows;
    },
    setWorkers (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }

      this.workers = response.data.result.rows;
    },
    setTaxis (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.taxis = response.data.result.rows;
    },
    setVoyagesToComponent () {
      for(let voyage of this.voyages){
        if(voyage['workerId']) {
          voyage['driver'] = this.workers.find((x) => x['id'] === voyage['workerId'])['name'];
        } else {
          voyage['manager'] = "None"
        }
        if(voyage['taxiId']) {
          voyage['taxi'] = this.taxis.find((x) => x['id'] === voyage['taxiId'])['plate'];
        } else {
          voyage['taxi'] = "None"
        }
      }
      return this.voyages
    },
    getVoyagesFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/voyage`, {responseType: 'json'});
    },
    getWorkersFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
    },
    getTaxisFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/taxi`, {responseType: 'json'});
    },
    refresh() {
      axios.all([this.getVoyagesFromApi(), this.getWorkersFromApi(), this.getTaxisFromApi()])
        .then(axios.spread((voyages, workers, taxis) => {
          this.setVoyages(voyages);
          this.setWorkers(workers);
          this.setTaxis(taxis);
        }));
    },
  }
}
</script>
