<template>
  <div class="account-wrapper">
    <div class="add-account">
      <el-button type="primary" plain size="mini" @click="goAdd"
        >添加用户</el-button
      >
    </div>
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
      <el-table-column label="权限" prop="roles"> </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入昵称关键字搜索"
          />
        </template>
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row, scope)"
            >编辑</el-button
          > -->
          <el-button size="mini" @click="goEdit(scope.$index, scope.row, scope)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.userID)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.roles" size="small">
            <el-checkbox label="admin" border></el-checkbox>
            <el-checkbox label="editor" border></el-checkbox>
            <el-checkbox label="tourist" border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
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
  data() {
    return {
      // table data
      tableData: [
        {
          // date: "2016-05-02",
          // name: "王小虎",
          // address: "上海市普陀区金沙江路 1518 弄",
          userID: "0",
          account: "admin",
          password: "admin",
          nickname: "林伟楠",
          roles: ["admin", "editor"],
        },
        {
          // date: "2016-05-02",
          // name: "王小虎",
          // address: "上海市普陀区金沙江路 1518 弄",
          userID: "1",
          account: "editor",
          password: "editor",
          nickname: "dsfds",
          roles: ["editor"],
        },
        {
          // date: "2016-05-02",
          // name: "王小虎",
          // address: "上海市普陀区金沙江路 1518 弄",
          userID: "2",
          account: "tourist",
          password: "tourist",
          nickname: "林伟楠",
          roles: ["tourist"],
        },
      ],
      search: "",
      // dialogForm data
      dialogFormVisible: false,
      form: {
        userID: "2",
        account: "admin",
        password: "admin",
        nickname: "林伟楠",
        roles: ["admin", "editor"],
      },
      formLabelWidth: "120px",
      passwordDisabled: true,
      formLableTitle: "信息修改",
    };
  },
  methods: {
    goEdit(index, row, scope) {
      console.log(index, row, scope);
      this.dialogFormVisible = true;
      this.formLableTitle = "信息修改";
      this.form = { ...row };
    },
    goAdd() {
      this.dialogFormVisible = true;
      this.passwordDisabled = false;
      this.formLableTitle = "增加用户";
      this.form = {
        account: "",
        password: "",
        nickname: "",
        roles: [],
      };
    },
    handleDelete(index, row) {
      console.log(index, row);
      deleteAccount(userID);
    },
    handleUpdate() {
      console.log("前端发送请求的数据：", this.form);
      updateAccount(this.form);
    },
  },
  mounted() {
    getAccount();
  },
};
</script>

<style  scoped>
.account-wrapper .el-checkbox {
  margin-right: 10px;
}
</style>
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