<template>
  <CCard>
    <CCardHeader>
      <slot name="header">
        <CIcon name="cil-grid"/> {{caption}}
        <CButton  color="success" @click="showModal('add', {})" class="mr-1 float-right">
          Add New
        </CButton>
      </slot>
    </CCardHeader>
    <CCardBody>
      <CDataTable
        :hover="hover"
        :striped="striped"
        :border="border"
        :small="small"
        :fixed="fixed"
        :items="items"
        :fields="fields"
        :items-per-page="small ? 10 : 5"
        :dark="dark"
        pagination
      >
        <template #status="{item}" :class="item.status === 0 ? 'table-danger' : ''">
          <td>
            <CBadge :color="getBadge(item.status)">{{getStatusText(item.status)}}</CBadge>
          </td>
          <td>
            <CButton :color="getBadge(5)" @click="showModal('edit', item)" class="mr-1">
              Edit
            </CButton>
            <cButton :color="getBadge(0)"  @click="Delete(item)">Delete</cButton>
          </td>
        </template>
      </CDataTable>
    </CCardBody>
      <CModal
              :show.sync="darkModal.show"
              :no-close-on-backdrop="false"
              :centered="true"
              title="Taxi"
              size="md"
              color="dark"
      >
        <form class="form-inline">
          <div class="container">

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="workerId" class="float-right">Driver</label>
              </div>
              <div class="col-md-6">
                <select ref="workerId" id="workerId" class="form-control custom-select w-100 ml-lg-5">
                  <option v-bind:key="worker.name"
                          v-bind:value="worker.id" v-for="worker in workers"
                          :selected="darkModal.data.workerId === worker.id"
                  >
                    {{ worker.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="taxiId" class="float-right">Taxi</label>
              </div>
              <div class="col-md-6">
                <select ref="taxiId" id="taxiId" class="form-control custom-select w-100 ml-lg-5">
                  <option v-bind:key="taxi.plate"
                          v-bind:value="taxi.id" v-for="taxi in taxis"
                          :selected="darkModal.data.taxiId === taxi.id"
                  >
                    {{ taxi.plate }} | {{ taxi.brand }} | {{ taxi.model }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="createdAt" class="float-right">Creation Time</label>
              </div>
              <div class="col-md-6">
                <input ref="createdAt" disabled type="text" class="form-control w-100 ml-lg-5" id="createdAt" placeholder="i.e. Admin" required :value="darkModal.data.createdAt">
              </div>
            </div>

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="updatedAt" class="float-right">Last Update Time</label>
              </div>
              <div class="col-md-6">
                <input ref="updatedAt" disabled type="text" class="form-control w-100 ml-lg-5" id="updatedAt" placeholder="i.e. Admin" required :value="darkModal.data.updatedAt">
              </div>
            </div>

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="status" class="float-right">Status</label>
              </div>
              <div class="col-md-6">
                <select ref="status" class="form-control custom-select w-100 ml-lg-5" id="status" required>
                  <option disabled value="">Choose...</option>
                  <option :selected="darkModal.data.status === 1" value=1>Active</option>
                  <option :selected="darkModal.data.status === 0" value=0>Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      <template #header>
        <h6 class="modal-title">{{darkModal.operation === "edit" ? "Edit Voyage" : "Add Voyage"}}</h6>
        <CButtonClose @click="darkModal.show = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="darkModal.show = false" color="danger">Close</CButton>
        <CButton @click="Submit()" color="success">{{darkModal.operation === "edit" ? "Edit" : "Add"}}</CButton>
      </template>
    </CModal>
  </CCard>
</template>


<script>
import axios from '../../../api-client'
export default {
  name: 'Taxi',
  data: () => {
    return {
      darkModal: {
        data : {},
        operation : "",
        show: false
      },
      taxis : [],
      workers: []
    }
  },
  props: {
    items: Array,
    fields: {
      type: Array,
      default () {
        return ['id', 'driver', 'taxi', 'createdAt', 'updatedAt', 'status']
      }
    },
    caption: {
      type: String,
      default: 'Table'
    },
    hover: Boolean,
    striped: Boolean,
    border: Boolean,
    small: Boolean,
    fixed: Boolean,
    dark: Boolean
  },
  methods: {
    getBadge (status) {
      return status === 1 ? 'success'
              : status === 'Inactive' ? 'secondary'
                      : status === 'Pending' ? 'warning'
                              : status === 0 ? 'danger' : 'primary'
    },
    getStatusText (status) {
      return status === 1 ? 'Active'
              : status === 'Inactive' ? 'secondary'
                      : status === 'Pending' ? 'warning'
                              : status === 0 ? 'Inactive' : 'primary'
    },
    async getTaxisFromApi () {
      function getTaxis() {
        return axios.get(`${process.env.VUE_APP_API_URL}/taxi`, {responseType: 'json'});
      }
      let response = await getTaxis();
      return response.data.result.rows;
    },
    async getWorkersFromApi () {
      function getWorkers() {
        return axios.get(`${process.env.VUE_APP_API_URL}/worker`, {responseType: 'json'});
      }
      let response = await getWorkers();
      return response.data.result.rows;
    },
    showModal (operation, data) {
      this.getWorkersFromApi().then((workers) => {
        this.getTaxisFromApi().then((taxis) => {
          this.taxis = taxis;
          this.workers = workers;
          this.darkModal.operation = operation;
          this.darkModal.data = data;
          this.darkModal.show = true;
        })
      });
    },
    Submit (operation, data) {
      axios.all([this.SubmitForm(operation, data)])
        .then(axios.spread(() => {
          this.darkModal.show = false;
          this.$parent.refresh();
        }));
    },
    SubmitForm() {
      let axiosReq = null;
      let data = this.PrepareFormValues();
      if (this.darkModal.operation === "edit") {
        axiosReq = axios.patch;
      } else {
        axiosReq = axios.post;
      }
      return axiosReq(`${process.env.VUE_APP_API_URL}/voyage`, data ,{responseType: 'json'});
    },

    /**
     * @return {{name: *, status: *}|{}}
     */
    PrepareFormValues() {
      let data = null;
      let reqData = null;
      if (this.darkModal.operation === "edit") {
        data = this.darkModal.data;
        data.workerId = this.$refs.workerId.value;
        data.taxiId = this.$refs.taxiId.value;
        data.status = this.$refs.status.value;
        reqData = { ...data };
        delete reqData['_classes'];
        delete reqData['createdAt'];
        delete reqData['updatedAt'];
        delete reqData['driver'];
        delete reqData['taxi'];
      } else {
        reqData = {
          workerId : this.$refs.workerId.value,
          taxiId : this.$refs.taxiId.value,
          status : this.$refs.status.value
        };

        delete reqData['driver'];
        delete reqData['taxi'];
      }
      return reqData;
    },
    Delete (data) {
      function DeleteVoyage() {
        return axios.delete(`${process.env.VUE_APP_API_URL}/voyage?id=${data.id}`, {responseType: 'json'});
      }
      axios.all([DeleteVoyage()])
        .then(axios.spread(() => {
          this.darkModal.show = false;
          this.$parent.refresh();
        }));
    }
  }
}
</script>
