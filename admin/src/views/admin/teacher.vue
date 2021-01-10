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

    <div class="row">
      <div v-for="teacher in teachers" class="col-md-3 center">
        <div>
        <span class="profile-picture">
          <img v-show="!teacher.image" class="editable img-responsive editable-click editable-empty"
               src="/ace/assets/images/avatars/profile-pic.jpg" v-bind:title="teacher.intro">
          <img v-show="teacher.image" class="editable img-responsive editable-click editable-empty"
               v-bind:src="teacher.image" v-bind:title="teacher.intro">
        </span>

          <div class="space-4"></div>

          <div class="width-80 label label-info label-xlg arrowed-in arrowed-in-right">
            <div class="inline position-relative">
              <a href="javascript:;" class="user-title-label dropdown-toggle" data-toggle="dropdown">
                <i class="ace-icon fa fa-circle light-green"></i>
                &nbsp;
                <span class="white">{{ teacher.name }}</span>
              </a>
            </div>
          </div>
        </div>
        <div class="space-6"></div>
        <div class="profile-social-links align-center">
          <button v-on:click="edit(teacher)" class="btn btn-xs btn-info">
            <i class="ace-icon fa fa-pencil bigger-120"></i>
          </button> &nbsp;
          <button v-on:click="del(teacher.id)" class="btn btn-xs btn-danger">
            <i class="ace-icon fa fa-trash-o bigger-120"></i>
          </button>
        </div>

        <div class="hr hr16 dotted"></div>
      </div>
    </div>

    <div id="form-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">New teacher</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label>name</label>
                <div col-sm-10>
                  <input v-model="teacher.name" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>image</label>
                <div col-sm-10>
                  <input type="file" v-on:change="uploadImage()" id="file-upload-input">
                  <img v-bind:src="teacher.image" class="img-responsive">
                </div>
              </div>
              <div class="form-group">
                <label>intro</label>
                <div col-sm-10>
                  <textarea v-model="teacher.intro" class="form-control" rows="5"/>
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
  name: "business-teacher",
  data: function () {
    return {
      teacher: {}, //new chapter
      teachers: [],
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
      _this.teacher = {};
      $("#form-modal").modal("show");
    },

    edit(teacher) {
      let _this = this;
      _this.teacher = $.extend({}, teacher);
      $("#form-modal").modal("show");
    },

    list(page) {
      let _this = this;
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/teacher/list', {
        page: page,
        size: _this.$refs.pagination.size
      })
          .then((response) => {
            Loading.hide();
            let resp = response.data;
            _this.teachers = resp.content.list;
            _this.$refs.pagination.render(page, resp.content.total);
          })
    },

    save() {
      let _this = this;
      //validation
      if (1 != 1
          || !Validator.length(_this.teacher.name, "name", 1, 50)
          || !Validator.require(_this.teacher.intro, "intro")
          || !Validator.length(_this.teacher.intro, "intro", 1, 500)
      ) {
        return;
      }

      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/teacher/save',
          _this.teacher
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
      Confirm.show("The deleted teacher cannot be reverted!", function () {
        Loading.show();
        _this.$ajax.delete(process.env.VUE_APP_SERVER + '/business/admin/teacher/delete/' + id)
            .then((response) => {
              Loading.hide();
              let resp = response.data
              if (resp.success) {
                _this.list(1);
                Toast.success("You deleted an item!")
              }
            })
      })
    },

    uploadImage() {
      let _this = this;
      let formData = new window.FormData();
      //key: "file" should be the same as the parameter in controller of backend
      formData.append("file", document.querySelector("#file-upload-input").files[0]);
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/file/admin/upload',
          formData
      ).then((response) => {
        Loading.hide();
        let resp = response.data;
        let image = resp.content;
        console.log("avatar path", image);
        _this.teacher.image = image;
      })

    }
  }
}
</script>