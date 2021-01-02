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
        :items="workers"
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
              title="Worker"
              size="md"
              color="dark"
      >
        <form class="form-inline">
          <div class="container">
            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="name" class="float-right">Worker Name</label>
              </div>
              <div class="col-md-6">
                <input ref="name" type="text" class="form-control w-100 ml-lg-5" id="name" placeholder="i.e. Usman Aga" required :value="darkModal.data.name">
              </div>
            </div>
            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="SSN" class="float-right">SSN</label>
              </div>
              <div class="col-md-6">
                <input ref="SSN" type="text" class="form-control w-100 ml-lg-5" id="SSN" placeholder="i.e. ###########" required :value="darkModal.data.SSN">
              </div>
            </div>
            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="driverLicense" class="float-right">Driver License</label>
              </div>
              <div class="col-md-6">
                <input ref="driverLicense" type="text" class="form-control w-100 ml-lg-5" id="driverLicense" placeholder="i.e. A, B ..." required :value="darkModal.data.driverLicense">
              </div>
            </div>
            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="gender" class="float-right">Gender</label>
              </div>
              <div class="col-md-6">
                <select ref="gender" class="form-control custom-select w-100 ml-lg-5" id="gender" required>
                  <option disabled value="">Choose...</option>
                  <option :selected="darkModal.data.gender === 'M'" value="M">Male</option>
                  <option :selected="darkModal.data.gender === 'F'" value="F">Female</option>
                  <option :selected="darkModal.data.gender === '?'" value="?">Secret</option>
                </select>
              </div>
            </div>

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="salary" class="float-right">Salary</label>
              </div>
              <div class="col-md-6">
                <input ref="salary" type="text" class="form-control w-100 ml-lg-5" id="salary" placeholder="i.e. 3500" required :value="darkModal.data.salary">
              </div>
            </div>


            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="dateOfBirth" class="float-right">Birth Date</label>
              </div>
              <div class="col-md-6">
                <input ref="dateOfBirth" type="date" class="form-control w-100 ml-lg-5" id="dateOfBirth" required :value="darkModal.data.dateOfBirth">
              </div>
            </div>


            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="phone" class="float-right">Phone</label>
              </div>
              <div class="col-md-6">
                <input ref="phone" type="tel" class="form-control w-100 ml-lg-5" id="phone" placeholder="i.e. ### ### ## ##" required :value="darkModal.data.phone">
              </div>
            </div>


            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="address" class="float-right">Address</label>
              </div>
              <div class="col-md-6">
                <input ref="address" type="text" class="form-control w-100 ml-lg-5" id="address" placeholder="i.e. Admin" required :value="darkModal.data.address">
              </div>
            </div>

            <div class="row form-group mb-3">
              <div class="col-md-4">
                <label for="managerId" class="float-right">Manager</label>
              </div>
              <div class="col-md-6">
                <select ref="managerId" id="managerId" class="form-control custom-select w-100 ml-lg-5">
                  <option v-bind:key="worker.name"
                          v-bind:value="worker.id" v-for="worker in workers"
                          :selected="darkModal.data.managerId === worker.id"
                  >
                    {{ worker.name }}
                  </option>
                </select>
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
        <h6 class="modal-title">{{darkModal.operation === "edit" ? "Edit Worker" : "Add Worker"}}</h6>
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
  name: 'Worker',
  props: {
    workers: Array,
    fields: {
      type: Array,
      default () {
        return ['id', 'name', 'SSN', 'manager', 'station', 'driverLicense', 'gender', 'salary', 'dateOfBirth', 'phone', 'address', 'createdAt', 'updatedAt', 'status']
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
      return axiosReq(`${process.env.VUE_APP_API_URL}/worker`, data ,{responseType: 'json'});
    },

    /**
     * @return {{name: *, status: *}|{}}
     */
    PrepareFormValues() {
      let data = null;
      let reqData = null;
      if (this.darkModal.operation === "edit") { // update
        data = this.darkModal.data;
        data.name = this.$refs.name.value;
        data.SSN = this.$refs.SSN.value;
        data.driverLicense = this.$refs.driverLicense.value;
        data.gender = this.$refs.gender.value;
        data.salary = this.$refs.salary.value;
        data.dateOfBirth = this.$refs.dateOfBirth.value;
        data.phone = this.$refs.phone.value;
        data.address = this.$refs.address.value;

        data.stationId = this.$refs.stationId.value;
        data.managerId = this.$refs.managerId.value;
        data.status = this.$refs.status.value;
        reqData = { ...data };
        delete reqData['_classes'];
        delete reqData['createdAt'];
        delete reqData['manager'];
        delete reqData['station'];
        delete reqData['updatedAt'];
      } else { // insert
        let datePieces = this.$refs.dateOfBirth.value.split('-');
        let birthDate = new Date(datePieces[0], datePieces[1] - 1, datePieces[2]);
        reqData = {
          name : this.$refs.name.value,
          SSN : this.$refs.SSN.value,
          driverLicense : this.$refs.driverLicense.value,
          gender : this.$refs.gender.value,
          salary : this.$refs.salary.value,
          dateOfBirth : birthDate,
          phone : this.$refs.phone.value,
          address : this.$refs.address.value,
          stationId : this.$refs.stationId.value,
          managerId : this.$refs.managerId.value,
          status : this.$refs.status.value
        }

        delete reqData['manager'];
        delete reqData['station'];
      }

      return this.cleanNullValues(reqData);
    },
    Delete (data) {
      function DeleteWorker() {
        return axios.delete(`${process.env.VUE_APP_API_URL}/worker?id=${data.id}`, {responseType: 'json'});
      }
      axios.all([DeleteWorker()])
        .then(axios.spread(() => {
          this.darkModal.show = false;
          this.$parent.refresh();
        }));
    },
    cleanNullValues(obj) {
      for (let propName in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(propName) && obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
      return obj
    }
  }
}
</script>
