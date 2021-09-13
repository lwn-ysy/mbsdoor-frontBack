<template>
  <div class="container">
    <span class="title">示例图</span>
    <el-image
      class="img"
      :src="picUrl"
      :preview-src-list="new Array(picUrl)"
    ></el-image>
  </div>
</template>

<script>
export default {
  name: "PageExample",
  data() {
    return {
      picUrl: "./page-example.png",
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 20px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  .title {
    font-size: 20px;
    margin: 20px 30px 0 0;
  }
  .img {
    width: 120px;
  }
}
</style>

