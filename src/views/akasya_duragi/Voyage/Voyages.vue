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
import CTableWrapper from './Voyage.vue'
import axios from 'axios'
export default {
  name: 'Voyage',
  components: { CTableWrapper },
  data: () => {
    return {
      taxis: [],
      attributes: {},
      isLoading : true
    }
  },

 /* beforeRouteEnter: function (to, from, next) {
    function getTaxis() {
      return axios.get(`${process.env.VUE_APP_API_URL}/taxi`, {responseType: 'json'});
    }

    axios.all([getTaxis()])
            .then(axios.spread((taxis) => {
              next(vm => {
                vm.setTaxis(taxis);
              })
            }));
  },*/

  methods: {
    setTaxis (response) {
      for (let row of response.data.taxis.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.taxis = response.data.taxis.rows;
    },
    setTaxisToComponent () {
      return this.taxis
    },
    getTaxisFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/taxi`, {responseType: 'json'});
    },
    refresh() {
      axios.all([this.getTaxisFromApi()])
        .then(axios.spread((taxis) => {
          this.setTaxis(taxis);
        }));
    }
  }
}
</script>
