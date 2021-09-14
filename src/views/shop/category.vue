<template>
  <div class="container">
    <page-example />
    <!-- 表格 -->
    <el-table
      stripe
      :data="
        tableData.filter(
          (data) =>
            !search ||
            data.categoryname.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column label="品类ID" prop="categoryID"> </el-table-column>
      <el-table-column label="品类名称" prop="categoryname"> </el-table-column>
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
          label="品类ID"
          :label-width="formLabelWidth"
          v-if="showIDInput"
        >
          <el-input
            v-model="form.categoryID"
            disabled
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="品类名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.categoryname"
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
      <div>确认要该品类吗？</div>
      <div class="mgl-10 mgt-10">ID：{{ this.deleteData.categoryID }}</div>
      <div class="mgl-10">品类名称：{{ this.deleteData.categoryname }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="hanldeDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import PageExample from "@/components/PageExample";
import {
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/api/category";
export default {
  name: "ShopCategory",
  components: { PageExample },
  data() {
    return {
      // table data
      tableData: [
        {
          categoryID: 10001,
          categoryname: "中式臻品",
        },
        {
          categoryID: 10002,
          categoryname: "欧式臻品",
        },
      ],
      search: "",
      tableLoading: true,
      // dialogForm data no.1 for add/update
      dialogFormVisible: false,
      form: {
        categoryID: 10001,
        categoryname: "中式臻品",
      },
      formLabelWidth: "120px",
      showIDInput: true,
      formLableTitle: "form表格",
      // dialog no.2 for delete
      dialogVisble: false,
      deleteData: {
        categoryID: 10001,
        categoryname: "欧式臻品",
      },
    };
  },
  methods: {
    refreshTableData() {
      this.tableLoading = true;
      getCategory().then((res) => {
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
      await deleteCategory(this.deleteData.categoryID);
      this.$notify({
        title: "成功",
        message: `id：${this.deleteData.categoryID} 品类名:${this.deleteData.categoryname} 删除成功。`,
        type: "success",
      });
      this.dialogVisble = false;
      this.deleteData = {};
      this.refreshTableData();
    },
    handleUpdate() {
      if (this.showIDInput) {
        // 编辑
        updateCategory(this.form).then((res) => {
          if (res.code === 20000) {
            this.$notify({
              title: "成功",
              message: `品类：${this.form.categoryname}已编辑成功`,
              type: "success",
            });
            this.dialogFormVisible = false;
            this.form = {};
            this.refreshTableData();
          }
        });
      } else {
        //增加
        addCategory(this.form).then((res) => {
          if (res.code === 20000) {
            this.$notify({
              title: "成功",
              message: `品类名${this.form.categoryname}已成功添加`,
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