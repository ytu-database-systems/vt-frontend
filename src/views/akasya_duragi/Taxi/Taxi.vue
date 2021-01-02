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
                <label for="plate" class="float-right">Plate</label>
              </div>
              <div class="col-md-6">
                <input ref="plate" type="text" class="form-control w-100 ml-lg-5" id="plate" placeholder="i.e. 34 ASD 23" required :value="darkModal.data.plate">
              </div>
            </div>
            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="brand" class="float-right">Brand</label>
              </div>
              <div class="col-md-6">
                <input ref="brand" type="text" class="form-control w-100 ml-lg-5" id="brand" placeholder="i.e. Hyundai" required :value="darkModal.data.brand">
              </div>
            </div>
            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="model" class="float-right">Model</label>
              </div>
              <div class="col-md-6">
                <input ref="model" type="text" class="form-control w-100 ml-lg-5" id="model" placeholder="i.e. Getz 1.6" required :value="darkModal.data.model">
              </div>
            </div>

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="capacity" class="float-right">Capacity</label>
              </div>
              <div class="col-md-6">
                <input ref="capacity" type="number" min="5" max="12" class="form-control w-100 ml-lg-5" id="capacity" placeholder="i.e. 5" required :value="darkModal.data.capacity">
              </div>
            </div>

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="stationId" class="float-right">Station</label>
              </div>
              <div class="col-md-6">
                <select ref="stationId" id="stationId" class="form-control custom-select w-100 ml-lg-5">
                  <option disabled>Choose ...</option>
                  <option v-bind:key="station.name"
                          v-bind:value="station.id" v-for="station in stations"
                          :selected="darkModal.data.stationId === station.id"
                  >
                    {{ station.name }}
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
        <h6 class="modal-title">{{darkModal.operation === "edit" ? "Edit Taxi" : "Add Taxi"}}</h6>
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
      stations : []
    }
  },
  props: {
    items: Array,
    fields: {
      type: Array,
      default () {
        return ['id', 'plate', 'brand', 'model', 'capacity', 'station', 'createdAt', 'updatedAt', 'status']
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
    async getStationsFromApi () {
      function getStations() {
        return axios.get(`${process.env.VUE_APP_API_URL}/station`, {responseType: 'json'});
      }
      let response = await getStations();
      return response.data.result.rows;
    },
    showModal (operation, data) {
      this.getStationsFromApi().then((stations) => {
        this.stations = stations;
        this.darkModal.operation = operation;
        this.darkModal.data = data;
        this.darkModal.show = true;
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
      return axiosReq(`${process.env.VUE_APP_API_URL}/taxi`, data ,{responseType: 'json'});
    },

    /**
     * @return {{name: *, status: *}|{}}
     */
    PrepareFormValues() {
      let data = null;
      let reqData = null;
      if (this.darkModal.operation === "edit") {
        data = this.darkModal.data;
        data.plate = this.$refs.plate.value;
        data.brand = this.$refs.brand.value;
        data.model = this.$refs.model.value;
        data.capacity = this.$refs.capacity.value;
        data.stationId = this.$refs.stationId.value;
        data.status = this.$refs.status.value;
        reqData = { ...data };
        delete reqData['_classes'];
        delete reqData['createdAt'];
        delete reqData['updatedAt'];
        delete reqData['station'];
      } else {
        reqData = {
          plate : this.$refs.plate.value,
          brand : this.$refs.brand.value,
          model : this.$refs.model.value,
          capacity : this.$refs.capacity.value,
          stationId : this.$refs.stationId.value,
          status : this.$refs.status.value,
        }
        delete reqData['station'];
      }
      return reqData;
    },
    Delete (data) {
      function DeleteTaxi() {
        return axios.delete(`${process.env.VUE_APP_API_URL}/taxi?id=${data.id}`, {responseType: 'json'});
      }
      axios.all([DeleteTaxi()])
        .then(axios.spread(() => {
          this.darkModal.show = false;
          this.$parent.refresh();
        }));
    }
  }
}
</script>
