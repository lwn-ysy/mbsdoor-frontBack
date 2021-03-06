<template>
  <div class="account-wrapper" v-loading="tableLoading">
    <div class="add-account">
      <el-button type="primary" plain size="mini" @click="goAddDialog"
        >添加用户</el-button
      >
    </div>
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
      <el-table-column label="密码" prop="password"> </el-table-column>
      <el-table-column label="昵称" prop="nickname"> </el-table-column>
      <el-table-column label="描述" prop="introduction"> </el-table-column>
      <el-table-column align="right">
        <!-- TODO: slot-scope会影响input不显示内容 -->
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
          ></el-input>
        </template>
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row, scope)"
            >编辑</el-button
          > -->
          <el-button
            size="mini"
            @click="goEditDialog(scope.$index, scope.row, scope)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="goDeleteDialog(scope.row)"
            >删除</el-button
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
            :disabled="passwordDisabled"
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            v-model="form.password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input
            v-model="form.nickname"
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
            v-model="form.introduction"
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除dialg -->
    <el-dialog title="删除提示" :visible.sync="dialogVisble" width="30%" center>
      <span>确认要删除账户？ {{ this.deleteData.account }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="hanldeDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAccount,
  addAccount,
  deleteAccount,
  updateAccount,
} from "@/api/account.js";

export default {
  name: "Account",
  data() {
    return {
      // table data
      tableData: [],
      search: "",
      tableLoading: true,
      // dialogForm data no.1 for add/update
      dialogFormVisible: false,
      form: {
        userID: "",
        account: "",
        password: "",
        nickname: "",
        introduction: "",
      },
      formLabelWidth: "120px",
      passwordDisabled: true,
      formLableTitle: "信息修改",
      // dialog no.2 for delete
      dialogVisble: false,
      deleteData: {
        account: "",
        userID: "",
      },
    };
  },
  methods: {
    // 封装一个重新加载数据的方法
    refreshTableData() {
      this.tableLoading = true;
      getAccount().then((res) => {
        this.tableData = res.data;
        this.tableLoading = false;
      });
    },
    goEditDialog(row) {
      this.form = { ...row };
      this.passwordDisabled = true;
      this.formLableTitle = "信息修改";
      this.dialogFormVisible = true;
    },
    goAddDialog() {
      this.form = {
        account: "",
        password: "",
        nickname: "",
        introduction: "",
      };
      this.passwordDisabled = false;
      this.formLableTitle = "增加用户";
      this.dialogFormVisible = true;
    },
    goDeleteDialog(row) {
      this.dialogVisble = true;
      this.deleteData = { ...row };
    },
    async hanldeDelete() {
      await deleteAccount(this.deleteData.userID);
      this.$notify({
        title: "成功",
        message: `账号：${this.deleteData.account}删除成功。`,
        type: "success",
      });
      this.dialogVisble = false;
      this.deleteData = {};
      this.refreshTableData();
    },
    handleUpdateAdd() {
      if (this.passwordDisabled) {
        // 编辑
        updateAccount(this.form).then((res) => {
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
      } else {
        //增加
        addAccount(this.form).then((res) => {
          if (res.code === 20000) {
            this.$confirm(
              `账户 ${this.form.account} 添加成功，是否跳转到权限系统，给新账户添加权限？`,
              "添加成功",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "success",
              }
            )
              .then(() => {
                this.$router.push("/permission/role");
              })
              .catch(() => {});
            this.dialogFormVisible = false;
            // this.form = {};
            this.refreshTableData();
          }
        });
      }
    },
  },

  mounted() {
    this.refreshTableData();
  },
};
</script>


<style lang="scss" scoped>
.account-wrapper {
  .add-account {
    margin: 10px;
  }
  .el-checkbox {
    margin-right: 10px;
  }
}
</style>