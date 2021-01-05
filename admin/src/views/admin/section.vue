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

      <th>title</th>

      <th>course_id</th>

      <th>chapter_id</th>

      <th>video</th>

      <th>time</th>

      <th>charge</th>

      <th>sort</th>


      <th>operations</th>

      </tr>
      </thead>

      <tbody>
      <tr v-for="section in sections">
        <td>{{section.id}}</td>
        <td>{{section.title}}</td>
        <td>{{section.courseId}}</td>
        <td>{{section.chapterId}}</td>
        <td>{{section.video}}</td>
        <td>{{section.time}}</td>
        <td>{{ SECTION_CHARGE | optionKV(section.charge) }}</td>
        <td>{{section.sort}}</td>
        <td>
          <div class="hidden-sm hidden-xs btn-group">
            <button v-on:click="edit(section)" class="btn btn-xs btn-info">
              <i class="ace-icon fa fa-pencil bigger-120"></i>
            </button>
            <button v-on:click="del(section.id)" class="btn btn-xs btn-danger">
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
            <h4 class="modal-title">New section</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label>title</label>
                <div col-sm-10>
                  <input v-model="section.title" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>course_id</label>
                <div col-sm-10>
                  <input v-model="section.courseId" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>chapter_id</label>
                <div col-sm-10>
                  <input v-model="section.chapterId" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>video</label>
                <div col-sm-10>
                  <input v-model="section.video" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>time</label>
                <div col-sm-10>
                  <input v-model="section.time" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>charge</label>
                <div col-sm-10>
                  <select v-model="section.charge" class="form-control">
                    <option v-for="o in SECTION_CHARGE" v-bind:value="o.key">{{o.value}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>sort</label>
                <div col-sm-10>
                  <input v-model="section.sort" class="form-control">
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
  name: "business-section",
  data: function () {
    return {
      section: {}, //new chapter
      sections: [],
      SECTION_CHARGE: SECTION_CHARGE
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
      _this.section = {};
      $("#form-modal").modal("show");
    },

    edit(section) {
      let _this = this;
      _this.section = $.extend({}, section);
      $("#form-modal").modal("show");
    },

    list(page) {
      let _this = this;
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/section/list', {
        page: page,
        size: _this.$refs.pagination.size
      })
          .then((response) => {
            Loading.hide();
            let resp = response.data;
            _this.sections = resp.content.list;
            _this.$refs.pagination.render(page, resp.content.total);
          })
    },

    save() {
      let _this = this;
      //validation
      if(1 != 1
        || !Validator.length(_this.section.title, "title", 1, 50)
        || !Validator.require(_this.section.courseId, "course_id")
        || !Validator.require(_this.section.chapterId, "chapter_id")
        || !Validator.require(_this.section.video, "video")
        || !Validator.length(_this.section.video, "video", 1, 200)
        || !Validator.require(_this.section.time, "time")
        || !Validator.require(_this.section.charge, "charge")
        || !Validator.require(_this.section.sort, "sort")
      ) {
        return;
      }

      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/section/save',
          _this.section
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
      Confirm.show("The deleted section cannot be reverted!", function () {
        Loading.show();
        _this.$ajax.delete(process.env.VUE_APP_SERVER + '/business/admin/section/delete/' + id)
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