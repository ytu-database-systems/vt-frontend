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
              title="Worker"
              size="md"
              color="dark"
      >
        <form class="form-inline">
          <div class="container">
            <div class="row form-group mb-3">
              <div class="col-md-3">
                <label for="validationServer01" class="float-right">Worker Name</label>
              </div>
              <div class="col-md-6">
                <input ref="name" type="text" class="form-control w-100 ml-lg-5" id="validationServer01" placeholder="i.e. Admin" required :value="darkModal.data.name">
              </div>
            </div>
            <div class="row form-group mb-3">
              <div class="col-md-3">
                <label for="validationServer02" class="float-right">Status</label>
              </div>
              <div class="col-md-6">
                <select ref="status" class="form-control custom-select w-100 ml-lg-5" id="validationServer02" required>
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
import axios from 'axios'
export default {
  name: 'Worker',
  data: () => {
    return {
      darkModal: {
        data : {},
        operation : "",
        show: false
      }
    }
  },
  props: {
    items: Array,
    fields: {
      type: Array,
      default () {
        return ['id', 'name', 'SSN', 'driverLicense', 'gender', 'salary', 'dateOfBirth', 'phone', 'state','address', 'createdAt', 'updatedAt', 'status']
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
    showModal (operation, data) {
      this.darkModal.operation = operation;
      this.darkModal.data = data;
      this.darkModal.show = true;
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
      if (this.darkModal.operation === "edit") {
        data = this.darkModal.data;
        data.name = this.$refs.name.value;
        data.status = this.$refs.status.value;
        reqData = { ...data };
        delete reqData['_classes'];
        delete reqData['createdAt'];
        delete reqData['updatedAt'];
      } else {
        reqData = {
          name : this.$refs.name.value,
          status : this.$refs.status.value
        }
      }
      return reqData;
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
    }
  }
}
</script>
