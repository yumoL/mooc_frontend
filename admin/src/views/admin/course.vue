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
              <button v-on:click="editContent(course)" class="btn btn-white btn-xs btn-info btn-round">
                content
              </button>&nbsp;
              <button v-on:click="editSort(course)" class="btn btn-white btn-xs btn-info btn-round">
                sort
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
                  <input v-model="course.sort" class="form-control" disabled>
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

    <div id="course-content-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">edit content</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <div class="col-lg-12">
                  {{ saveContentLabel }}
                </div>
              </div>
              <div class="form-group">
                <div class="col-lg-12">
                  <div id="content"></div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button v-on:click="saveContent()" type="button" class="btn btn-primary">Save</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <div id="course-sort-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">edit sort</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label>Old sort</label>
                <div class="col-lg-9">
                  <input class="form-control" v-model="sort.oldSort" name="oldSort" disabled>
                </div>
              </div>
              <div class="form-group">
                <label>New sort</label>
                <div class="col-lg-9">
                  <input class="form-control" v-model="sort.newSort" name="newSort">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button v-on:click="updateSort()" type="button" class="btn btn-primary">Save</button>
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
      tree: {},
      saveContentLabel: "",
      sort: {
        id: "",
        oldSort: 0,
        newSort: 0
      }
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
      _this.course = {
        sort: _this.$refs.pagination.total + 1
      }
      //do not check any category when add a new course
      _this.tree.checkAllNodes(false);
      $("#form-modal").modal("show");
    },

    edit(course) {
      let _this = this;
      _this.course = $.extend({}, course);
      _this.listCategory(course.id);
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
          || !Validator.require(_this.course.level, "level")
          || !Validator.require(_this.course.charge, "charge")
          || !Validator.require(_this.course.status, "status")
          || !Validator.require(_this.course.sort, "sort")
      ) {
        return;
      }
      let categorys = _this.tree.getCheckedNodes();
      if (Tool.isEmpty(categorys)) {
        Toast.warning("Please choose categories")
        return;
      }
      _this.course.categorys = categorys;

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
      SessionStorage.set(SESSION_KEY_COURSE, course);
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
      _this.tree = $.fn.zTree.init($("#tree"), setting, zNodes);
    },

    /**
     * list category of a course
     * @param courseId
     */
    listCategory(courseId) {
      let _this = this;
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/course/list-category/' + courseId).then((res) => {
        Loading.hide();
        let response = res.data;
        let categorys = response.content;

        //check categories when open editor modal
        _this.tree.checkAllNodes(false);
        for (let i = 0; i < categorys.length; i++) {
          let node = _this.tree.getNodeByParam("id", categorys[i].categoryId);
          _this.tree.checkNode(node, true);
        }
      })
    },

    editContent(course) {
      let _this = this;
      let id = course.id;
      _this.course = course;
      $("#content").summernote({
        focus: true,
        height: 300
      })
      // clean old content
      $("#content").summernote("code", "");

      _this.saveContentLabel = "";
      Loading.show();
      _this.$ajax.get(process.env.VUE_APP_SERVER + '/business/admin/course/find-content/' + id)
          .then((response) => {
            Loading.hide();
            let resp = response.data;
            if (resp.success) {
              $("#course-content-modal").modal({backdrop: 'static', keyboard: false});
              if (resp.content) {
                $("#content").summernote('code', resp.content.content);
              }

              //automatically save in every 5s
              let saveContentInterval = setInterval(function () {
                _this.saveContent();
              }, 5000);
              //clean automatically saving task when close modal
              $("#course-content-modal").on("hidden.bs.modal", function (e) {
                clearInterval(saveContentInterval);
              })
            } else {
              Toast.warning(resp.message);
            }
          })
    },

    saveContent() {
      let _this = this;
      let content = $("#content").summernote("code");
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/course/save-content', {
        id: _this.course.id,
        content: content
      }).then((response) => {
        Loading.hide();
        let resp = response.data;
        if (resp.success) {
          let now = Tool.dateFormat("hh:mm:ss");
          _this.saveContentLabel = "Saved at " + now;
        } else {
          Toast.warning(resp.message);
        }
      })
    },

    editSort(course) {
      let _this = this;
      _this.sort = {
        id: course.id,
        oldSort: course.sort,
        newSort: course.sort
      };
      $("#course-sort-modal").modal("show");
    },

    updateSort() {
      let _this = this;
      if (_this.sort.oldSort === _this.sort.newSort) {
        Toast.warning("Sort stays the same");
        return;
      }
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/course/sort', _this.sort)
          .then((response) => {
            let resp = response.data;
            if (resp.success) {
              Toast.success("Sort has been updated");
              $("#course-sort-modal").modal("hide");
              _this.list(1);
            } else {
              Toast.error("Failed to update sort");
            }
          })
    }
  }
}
</script>