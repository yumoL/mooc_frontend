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
      <div v-for="course in courses" class="col-md-4">
        <div class="thumbnail search-thumbnail">
          <img v-show="!course.image" class="media-object" src="/static/image/demo-course.jpg"/>
          <img v-show="course.image" class="media-object" v-bind:src="course.image"/>
          <div class="caption">
            <div class="clearfix">
              <span class="pull-right label label-primary info-label">
                <td>{{ COURSE_LEVEL | optionKV(course.level) }}</td>
              </span>
              <span class="pull-right label label-primary info-label">
                <td>{{ COURSE_CHARGE | optionKV(course.charge) }}</td>
              </span>
              <span class="pull-right label label-primary info-label">
                <td>{{ COURSE_STATUS | optionKV(course.status) }}</td>
              </span>
            </div>
            <h3 class="search-title">
              <a href="#" class="blue">{{ course.name }}</a>
            </h3>
            <p>{{ course.summary }}</p>
            <p>
              <span class="badge badge-info">{{ course.id }}</span>
              <span class="badge badge-info">order: {{ course.sort }}</span>
              <span class="badge badge-info">duration: {{ course.time | formatSecond }}</span>
            </p>
            <p>
              <button v-on:click="toChapter(course)" class="btn btn-white btn-xs btn-info btn-round">
                chapter
              </button>&nbsp;
              <button v-on:click="edit(course)" class="btn btn-white btn-xs btn-info btn-round">
                edit
              </button>&nbsp;
              <button v-on:click="del(course.id)" class="btn btn-white btn-xs btn-warning btn-round">
                delete
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div id="form-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">New course</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label">
                  category
                </label>
                <div class="col-sm-10">
                  <ul id="tree" class="ztree"></ul>
                </div>
              </div>
              <div class="form-group">
                <label>name</label>
                <div col-sm-10>
                  <input v-model="course.name" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>summary</label>
                <div col-sm-10>
                  <input v-model="course.summary" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>time</label>
                <div col-sm-10>
                  <input v-model="course.time" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>price</label>
                <div col-sm-10>
                  <input v-model="course.price" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>image</label>
                <div col-sm-10>
                  <input v-model="course.image" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>level</label>
                <div col-sm-10>
                  <select v-model="course.level" class="form-control">
                    <option v-for="o in COURSE_LEVEL" v-bind:value="o.key">{{ o.value }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>charge</label>
                <div col-sm-10>
                  <select v-model="course.charge" class="form-control">
                    <option v-for="o in COURSE_CHARGE" v-bind:value="o.key">{{ o.value }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>status</label>
                <div col-sm-10>
                  <select v-model="course.status" class="form-control">
                    <option v-for="o in COURSE_STATUS" v-bind:value="o.key">{{ o.value }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>enroll</label>
                <div col-sm-10>
                  <input v-model="course.enroll" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>sort</label>
                <div col-sm-10>
                  <input v-model="course.sort" class="form-control">
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
  name: "business-course",
  data: function () {
    return {
      course: {}, //new chapter
      courses: [],
      COURSE_LEVEL: COURSE_LEVEL,
      COURSE_CHARGE: COURSE_CHARGE,
      COURSE_STATUS: COURSE_STATUS,
      categorys: [],
    }
  },
  mounted: function () {
    let _this = this;
    _this.$refs.pagination.size = 5;
    _this.allCategory();
    _this.list(1);
  },
  methods: {
    add() {
      let _this = this;
      _this.course = {};
      $("#form-modal").modal("show");
    },

    edit(course) {
      let _this = this;
      _this.course = $.extend({}, course);
      $("#form-modal").modal("show");
    },

    list(page) {
      let _this = this;
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/course/list', {
        page: page,
        size: _this.$refs.pagination.size
      })
          .then((response) => {
            Loading.hide();
            let resp = response.data;
            _this.courses = resp.content.list;
            _this.$refs.pagination.render(page, resp.content.total);
          })
    },

    save() {
      let _this = this;
      //validation
      if (1 != 1
          || !Validator.length(_this.course.name, "name", 1, 50)
          || !Validator.require(_this.course.summary, "summary")
          || !Validator.length(_this.course.summary, "summary", 1, 2000)
          || !Validator.require(_this.course.time, "time")
          || !Validator.require(_this.course.price, "price")
          || !Validator.require(_this.course.image, "image")
          || !Validator.length(_this.course.image, "image", 1, 100)
          || !Validator.require(_this.course.level, "level")
          || !Validator.require(_this.course.charge, "charge")
          || !Validator.require(_this.course.status, "status")
          || !Validator.require(_this.course.enroll, "enroll")
          || !Validator.require(_this.course.sort, "sort")
      ) {
        return;
      }

      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/course/save',
          _this.course
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
      Confirm.show("The deleted course cannot be reverted!", function () {
        Loading.show();
        _this.$ajax.delete(process.env.VUE_APP_SERVER + '/business/admin/course/delete/' + id)
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

    toChapter(course) {
      let _this = this;
      SessionStorage.set("course", course);
      _this.$router.push("/business/chapter");
    },

    /**
     * get all category
     */
    allCategory() {
      let _this = this;
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/category/all')
          .then((response) => {
            Loading.hide();
            let resp = response.data;
            _this.categorys = resp.content;
            _this.initTree();
          })
    },

    initTree() {
      let _this = this;
      let setting = {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            idKey: "id",
            pIdKey: "parent",
            rootPId: "00000000",
            enable: true
          }
        }
      };

      let zNodes = _this.categorys;
      $.fn.zTree.init($("#tree"), setting, zNodes);
    }
  }
}
</script>