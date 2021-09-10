<template>
  <div class="container">
    <!-- 表格 -->
    <el-table
      stripe
      :data="
        tableData.filter(
          (data) =>
            !search ||
            data.nickname.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column label="账号" prop="account"> </el-table-column>
      <el-table-column label="昵称" prop="nickname"> </el-table-column>
      <el-table-column label="权限" prop="rolename" min-width="220px">
        <template slot-scope="scope">
          <el-tag
            class="role-tableItem"
            type="success"
            v-for="role in scope.row.rolename"
            :key="role"
            >{{ role }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column align="right" min-width="220px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
          ></el-input>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="goUpdateDialog(scope.row)"
            >更新权限</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="goDeleteDialog(scope.row)"
            >清空所有权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑和增加dialog -->
    <el-dialog :title="formLableTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input
            v-model="form.account"
            disabled
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input
            v-model="form.nickname"
            suffix-icon="el-icon-date"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.roleID" size="small">
            <el-checkbox class="role-fromItem" :label="1" border
              >admin</el-checkbox
            >
            <el-checkbox class="role-fromItem" :label="2" border
              >editor</el-checkbox
            >
            <el-checkbox class="role-fromItem" :label="3" border
              >tourist</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除dialg -->
    <el-dialog title="删除提示" :visible.sync="dialogVisble" width="30%" center>
      <div>确认要清空所有权限？</div>
      <div class="mgl-10 mgtb-10">账号：{{ this.deleteData.account }}</div>
      <div class="mgl-10">
        已有权限：
        <el-tag
          class="role-tableItem"
          type="success"
          v-for="role in this.deleteData.rolename"
          :key="role"
          >{{ role }}</el-tag
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="hanldeDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRole, deleteRole, updateRole } from "@/api/role.js";
export default {
  name: "RolePermission",

  data() {
    return {
      // table data
      tableData: [
        {
          userID: "123456",
          account: "admin",
          nickname: "林伟楠",
          rolenames: ["admin", "editor"],
          roleID: [1, 2],
        },
        {
          userID: "123456",
          account: "admin",
          nickname: "林伟楠",
          rolenames: ["admin", "editor", "tourist"],
          roleID: [1, 2, 3],
        },
      ],
      search: "",
      tableLoading: true,
      // dialogForm data no.1 for add/update
      dialogFormVisible: false,
      form: {
        userID: "",
        account: "",
        nickname: "",
        rolenames: [],
        roleID: [],
      },
      formLabelWidth: "120px",
      passwordDisabled: true,
      formLableTitle: "权限更改",
      // dialog no.2 for delete
      dialogVisble: false,
      deleteData: {
        userID: "",
        roleID: [],
      },
    };
  },
  methods: {
    refreshTableData() {
      this.tableLoading = true;
      getRole().then((res) => {
        this.tableData = res.data;
        this.tableLoading = false;
      });
    },
    goUpdateDialog(row) {
      this.form = { ...row };
      this.passwordDisabled = true;
      this.formLableTitle = "权限更新";
      this.dialogFormVisible = true;
    },
    goDeleteDialog(row) {
      this.dialogVisble = true;
      this.deleteData = { ...row };
    },
    handleUpdate() {
      updateRole(this.form).then((res) => {
        if (res.code === 20000) {
          this.$notify({
            title: "成功",
            message: `账号：${this.form.account}已编辑成功`,
            type: "success",
          });
          this.dialogFormVisible = false;
          // this.form = {};
          this.refreshTableData();
        }
      });
    },
    async hanldeDelete() {
      await deleteRole(this.deleteData.userID);
      this.$notify({
        title: "成功",
        message: `账号：${this.deleteData.account}删除成功。`,
        type: "success",
      });
      this.dialogVisble = false;
      this.deleteData = {};
      this.refreshTableData();
    },
  },
  mounted() {
    this.refreshTableData();
  },
};
</script>

<style lang="scss" scoped>
.container {
  .role-tableItem {
    margin-right: 10px;
  }
  .role-fromItem {
    margin-right: 10px;
  }
  // TODO:后期要修改全局样式，控制checkbox样式
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 0;
  }
  .mgl-10{
    margin-left: 10px;
  }
  .mgtb-10{
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>