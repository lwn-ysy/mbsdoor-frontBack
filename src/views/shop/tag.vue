<template>
  <div class="container">
    <page-example />
    <!-- 表格 -->
    <el-table
      stripe
      :data="
        tableData.filter(
          (data) =>
            !search || data.tagname.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column label="ID" prop="tagID"> </el-table-column>
      <el-table-column label="标签名字" prop="tagname">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.tagname }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right" min-width="250px">
        <!-- TODO: slot-scope会影响input不显示内容 -->
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
            class="search"
          ></el-input>
          <el-button
            class="mgl-10"
            size="mini"
            type="success"
            @click="goEditDialog()"
            >添加</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="goEditDialog(scope.row)"
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
        <el-form-item
          label="ID"
          :label-width="formLabelWidth"
          v-if="showIDInput"
        >
          <el-input
            v-model="form.tagID"
            disabled
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.tagname"
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除dialg -->
    <el-dialog title="删除提示" :visible.sync="dialogVisble" width="30%" center>
      <div>确认要该标签吗？</div>
      <div class="mgl-10 mgt-10">ID：{{ this.deleteData.tagID }}</div>
      <div class="mgl-10">
        标签名称：
        <el-tag class="role-tableItem" type="success">{{
          this.deleteData.tagname
        }}</el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="hanldeDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PageExample from "@/components/PageExample";
import { getTag, addTag, deleteTag, updateTag } from "@/api/tag";
export default {
  name: "ShopTag",
  components: { PageExample },
  data() {
    return {
      // table data
      tableData: [
        {
          tagID: 1,
          tagname: "上新",
        },
        {
          tagID: 2,
          tagname: "热销",
        },
      ],
      search: "",
      tableLoading: true,
      // dialogForm data no.1 for add/update
      dialogFormVisible: false,
      form: {
        tagID: 1,
        tagname: "上新",
      },
      formLabelWidth: "120px",
      showIDInput: true,
      formLableTitle: "form表格",
      // dialog no.2 for delete
      dialogVisble: false,
      deleteData: {
          tagID:''
      },
    };
  },
  methods: {
    refreshTableData() {
      this.tableLoading = true;
      getTag().then((res) => {
        this.tableData = res.data;
        this.tableLoading = false;
      });
    },
    goEditDialog(row) {
      if (!row) {
        //添加功能
        this.form = {
          tagname: "",
        };
        this.formLableTitle = "商品标签添加";
        this.showIDInput = false;
      } else {
        //编辑功能
        this.form = { ...row };
        this.showIDInput = true;
        this.formLableTitle = "商品标签修改";
      }
      this.dialogFormVisible = true;
    },
    goDeleteDialog(row) {
      this.dialogVisble = true;
      this.deleteData = { ...row };
    },

    // api
    async hanldeDelete() {
      //删除
      await deleteTag(this.deleteData.tagID);
      this.$notify({
        title: "成功",
        message: `id：${this.deleteData.tagID} 标签名:${this.deleteData.tagname} 删除成功。`,
        type: "success",
      });
      this.dialogVisble = false;
      this.deleteData = {};
      this.refreshTableData();
    },
    handleUpdate() {
      if (this.showIDInput) {
        // 编辑
        updateTag(this.form).then((res) => {
          if (res.code === 20000) {
            this.$notify({
              title: "成功",
              message: `标签：${this.form.tagname}已编辑成功`,
              type: "success",
            });
            this.dialogFormVisible = false;
            this.form = {};
            this.refreshTableData();
          }
        });
      } else {
        //增加
        addTag(this.form).then((res) => {
          if (res.code === 20000) {
            this.$notify({
              title: "成功",
              message: `标签：${this.form.tagname}已成功添加`,
              type: "success",
            });
            this.dialogFormVisible = false;
            this.form = {};
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
.container {
  .search {
    width: 150px;
  }
}
</style>