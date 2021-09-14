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
      <el-table-column label="标签" prop="tagname">
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
      <el-table-column align="right" width="210px">
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
            @click="goAddDialog()"
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
    <!-- 更新商品的dialog -->
    <el-dialog title="更新商品" :visible.sync="updateVisible">
      <el-form :model="formUpdate">
        <el-form-item label="商品ID" :label-width="formLabelWidth">
          <el-input
            v-model="formUpdate.shopID"
            disabled
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            v-model="formUpdate.title"
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="品类" :label-width="formLabelWidth">
          <el-select v-model="formUpdate.categoryID" placeholder="请选择">
            <el-option
              v-for="item in categoryOptions"
              :key="item.categoryID"
              :value="item.categoryID"
              :label="item.categoryname"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" :label-width="formLabelWidth">
          <el-checkbox-group v-model="formUpdate.tagID" :max="2">
            <el-checkbox
              v-for="tag in tagOptions"
              :label="tag.tagID"
              :key="tag.tagID"
              >{{ tag.tagname }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <el-input
            v-model="formUpdate.des"
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="旧封面图" :label-width="formLabelWidth">
          <el-image
            style="width: 148px; height: 148px; border: 1px dashed #c0ccda"
            :src="this.formUpdate.coverPicUrl"
            :preview-src-list="new Array(this.formUpdate.coverPicUrl)"
            fit="contain"
            >></el-image
          >
        </el-form-item>
        <el-form-item label="新封面图" :label-width="formLabelWidth">
          <el-upload
            :action="uploadURL"
            list-type="picture-card"
            :auto-upload="false"
            :http-request="updateHTTP"
            :limit="1"
            :on-exceed="onExceed"
            accept="image/*"
            ref="updateUpload"
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
                  @click="handlePictureCardPreview(file, 'update')"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!updateDisabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file, 'update')"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="updataUploadVisible">
            <img width="100%" :src="updateUploadImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 增加商品的dialog -->
    <el-dialog title="添加新商品" :visible.sync="addVisible">
      <el-form :model="formAdd">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            v-model="formAdd.title"
            suffix-icon="el-icon-date"
          ></el-input>
        </el-form-item>
        <el-form-item label="品类" :label-width="formLabelWidth">
          <el-select v-model="formAdd.categoryID" placeholder="请选择">
            <el-option
              v-for="item in categoryOptions"
              :key="item.categoryID"
              :value="item.categoryID"
              :label="item.categoryname"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" :label-width="formLabelWidth">
          <el-checkbox-group v-model="formAdd.tagID" :max="2">
            <el-checkbox
              v-for="tag in tagOptions"
              :label="tag.tagID"
              :key="tag.tagID"
              >{{ tag.tagname }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <el-input v-model="formAdd.des" suffix-icon="el-icon-date"></el-input>
        </el-form-item>
        <el-form-item label="新封面图" :label-width="formLabelWidth">
          <el-upload
            :action="uploadURL"
            list-type="picture-card"
            :auto-upload="false"
            :http-request="addHTTP"
            :limit="1"
            :on-exceed="onExceed"
            accept="image/*"
            ref="addUpload"
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
                  @click="handlePictureCardPreview(file, 'add')"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!addDisabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file, 'add')"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="addUploadVisible">
            <img width="100%" :src="addUploadImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除dialgo -->
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
import {
  getShop,
  addShop,
  deleteShop,
  updateShop,
  updateShopNoImg,
} from "@/api/shop";
import { getCategory } from "@/api/category";
import { getTag } from "@/api/tag";
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
          tagname: ["上新", "热销"],
          tagID: [1, 2],
        },
      ],
      search: "",
      tableLoading: true,
      // dialogForm data no.1 for add
      addVisible: false,
      formAdd: {
        title: "",
        categoryID: "",
        des: "",
        coverPicUrl: "",
        tagID: [],
      },
      // dialogFrom no.2 for updata
      updateVisible: false,
      formUpdate: {
        shopID: "",
        title: "",
        categoryID: undefined,
        des: "",
        coverPicUrl: "",
        tagID: [],
      },
      // 共用
      formLabelWidth: "120px",
      categoryOptions: [
        { categoryID: 10001, categoryname: "中式臻品" },
        { categoryID: 10002, categoryname: "欧式臻品" },
      ],
      tagOptions: [
        { tagID: 1, tagname: "上新" },
        { tagID: 2, tagname: "热销" },
      ],
      // dialog no.3 for delete
      dialogVisble: false,
      deleteData: {
        shopID: "",
      },
      uploadURL: "https://mbsdoor.com:5000/",
      //update图片上传组件
      updateUploadImageUrl: "",
      updataUploadVisible: false,
      updateDisabled: false,
      //add图片上传组件
      addUploadImageUrl: "",
      addUploadVisible: false,
      addDisabled: false,
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
      this.formUpdate = { ...row };
      this.updateVisible = true;
    },
    goAddDialog() {
      this.formAdd = {
        title: "",
        categoryID: undefined,
        des: "",
        tagID: [],
      };
      this.addVisible = true;
    },
    goDeleteDialog(row) {
      this.dialogVisble = true;
      this.deleteData = { ...row };
    },

    //更新的upload组件
    handleRemove(file, type) {
      if (type === "update") {
        // 更新的upload
        this.$refs.updateUpload.uploadFiles =
          this.$refs.updateUpload.uploadFiles.filter(
            (item) => item.uid !== file.uid
          );
      } else {
        // 增加的upload
        this.$refs.addUpload.uploadFiles =
          this.$refs.addUpload.uploadFiles.filter(
            (item) => item.uid !== file.uid
          );
      }
    },
    handlePictureCardPreview(file) {
      if (type === "update") {
        // 更新的upload
        this.updateUploadImageUrl = file.url;
        this.updataUploadVisible = true;
      } else {
        // 增加的upload
        this.addUploadImageUrl = file.url;
        this.addUploadVisible = true;
      }
    },

    updateHTTP(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      formData.append("title", this.formUpdate.title);
      formData.append("des", this.formUpdate.des);
      formData.append("categoryID", this.formUpdate.categoryID);
      formData.append("tagID", this.formUpdate.tagID);
      formData.append("shopID", this.formUpdate.shopID);
      updateShop(formData).then((res) => {
        if (res.code === 20000) {
          this.$notify({
            title: "成功",
            message: `${this.formUpdate.title}商品更新成功。`,
            type: "success",
          });
          this.refreshTableData();

          // this.resetForm();
        }
      });
    },
    addHTTP(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      formData.append("title", this.formAdd.title);
      formData.append("des", this.formAdd.des);
      formData.append("categoryID", this.formAdd.categoryID);
      formData.append("tagID", this.formAdd.tagID);
      addShop(formData).then((res) => {
        if (res.code === 20000) {
          this.$notify({
            title: "成功",
            message: `${this.formAdd.title}商品添加成功。`,
            type: "success",
          });
          this.refreshTableData();

          // this.resetForm();
        }
      });
    },
    // 共用的upload组件
    onExceed() {
      this.$message("一张就够了哦。您可先删除前面，再添加新的。");
    },

    // api处理
    handleUpdate() {
      // 没有上传新图片
      if (this.$refs.updateUpload.uploadFiles.length === 0) {
        updateShopNoImg(this.formUpdate).then((res) => {
          if (res.code === 20000) {
            this.$notify({
              title: "成功",
              message: `${this.formUpdate.title}商品更新成功。`,
              type: "success",
            });
            this.refreshTableData();
          }
        });
      } else {
        // 上传了新封面图片
        this.$refs.updateUpload.submit();
      }
    },
    handleAdd() {
      if (this.$refs.addUpload.uploadFiles.length === 0) {
        this.$message.error("需要添加一张封面图片哦");
        return;
      } else {
        this.$refs.addUpload.submit();
      }
    },
    async hanldeDelete() {
      await deleteShop(this.deleteData.shopID);
      this.$notify({
        title: "成功",
        message: `shopID：${this.deleteData.shopID} title:${this.deleteData.title} 删除成功。`,
        type: "success",
      });
      this.dialogVisble = false;
      this.deleteData = {};
      this.refreshTableData();
    },
  },
  mounted() {
    this.refreshTableData();
    getCategory().then((res) => (this.categoryOptions = res.data));
    getTag().then((res) => (this.tagOptions = res.data));
  },
};
</script>

<style lang="scss" scoped>
.container {
  .search {
    width: 120px;
  }
  .mgr-5 {
    margin-right: 5px;
  }
}
</style>