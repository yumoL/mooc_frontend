<template>
  <div>
    <button type="button" v-on:click="selectFile()" class="btn btn-white btn-default btn-round">
      <i class="ace-icon fa fa-upload"></i>
      {{ text }}
    </button>
    <input class="hidden" type="file" ref="file" v-on:change="uploadFile()" v-bind:id="inputId+'-input'">
  </div>
</template>

<script>
export default {
  name: 'file',
  props: {
    text: {
      default: "upload file",
    },
    inputId: {
      default: "file-upload"
    },
    suffixes: {
      default: []
    },
    use: {
      default: ""
    },
    afterUpload: {
      type: Function,
      default: null
    }
  },
  data: function () {
    return {}
  },

  methods: {
    uploadFile() {
      let _this = this;
      let formData = new window.FormData();
      let file = _this.$refs.file.files[0];

      // check file type
      let suffixes = _this.suffixes;
      let fileName = file.name;
      let suffix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
      let validSuffix = false;
      for (let i = 0; i < suffixes.length; i++) {
        if (suffixes[i].toLowerCase() === suffix) {
          validSuffix = true;
          break;
        }
      }
      if (!validSuffix) {
        Toast.warning("invalid type, only allow " + suffixes);
        $(`#${_this.inputId}-input`).val("");
        return;
      }

      //key: "file" should be the same as the parameter in controller of backend
      formData.append("file", file);
      formData.append("use", _this.use);
      Loading.show();
      _this.$ajax.post(process.env.VUE_APP_SERVER + '/file/admin/upload',
          formData
      ).then((response) => {
        Loading.hide();
        let resp = response.data;
        console.log("file was uploaded", resp);
        _this.afterUpload(resp);
        $(`#${_this.inputId}-input`).val("");
      })

    },

    selectFile() {
      let _this = this;
      $(`#${_this.inputId}-input`).trigger("click");
    }
  }
}
</script>
