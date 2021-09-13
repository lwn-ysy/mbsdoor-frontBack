<template>
  <div class="container">
    <div class="header">添加轮播图</div>
    <el-form ref="form" :model="form" label-width="120px" class="form">
      <el-form-item label="类型">
        <el-select v-model="form.type" placeholder="分类属于">
          <el-option label="活动" value="活动"></el-option>
          <el-option label="广告" value="广告"></el-option>
          <el-option label="品牌" value="品牌"></el-option>
          <el-option label="热销" value="热销"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          placeholder="对此轮播图的一些说明或者备注"
        ></el-input>
      </el-form-item>

      <el-form-item label="上传后立即发布">
        <el-radio-group v-model="form.hidden">
          <el-radio :label="false">发布</el-radio>
          <el-radio :label="true">暂时不发布</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
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
            建议上传1426*651像素比例的图片
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
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" /> </el-dialog
      ></el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">上传</el-button>
        <el-button @click="resetForm">重置表格</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addBanner } from "@/api/banner";
export default {
  name: "ActivityAddBanner",
  data() {
    return {
      form: {
        description: "",
        type: "",
        hidden: true,
      },
      // 文件上传区域
      uploadURL: "http://localhost:5000/vue-admin-template/activity/banner",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    };
  },
  methods: {
    handleRemove(file) {
      this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(
        (item) => item.uid !== file.uid
      );
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onExceed() {
      this.$message("一张就够了哦。您可先删除前面，再添加新的。");
    },
    resetForm() {
      this.form = {
        description: "",
        type: "",
        hidden: true,
      };
      this.$refs.upload.uploadFiles = [];
    },
    // 提交后触发handleUpLoad
    onSubmit() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.error("出错了，请先添加图片。");
        return;
      }
      this.$refs.upload.submit();
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
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 600px;
  margin: auto;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .header {
    margin: 40px;
    font-weight: bolder;
  }
  .form {
    width: 500px;
  }
}
</style>