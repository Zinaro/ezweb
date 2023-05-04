<template>
    <div>
      <ckeditor
        :editor="editor"
        v-model="editorData"
        :config="editorConfig"
      ></ckeditor>
    </div>
  </template>
  
  <script>
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
  import CKEditor from "@ckeditor/ckeditor5-vue";
  import "@ckeditor/ckeditor5-build-classic/build/translations/tr";
  
  export default {
    name: "CKEditorPage",
    components: {
      ckeditor: CKEditor.component,
    },
    props: {
      value: {
        type: String,
        required: true,
      },
      config: {
        type: Object,
        default: () => ({
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
          ],
          shouldNotGroupWhenFull: false,
          language: "tr",
          image: {
            toolbar: [
              "imageTextAlternative",
              "|",
              "imageStyle:alignLeft",
              "imageStyle:full",
              "imageStyle:alignRight",
            ],
            styles: ["classic", "alignLeft", "alignRight"],
          },
          theme: 'dark',
        }),
      },
    },
    data() {
      return {
        editor: ClassicEditor,
        editorData: this.value,
        editorConfig: {
          language: "tr",
          ...this.config,
        },
      };
    },
    watch: {
      value(newValue) {
        this.editorData = newValue;
      },
    },
    methods: {
      updateValue() {
        this.$emit("input", this.editorData);
      },
    },
    mounted() {
      this.editorData = this.value;
    },
    beforeUnmount() {
      this.updateValue();
    },
  };
  </script>
<style>
.ck-content {
  color: black !important;
}
.ck.ck-toolbar .ck-button_bold .ck-button__label {
  color: #000;
}
</style>