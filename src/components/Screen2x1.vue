<template>
  <grid-layout
    :layout.sync="local_layout"
    :col-num="12"
    :cols="{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }"
    :row-height="window.height"
    :is-draggable="resizable"
    :is-resizable="resizable"
    :vertical-compact="true"
    :margin="[0, 0]"
    :use-css-transforms="true"
    :autoSize="true"
    responsive
    @layout-updated="layoutUpdatedEvent"
  >
    <grid-item v-for="item in local_layout"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :key="item.i">
        <v-flex :class="`col-${item.i}`">
          <slot :name="item.i" />
        </v-flex>
    </grid-item>
  </grid-layout>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import { SET_LAYOUT } from "@/store/mutations.type";
import VueGridLayout from 'vue-grid-layout';

export default {
  name: "Screen",
  components: {
    VueGridLayout
  },
  data() {
    return {
      local_layout: [],
      window: {
        width: 0,
        height: 0
      }
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight - 65;
    },
    layoutUpdatedEvent(new_layout) {
      store.commit(SET_LAYOUT, JSON.parse(JSON.stringify(new_layout)));
    }
  },
  computed: {
    ...mapGetters(["layout2x1", "resizable"])
  },
  watch:{
    layout2x1: {
      immediate: true,
      handler() {
        this.local_layout = this.layout2x1;
      }
    }
  }
}
</script>

<style scoped lang="sass">
.col-left, .col-right
  background: white
  height: calc(100vh - 65px)
  overflow: auto
  border-right: 1px solid rgba(0,0,0,.12)
</style>