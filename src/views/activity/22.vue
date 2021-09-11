<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="类型">
        <el-select v-model="form.region" placeholder="分类属于">
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
          style="maxwidth: 600px"
        ></el-input>
      </el-form-item>

      <el-form-item label="立即发布">
        <el-radio-group v-model="form.hidden">
          <el-radio label="发布"></el-radio>
          <el-radio label="先不发布"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item> </el-form-item>
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :file-list="fileList"
        :on-change="test"
        ref="upload"
      >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">
          建议上传1426*651像素比例的图片
        </div>
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
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
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ActivityAddBanner",
  data() {
    return {
      form: {
        description: "",
        type: "",
        hidden: "",
      },
      // 文件上传区域
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [],
    };
  },
  methods: {},
};
</script>

<style>
</style>