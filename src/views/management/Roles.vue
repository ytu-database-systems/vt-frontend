<template>
  <div>
    <CRow>
      <CCol lg="12">
        <CTableWrapper
          :items="setRolesToComponent()"
          hover
          striped
          border
          small
          fixed
          dark
          caption="Roles"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import CTableWrapper from './Role.vue'
import axios from 'axios'
export default {
  name: 'Roles',
  components: { CTableWrapper },
  /*attributes: null,
  isLoading: true,
  roles: [],*/
  data: () => {
    return {
      roles: [],
      attributes: {},
      isLoading : true
    }
  },

  beforeRouteEnter: function (to, from, next) {
    function getRoles() {
      return axios.get(`${process.env.VUE_APP_API_URL}/role`, {responseType: 'json'});
    }

    axios.all([getRoles()])
            .then(axios.spread((roles) => {
              console.log("roles : ", roles);
              next(vm => {
                vm.setRoles(roles);
              })
            }));
  },

  methods: {
    setRoles (response) {
      for (let row of response.data.result.rows) {
        row["_classes"] = row.status === 1 ? '' :  'table-danger'
      }
      this.roles = response.data.result.rows;
    },
    setRolesToComponent () {
      return this.roles
    },
    getRolesFromApi () {
      return axios.get(`${process.env.VUE_APP_API_URL}/role`, {responseType: 'json'});
    },
    refresh() {
      axios.all([this.getRolesFromApi()])
        .then(axios.spread((roles) => {
          this.setRoles(roles);
        }));
    }
  }
}
</script>
