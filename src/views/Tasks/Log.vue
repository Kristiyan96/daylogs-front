<template>
  <div class="editor max-height">
    <Editor
      @contentChange="contentChange"
      @onFocus="onFocus"
      :content="log.content"
    />
    <base-button
      round
      @click="saveDayLog"
      :type="saved ? 'success' : 'warning'"
      class="icon icon-shape p-0 save-log"
    >
      <font-awesome-icon v-if="loading && !saved" icon="spinner" spin />
      <font-awesome-icon v-else icon="save" />
    </base-button>
  </div>
</template>

<script>
import Editor from "@/views/components/Editor";

export default {
  components: {
    Editor
  },
  props: {
    day: {
      type: Date,
      default: () => new Date(),
      description: "Current day"
    }
  },
  data() {
    return {
      log: { content: "" },
      saved: true,
      save_timer: null,
      loading: true
    };
  },
  beforeDestroy() {
    this.saveDayLog();
  },
  methods: {
    getDayLog() {
      this.loading = true;
      this.axios
        .get("/api/logs/1", {
          params: { day: this.day.toString() }
        })
        .then(response => {
          this.log = response.data;
          if (this.log.content == null) {
            this.log.content = "Describe your day in 500 words...";
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            this.$store.dispatch("signedOut");
            this.$router.push("/");
          }
        })
        .finally(() => (this.loading = false));
    },
    saveDayLog() {
      if (this.saved) return;

      this.loading = true;
      this.axios
        .put(`/api/logs/${this.log.id}`, { log: this.log })
        .then(() => {
          setTimeout(() => {
            this.loading = false;
            this.saved = true;
          }, 500);
        })
        .catch(error => {
          if (error.response.status == 401) {
            this.$store.dispatch("signedOut");
            this.$router.push("/");
          }
          this.$store.commit("ADD_ALERT", [
            "Unable to save day's log.",
            "danger"
          ]);
        });
    },
    contentChange(newVal) {
      this.saved = false;
      this.log.content = newVal;
      clearTimeout(this.save_timer);
      this.save_timer = setTimeout(() => {
        this.saveDayLog();
      }, 5000);
    },
    onFocus() {
      if (this.log.content == "Describe your day in 500 words...") {
        this.log.content = "";
      }
    }
  },
  watch: {
    day: {
      immediate: true,
      handler() {
        this.saveDayLog();
        this.getDayLog();
      }
    }
  }
}
</script>

<style lang="sass">
.editor .save-log
  position: absolute
  bottom: 10px
  right: 10px
</style>
