<template>
  <div class="container">
    <!-- 1. 轮播图 -->
    <div class="lbt-wrapper">
      <el-carousel trigger="click" :autoplay="false">
        <el-carousel-item v-for="url in lbtURL" :key="url">
          <el-image :src="url" fit="fill" class="lbt-img"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 2. 表格 -->
    <el-table
      stripe
      style="width: 100%"
      :data="
        tableData.filter(
          (data) =>
            !search ||
            data.description.toLowerCase().includes(search.toLowerCase())
        )
      "
    >
      <el-table-column label="id" prop="bannerID" width="50px">
      </el-table-column>
      <el-table-column label="类型" prop="type" width="100px">
      </el-table-column>
      <el-table-column label="描述" prop="description"> </el-table-column>
      <el-table-column label="生效" prop="hidden" width="50px">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.hidden">
              <i style="color: #909399" class="el-icon-error"></i>
            </span>
            <span v-else>
              <i style="color: #409eff" class="el-icon-success"></i>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="图片连接" prop="picURL"></el-table-column>
      <el-table-column label="图片预览" prop="picURL" width="100px">
        <template slot-scope="scope">
          <div>
            <el-image
              class="img"
              :src="scope.row.picURL"
              fit="contain"
              :preview-src-list="new Array(scope.row.picURL)"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" width="150px">
        <!-- TODO: slot-scope会影响input不显示内容 -->
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
          ></el-input>
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
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input
            v-model="form.bannerID"
            disabled
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
            v-model="form.description"
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片地址" :label-width="formLabelWidth">
          <el-input v-model="form.picURL" suffix-icon="el-icon-date"></el-input>
        </el-form-item>
        <el-form-item label="生效" :label-width="formLabelWidth">
          <el-radio v-model="form.hidden" :label="true">false</el-radio>
          <el-radio v-model="form.hidden" :label="false">true</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除dialg -->
    <el-dialog title="删除提示" :visible.sync="dialogVisble" width="30%" center>
      <span>确认要删除轮播图？ id: {{ this.deleteData.bannerID }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="hanldeDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, deleteBanner, updateBanner } from "@/api/banner";
export default {
  name: "ActivityBanner",
  data() {
    return {
      // table data
      tableData: [],
      search: "",
      tableLoading: true,
      // dialogForm data no.1 for add/update
      dialogFormVisible: false,
      form: {
        bannerID: "",
        type: "",
        description: "",
        picURL: "",
        hidden: false,
      },
      formLabelWidth: "120px",
      formLableTitle: "信息修改",
      // TODO:由后端提供
      options: [
        {
          value: "活动",
          lable: "活动",
        },
        {
          value: "广告",
          lable: "广告",
        },
        {
          value: "品牌",
          lable: "品牌",
        },
        {
          value: "热销",
          lable: "热销",
        },
      ],
      // dialog no.2 for delete
      dialogVisble: false,
      deleteData: {
        bannerID: "",
      },
      //轮播图
      lbtURL: [],
    };
  },
  methods: {
    // 封装一个重新加载数据的方法
    refreshTableData() {
      this.tableLoading = true;
      getBanner().then((res) => {
        this.tableData = res.data;
        this.tableLoading = false;
        this.lbtURL = res.data.map((item) => {
          return item.picURL;
        });
      });
    },
    goEditDialog(row) {
      this.form = { ...row };
      this.formLableTitle = "信息修改";
      this.dialogFormVisible = true;
    },
    goDeleteDialog(row) {
      this.dialogVisble = true;
      this.deleteData = { ...row };
    },
    async hanldeDelete() {
      await deleteBanner(this.deleteData.bannerID);
      this.$notify({
        title: "成功",
        message: `id：${this.deleteData.bannerID}  删除成功。`,
        type: "success",
      });
      this.dialogVisble = false;
      this.deleteData = {};
      this.refreshTableData();
    },
    handleUpdate() {
      updateBanner(this.form).then((res) => {
        if (res.code === 20000) {
          this.$notify({
            title: "成功",
            message: `id：${this.form.bannerID}  已编辑成功`,
            type: "success",
          });
          this.dialogFormVisible = false;
          // this.form = {};
          this.refreshTableData();
        }
      });
    },
  },
  mounted() {
    this.refreshTableData();
  },
};
</script>

<style lang="scss" scoped>
.container {
  .lbt-wrapper{
    width: 657px;
    margin: 30px auto;
    .lbt-img{
      height: 100%;
      width: 100%;
      border-radius: 10px;
    }
  }
  .img {
    :hover {
      opacity: 0.8;
    }
  }
}
</style>