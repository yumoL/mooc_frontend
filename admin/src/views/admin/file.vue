<template>
  <div>
    <p>
      <button v-on:click="list(1)" class="btn btn-white btn-default btn-round">
        <i class="ace-icon fa fa-refresh red2"></i>
        Refresh
      </button>

    </p>

    <pagination ref="pagination" v-bind:list="list" v-bind:itemCount=5></pagination>

    <table id="simple-table" class="table table-bordered table-hover">
      <thead>
      <tr>
      <th>id</th>

      <th>path</th>

      <th>name</th>

      <th>suffix</th>

      <th>size</th>

      <th>use</th>

      </tr>
      </thead>

      <tbody>
      <tr v-for="file in files">
        <td>{{file.id}}</td>
        <td>{{file.path}}</td>
        <td>{{file.name}}</td>
        <td>{{file.suffix}}</td>
        <td>{{file.size}}</td>
        <td>{{FILE_USE | optionKV(file.use)}}</td>

      </tr>
      </tbody>
    </table>

  </div>

</template>

<script>
import Pagination from "../../components/pagination";

export default {
  components: {Pagination},
  name: "file-file",
  data: function () {
    return {
      file: {}, //new chapter
      files: [],
      FILE_USE: FILE_USE,
    }
  },
  mounted: function () {
    let _this = this;
    _this.$refs.pagination.size = 5;
    _this.list(1);
  },
  methods: {
    list(page) {
      let _this = this;
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/file/admin/file/list', {
        page: page,
        size: _this.$refs.pagination.size
      })
          .then((response) => {
            Loading.hide();
            let resp = response.data;
            _this.files = resp.content.list;
            _this.$refs.pagination.render(page, resp.content.total);
          })
    },

  }
}
</script>