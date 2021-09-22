<template>
  <div class="dashboard-container">
    <div class="des">
      <div class="dashboard-text">
        用户名:
        <span class="text">{{ nickname }}</span>
      </div>
      <div class="dashboard-text">
        备注:<span class="text">{{ introduction }}</span>
      </div>
      <div class="dashboard-text">
        权限字段:<span class="text">{{ roles }}</span>
      </div>
    </div>
    <div class="wx">
      <el-image :src="wxImg" fit="contain" class="img"></el-image>
      <span>前台：门博士小程序</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      // wxImg:'https://mbsdoor:5000/static/image/wx/wxcode.jpg',
      wxImg: "https://mbsdoor.com:5000/static/image/wx/wxcode.jpg",
    };
  },
  computed: {
    ...mapGetters(["nickname", "introduction", "roles"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    .des {
      display: flex;
      .dashboard-text {
        font-size: 25px;
        flex: 1 0 auto;

        .text {
          font-size: 22px;
          color: #409eff;
          margin-right: 40px;
        }
      }
    }
    .wx {
      margin-top: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img {
        width: 215px;
        height: 215px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
