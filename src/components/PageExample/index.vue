<template>
  <div class="container">
    <el-drawer title="微信小程序-界面示例" :visible.sync="drawer">
      <el-image
        :src="picUrl"
        fit="contain"
        :preview-src-list="new Array(picUrl)"
      ></el-image>
    </el-drawer>
    <div class="btn-wrapper">
      <el-button
        type="primary"
        icon="el-icon-right"
        circle
        @click="change"
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageExample",
  data() {
    return {
      picUrl: "https://mbsdoor.com:5000/static/image/wx/page-example.png",
      drawer: false,
    };
  },
  methods: {
    change() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  .btn-wrapper {
    position: fixed;
    right: 0px;
    top: 50%;
    z-index: 99;
  }
}
</style>

