<template>
  <div>
    <CRow>
      <CCol lg="12">
        <CTableWrapper
          :items="setWorkersToComponent()"
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
import axios from 'axios'
export default {
  name: 'Workers',
  components: { CTableWrapper },
  data: () => {
    return {
      workers: [],
      attributes: {},
      isLoading : true
    }
  },

 /* beforeRouteEnter: function (to, from, next) {
    function getWorkers() {
      return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
    }

    axios.all([getWorkers()])
            .then(axios.spread((workers) => {
              next(vm => {
                vm.setWorkers(workers);
              })
            }));
  },*/

  methods: {
    setWorkers (response) {
      for (let row of response.data.workers.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.workers = response.data.workers.rows;
    },
    setWorkersToComponent () {
      return this.workers
    },
    getWorkersFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
    },
    refresh() {
      axios.all([this.getWorkersFromApi()])
        .then(axios.spread((workers) => {
          this.setWorkers(workers);
        }));
    }
  }
}
</script>
