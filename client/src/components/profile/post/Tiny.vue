<template>
  <div class="tiny-wrapper">
    <editor
      ref="editor"
      :value="value"
      :init="tinymceConfig"
      @input="handleInput"
      v-model="editorData"
    />
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "TinyPage",

  props: {
    value: {
      type: String,
      required: true,
    },
  },
  components: {
    editor: Editor,
  },
  data() {
    return {
      editorData: this.value,
      tinymceConfig: {
        branding: false,
        menubar: false,
        plugins:
          "print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help",
        toolbar1:
          "formatselect fontselect fontsizeselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent |  forecolor backcolor | removeformat | table | hr |  link unlink | image media | code",
        toolbar2:
          "undo redo | cut copy paste pastetext | searchreplace | selectall | spellchecker | visualchars visualblocks nonbreaking pagebreak | charmap emoticons | print fullscreen | preview",
        font_formats:
          "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva;",
        toolbar:
          "undo redo | cut copy paste pastetext | searchreplace | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent |  forecolor backcolor | removeformat | table | hr |  link unlink | image media | code",
        toolbar_mode: "floating",
        min_height: 300,
      },
    };
  },
};
</script>
<style>
.tiny-wrapper {
  width: 100%;
}
</style>
