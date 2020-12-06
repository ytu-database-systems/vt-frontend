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
import axios from 'axios'
export default {
  name: 'Stations',
  components: { CTableWrapper },
  data: () => {
    return {
      stations: [],
      attributes: {},
      isLoading : true
    }
  },

  beforeRouteEnter: function (to, from, next) {
    function getStations() {
      return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
    }

    axios.all([getStations()])
      .then(axios.spread((stations) => {
        next(vm => {
          vm.setStations(stations);
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
    setStationsToComponent () {
      return this.stations
    },
    getStationsFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
    },
    refresh() {
      axios.all([this.getStationsFromApi()])
        .then(axios.spread((stations) => {
          this.setStations(stations);
        }));
    }
  }
}
</script>
