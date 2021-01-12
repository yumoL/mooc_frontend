<template>
  <div>
    <p>
      <button v-on:click="add()" class="btn btn-white btn-default btn-round">
        <i class="ace-icon fa fa-edit"></i>
        Add
      </button>
      &nbsp;
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


      <th>operations</th>

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
        <td>
          <div class="hidden-sm hidden-xs btn-group">
            <button v-on:click="edit(file)" class="btn btn-xs btn-info">
              <i class="ace-icon fa fa-pencil bigger-120"></i>
            </button>
            <button v-on:click="del(file.id)" class="btn btn-xs btn-danger">
              <i class="ace-icon fa fa-trash-o bigger-120"></i>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <div id="form-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">New file</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label>path</label>
                <div col-sm-10>
                  <input v-model="file.path" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>name</label>
                <div col-sm-10>
                  <input v-model="file.name" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>suffix</label>
                <div col-sm-10>
                  <input v-model="file.suffix" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>size</label>
                <div col-sm-10>
                  <input v-model="file.size" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>use</label>
                <div col-sm-10>
                  <select v-model="file.use" class="form-control">
                    <option v-for="o in FILE_USE" v-bind:value="o.key">{{o.value}}</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button v-on:click="save()" type="button" class="btn btn-primary">Save</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

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
    add() {
      let _this = this;
      _this.file = {};
      $("#form-modal").modal("show");
    },

    edit(file) {
      let _this = this;
      _this.file = $.extend({}, file);
      $("#form-modal").modal("show");
    },

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

    save() {
      let _this = this;
      //validation
      if(1 != 1
        || !Validator.length(_this.file.path, "path", 1, 100)
        || !Validator.require(_this.file.name, "name")
        || !Validator.length(_this.file.name, "name", 1, 100)
        || !Validator.require(_this.file.suffix, "suffix")
        || !Validator.length(_this.file.suffix, "suffix", 1, 10)
        || !Validator.require(_this.file.size, "size")
        || !Validator.require(_this.file.use, "use")
      ) {
        return;
      }

      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/file/admin/file/save',
          _this.file
      )
          .then((response) => {
            Loading.hide();
            let resp = response.data
            if (resp.success) {
              $("#form-modal").modal("hide");
              _this.list(1);
              Toast.success("A new item has been successfully saved!")
            } else {
              Toast.warning(resp.message);
            }
          })
    },

    del(id) {
      let _this = this;
      Confirm.show("The deleted file cannot be reverted!", function () {
        Loading.show();
        _this.$ajax.delete(process.env.VUE_APP_SERVER + '/file/admin/file/delete/' + id)
            .then((response) => {
              Loading.hide();
              let resp = response.data
              if (resp.success) {
                _this.list(1);
                Toast.success("You deleted an item!")
              }
            })
      })
    }
  }
}
</script>