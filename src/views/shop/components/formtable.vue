<template>
  <div class="addform-container">
    <div class="form">
      <el-form :model="initForm">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            placeholder="例如：DR-A023吉祥如意"
            v-model="initForm.title"
            suffix-icon="el-icon-date"
            class="el-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="品类" :label-width="formLabelWidth">
          <el-select v-model="initForm.categoryID" placeholder="请选择">
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
          <el-checkbox-group v-model="initForm.tagID" :max="2">
            <el-checkbox
              v-for="tag in tagOptions"
              :label="tag.tagID"
              :key="tag.tagID"
              >{{ tag.tagname }}</el-checkbox
            >
          </el-checkbox-group>
          <div class="tip">
            <el-alert
              class="title"
              title="限制最多2个标签"
              type="info"
              show-icon
            >
            </el-alert>
          </div>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <el-input
            placeholder="特性、特点，简单概括"
            :maxlength="40"
            v-model="initForm.des"
            suffix-icon="el-icon-date"
            class="el-input"
          ></el-input>
        </el-form-item>
        <!-- 封面图upload 开始 -->
        <el-form-item label="封面图" :label-width="formLabelWidth">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            :on-exceed="onExceed"
            :on-remove="coverRemove"
            :on-preview="coverPreview"
            :http-request="httpRequest"
            :file-list="coverFileList"
            accept="image/*"
            ref="upload"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div class="tip el-upload__tip" slot="tip">
              <el-alert
                title="封面图标准是415*295像素，用这个比例的图片能完整显示"
                type="info"
                show-icon
              >
              </el-alert>
            </div>
            <!-- <div slot="tip" class="el-upload__tip">
              封面图标准是415*295像素，用这个比例的图片能完整显示
            </div> -->
          </el-upload>
          <el-dialog :visible.sync="coverVisible">
            <img width="100%" :src="coverImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <!-- 封面图upload 结束 -->

        <!-- 图片集upload 开始 -->
        <el-form-item label="图片集" :label-width="formLabelWidth">
          <el-upload
            action="https://mbsdoor.com:5000/vue-admin-template/shop/galary"
            list-type="picture-card"
            :on-success="onSuccess"
            :on-remove="galaryRemove"
            :on-preview="galaryPreview"
            :file-list="galaryFileList"
            accept="image/*"
            ref="galaryUpload"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div class="tip el-upload__tip" slot="tip">
              <el-alert title="商品详情页，展示这组图片" type="info" show-icon>
              </el-alert>
            </div>
          </el-upload>
          <el-dialog :visible.sync="galaryVisible">
            <img width="100%" :src="galaryImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <!-- 图片集upload 结束 -->
        <el-form-item>
          <div class="btn-wrapper">
            <el-button type="primary" @click="handleAdd()">提 交</el-button>
            <el-button @click="resetForm()">重 置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * 表单formtable组件，用于修改和增加商品
 * hanldeSubmit参数必须传，用于发送请求，默认参数：表单数据
 * isAdd:true/false ,添加 / 更新，默认是添加
 */
import { getCategory } from "@/api/category";
import { getTag } from "@/api/tag";
import { deleteGalary, updateShopNoImg } from "@/api/shop";

export default {
  name: "FormTable",
  props: {
    // 初始化连接服务器的api
    hanldeSubmit: {
      type: Function,
      required: true,
    },
    // 初始化话表格的数据
    initForm: {
      type: Object,
      required: false,
      default() {
        return {
          title: "",
          categoryID: undefined,
          des: "",
          tagID: [],
          shopID: "",
        };
      },
    },
    // 封面组件的已添加图片
    coverFileList: {
      type: Array,
      required: false,
    },
    // 图片集组件的已添加图片
    galaryFileList: {
      type: Array,
      required: false,
    },
    // 判断是add还是upload
    isAdd: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      formLabelWidth: "100px",
      categoryOptions: [],
      tagOptions: [],
      //封面图upload
      coverImageUrl: "",
      coverVisible: false,
      deleteIconDisable: false,
      //图片集upload
      galaryImageUrl: "",
      galaryVisible: false,
      galaryDeleteIcon: false,
    };
  },
  methods: {
    // 获取所有上传图片的url地址，没有用compute、watch实现
    getImageurl() {
      let imageurl = this.$refs.galaryUpload.uploadFiles.map((item) => {
        if (item.response) {
          return item.response.data;
        } else {
          return item.url;
        }
      });
      return imageurl;
    },
    // 封面图的upload组件
    coverRemove(file, fileList) {
      console.log(this.$refs.upload);
      console.log("cover:", file, fileList);
    },
    coverPreview(file) {
      this.coverImageUrl = file.url;
      this.coverVisible = true;
    },
    httpRequest(file) {
      let formData = new FormData();
      let imageurl = this.getImageurl();
      // 封面图由后端操作
      formData.append("file", file.file);
      formData.append("title", this.initForm.title);
      formData.append("des", this.initForm.des);
      formData.append("categoryID", this.initForm.categoryID);
      formData.append("tagID", this.initForm.tagID);
      formData.append("shopID", this.initForm.shopID);
      formData.append("imageurl", imageurl);
      this.hanldeSubmit(formData).then((res) => {
        if (res.code === 20000) {
          this.$confirm(
            `商品名称：${this.initForm.title} 操作成功。跳转到商品界面？`,
            {
              title: "操作成功",
              confirmButtonText: "跳转商品界面",
              cancelButtonText: "暂不",
              type: "success",
            }
          )
            .then(() => {
              this.$router.push("/shop/page");
            })
            .catch(() => {
              // this.resetForm();
              console.log("停留在此界面");
            });
        }
      });
    },
    // 公共upload组件的
    onExceed() {
      this.$message("一张就够了哦。您可先删除前面，再添加新的。");
    },
    resetForm() {
      this.form = {
        title: "",
        categoryID: undefined,
        des: "",
        tagID: [],
      };
      this.$refs.upload.uploadFiles = [];
      this.$refs.galaryUpload.uploadFiles = [];
    },

    handleAdd() {
      if (this.isAdd === true) {
        if (this.$refs.upload.uploadFiles.length === 0) {
          this.$message.error("需要添加一张封面图哦");
          return;
        } else {
          this.$refs.upload.submit();
        }
      } else {
        let isEdited = this.$refs.upload.uploadFiles.some(
          (item) => item.status === "ready"
        );
        if (isEdited) {
          // 封面图有更新过
          this.$refs.upload.submit();
        } else {
          //封面图无更新过
          let imageurl = this.getImageurl();
          updateShopNoImg({
            ...this.initForm,
            imageurl: imageurl,
          }).then((res) => {
            if (res.code === 20000) {
              this.$confirm(
                `商品名称：${this.initForm.title} 更新成功。跳转到商品界面？`,
                {
                  title: "操作成功",
                  confirmButtonText: "跳转商品界面",
                  cancelButtonText: "暂不",
                  type: "success",
                }
              )
                .then(() => {
                  this.$router.push("/shop/page");
                })
                .catch(() => {
                  // this.resetForm();
                  console.log("停留在此界面");
                });
            }
          });
        }
      }
    },
    // 图片集的upload组件
    galaryRemove(file, fileList) {
      let servePath = undefined;
      if (file.response) {
        servePath = file.response.data;
      } else {
        servePath = file.url;
      }
      deleteGalary(servePath).then((res) => {
        if (res.code === 20000) {
          console.log("图片删除成功");
        }
      });
    },

    galaryPreview(file) {
      this.galaryImageUrl = file.url;
      this.galaryVisible = true;
    },
    onSuccess(response, file, fileList) {
      // this.imageurl.push(response.data);
    },
  },
  mounted() {
    getCategory().then((res) => (this.categoryOptions = res.data));
    getTag().then((res) => (this.tagOptions = res.data));
  },
};
</script>
<style lang="scss" >
.addform-container {
  margin: 20px;
  .el-input {
    max-width: 400px;
  }
  .btn-wrapper {
    margin-left: 100px;
  }
  .tip {
    line-height: 12px;
    .el-alert {
      max-width: 400px;
      padding: 4px 16px;
    }
    .el-alert__closebtn {
      top: 6px;
    }
    .el-alert__title {
      font-size: 12px;
      line-height: 12px;
    }
  }
}
</style>