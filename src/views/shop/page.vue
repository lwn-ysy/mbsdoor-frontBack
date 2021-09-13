<template>
  <div class="container">
    <page-example />
    <!-- 表格 -->
    <el-table
      stripe
      style="width: 100%"
      :data="
        tableData.filter(
          (data) =>
            !search || data.title.toLowerCase().includes(search.toLowerCase())
        )
      "
    >
      <el-table-column label="商品ID" prop="shopID"> </el-table-column>
      <el-table-column label="名称" prop="title"> </el-table-column>
      <el-table-column label="描述" prop="des"> </el-table-column>
      <el-table-column label="品类" prop="categoryname" width="100px">
      </el-table-column>
      <el-table-column label="小标签" prop="tagname">
        <template slot-scope="scope">
          <div>
            <el-tag
              class="mgr-5"
              v-for="(item, index) in scope.row.tagname"
              :key="index"
              >{{ item }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="封面图片" prop="coverPicUrl" width="100px">
        <template slot-scope="scope">
          <div>
            <el-image
              class="img"
              :src="scope.row.coverPicUrl"
              :preview-src-list="new Array(scope.row.coverPicUrl)"
              fit="contain"
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
            v-model="form.shopID"
            disabled
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" suffix-icon="el-icon-date"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-select v-model="form.categoryID" placeholder="请选择">
            <el-option
              v-for="item in categoryOptions"
              :key="item.categoryID"
              :value="item.categoryID"
              :label="item.categoryname"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <el-input v-model="form.des" suffix-icon="el-icon-date"></el-input>
        </el-form-item>
        <el-form-item label="旧封面图" :label-width="formLabelWidth">
          <el-image
            style="width: 148px; height: 148px; border: 1px dashed #c0ccda"
            :src="this.form.coverPicUrl"
            :preview-src-list="new Array(this.form.coverPicUrl)"
            fit="contain"
            >></el-image
          >
        </el-form-item>
        <el-form-item label="新封面图" :label-width="formLabelWidth">
          <el-upload
            :action="uploadURL"
            list-type="picture-card"
            :auto-upload="false"
            :http-request="handleUpLoad"
            :limit="1"
            :on-exceed="onExceed"
            accept="image/*"
            ref="upload"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">
              封面图标准是415*295像素，用这个比例的图片能完整显示
            </div>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!uploadDisabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogUploadVisible">
            <img width="100%" :src="dialogUploadImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除dialg -->
    <el-dialog title="删除提示" :visible.sync="dialogVisble" width="30%" center>
      <div>确认要删除此条商品？</div>
      <div class="mgl-10 mgt-10">shopID: {{ this.deleteData.shopID }}</div>
      <div class="mgl-10 mgt-10">商品名称: {{ this.deleteData.title }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="hanldeDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PageExample from "@/components/PageExample";
import { getShop, addShop, deleteShop, updateShop } from "@/api/shop";
import { title } from "@/settings";
export default {
  name: "ShopPage",
  components: { PageExample },
  data() {
    return {
      // table data
      tableData: [
        {
          shopID: "shop_100001",
          title: "DR-A001祥云瑞气",
          categoryname: "中式臻品",
          categoryID: 10001,
          des: "中式臻品系列是设计师在追根溯源中逐渐恢复东方文化的自信",
          isFull: false, //控制商品一行显示2个还是1个
          coverPicUrl:
            "https://mbsdoor.com:5000/static/image/shop/shop-100001-2.jpg",
          tags: ["上新"],
        },
      ],
      search: "",
      tableLoading: true,
      // dialogForm data no.1 for add/update
      dialogFormVisible: false,
      form: {
        shopID: "",
        title: "",
        categoryID: "",
        des: "",
        coverPicUrl: "",
        hidden: false,
      },
      formLabelWidth: "120px",
      formLableTitle: "商品信息修改",
      categoryOptions: [
        { categoryID: 10001, categoryname: "中式臻品" },
        { categoryID: 10002, categoryname: "欧式臻品" },
      ],
      // dialog no.2 for delete
      dialogVisble: false,
      deleteData: {
        shopID: "",
      },
      //文件图片上传组件
      uploadURL: "https://mbsdoor.com:5000/",
      dialogUploadImageUrl: "",
      dialogUploadVisible: false,
      uploadDisabled: false,
    };
  },
  methods: {
    refreshTableData() {
      this.tableLoading = true;
      getShop().then((res) => {
        this.tableData = res.data;
        this.tableLoading = false;
      });
    },
    goEditDialog(row) {
      this.form = { ...row };
      this.formLableTitle = "商品信息修改";
      this.dialogFormVisible = true;
    },
    goDeleteDialog(row) {
      this.dialogVisble = true;
      this.deleteData = { ...row };
    },

    //upload组件
    handleRemove(file) {
      this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(
        (item) => item.uid !== file.uid
      );
    },
    handlePictureCardPreview(file) {
      this.dialogUploadImageUrl = file.url;
      this.dialogUploadVisible = true;
    },
    onExceed() {
      this.$message("一张就够了哦。您可先删除前面，再添加新的。");
    },
    resetForm() {
      this.form = {};
      this.$refs.upload.uploadFiles = [];
    },
    handleUpLoad(file) {
      // 新建一个FromData格式
      let formData = new FormData();
      formData.append("file", file.file);
      formData.append("type", this.form.type);
      formData.append("description", this.form.description);
      formData.append("hidden", this.form.hidden);
      addBanner(formData).then((res) => {
        if (res.code === 20000) {
          this.$notify({
            title: "成功",
            message: `轮播图添加成功。`,
            type: "success",
          });
          this.resetForm();
        }
      });
    },

    // api处理
    // TODO:要先判断有没有修改原图片
    handleUpdate() {

      this.$refs.upload.submit();
    },
    async hanldeDelete() {
      await deleteShop(this.deleteData.shopID);
      this.$notify({
        title: "成功",
        message: `id：${this.deleteData.shopID} title:${title} 删除成功。`,
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
</style>