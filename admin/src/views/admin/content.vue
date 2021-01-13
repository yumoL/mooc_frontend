<template>
  <div>
    <h4 class="lighter">
      <i class="ice-icon fa fa-hand-o-right icon-animated-hand-pointer blue"></i>
      <router-link to="business/course" class="pink">{{ course.name }}</router-link>
    </h4>
    <hr>

    <file v-bind:input-id="'content-file-upload'"
          v-bind:text="'upload files for content'"
          v-bind:suffixes="['jpg','jpeg','png','mp4']"
          v-bind:use="FILE_USE.COURSE.key"
          v-bind:after-upload="afterUploadContentFile"></file>
    <br>
    <table id="file-table" class="table table-bordered table-hover">
      <thead>
      <tr>
        <th>name</th>
        <th>url</th>
        <th>size</th>
        <th>operation</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(f,i) in contentFiles" v-bind:key="f.id">
        <td>{{ f.name }}</td>
        <td>{{ f.url }}</td>
        <td>{{ f.size|formatFileSize }}</td>
        <td>
          <button v-on:click="delFile(f)" class="btn btn-white btn-xs btn-warning btn-round">
            <i class="ace-icon fa fa-times red2"></i>
            delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
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
    <p>
      <button v-on:click="saveContent()" type="button" class="btn btn-white btn-info btn-round">
        <i class="ice-icon fa fa-plus blue"></i>
        Save
      </button>
      <router-link to="/business/course" type="button" class="btn btn-white btn-default btn-round" data-dismiss="modal">
        <i class="ice-icon fa fa-times"></i>
        back to course
      </router-link>
    </p>
  </div>
</template>

<script>
import File from "../../components/file";

export default {
  components: {File},
  name: "business-course-content",
  data: function () {
    return {
      course: {},
      FILE_USE: FILE_USE,
      saveContentLabel: "",
      contentFiles: [],
      saveContentInterval: {},
    }
  },
  mounted: function () {
    let _this = this;
    let course = SessionStorage.get(SESSION_KEY_COURSE) || {};
    if (Tool.isEmpty(course)) {
      _this.$router.push("/welcome");
    }
    _this.course = course;

    _this.initEditor();

    _this.$parent.activeSidebar("business-course-sidebar");
  },
  destroyed: function () {
    let _this = this;
    clearInterval(_this.saveContentInterval);
  },
  methods: {
    initEditor() {
      let _this = this;
      let course = _this.course;
      let courseId = course.id;

      $("#content").summernote({
        focus: true,
        height: 300
      })
      // clean old content
      $("#content").summernote("code", "");

      // get files for the content
      _this.listContentFiles();

      Loading.show();
      _this.$ajax.get(process.env.VUE_APP_SERVER + '/business/admin/course/find-content/' + courseId)
          .then((response) => {
            Loading.hide();
            let resp = response.data;
            if (resp.success) {
              if (resp.content) {
                $("#content").summernote('code', resp.content.content);
              }

              //automatically save in every 5s
              _this.saveContentInterval = setInterval(function () {
                _this.saveContent();
              }, 5000);
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

    listContentFiles() {
      let _this = this;
      _this.$ajax.get(process.env.VUE_APP_SERVER + "/business/admin/course-content-file/list/" + _this.course.id)
          .then((response) => {
            let resp = response.data;
            if (resp.success) {
              _this.contentFiles = resp.content;
            }
          })
    },

    afterUploadContentFile(resp) {
      let _this = this;
      let file = resp.content;
      file.courseId = _this.course.id;
      file.url = file.path;
      _this.$ajax.post(process.env.VUE_APP_SERVER + "/business/admin/course-content-file/save", file)
          .then((response) => {
            let resp = response.data;
            if (resp.success) {
              Toast.success("File was uploaded")
              _this.contentFiles.push(resp.content);
            }
          })
    },

    delFile(file) {
      let _this = this;
      Confirm.show("File cannot be reverted after deletion, sure to delete?", function () {
        _this.$ajax.delete(process.env.VUE_APP_SERVER + "/business/admin/course-content-file/delete/" + file.id)
            .then((response) => {
              let resp = response.data;
              if (resp.success) {
                Toast.success("File was deleted");
                Tool.removeObj(_this.contentFiles, file);
              }
            })
      })
    },
  }
}
</script>