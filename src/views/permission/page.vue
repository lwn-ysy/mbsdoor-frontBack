<template>
  <div class="container">
    <div class="des-wrapper">
      <el-tag class="des-item">
        权限系统设置，后期根据模块（系统）化来区分为主，比如商品系统-->shop权限值
      </el-tag>
      <el-tag class="des-item" >再辅以只读、可编辑来细分，比如editor-->可编辑</el-tag>
      <el-tag class="des-item">权限系统，一般在项目初立时规定好，避免频繁改动</el-tag>
    </div>
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column prop="role" label="权限值字段" width="180">
      </el-table-column>
      <el-table-column prop="name" label="名字" width="180"> </el-table-column>
      <el-table-column prop="description" label="说明"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "PagePermission",
  data() {
    return {
      tableData: [
        {
          role: "admin",
          name: "管理员",
          description: "拥有所有权限",
        },
        {
          role: "editor",
          name: "编辑员",
          description: "拥有部分系统权限，比如商品系统、活动系统等",
        },
        {
          role: "tourist",
          name: "游客",
          description: "拥有极少权限，一些基本系统，不会涉及修改类的",
        },
      ],
      search: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  .des-wrapper {
    display: flex;
    flex-direction: column;
    margin: 20px 40px;
    .des-item{
      margin-bottom: 10px;
    }
  }
}
</style>
