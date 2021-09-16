<template>
  <div class="container">
    <page-example></page-example>
    <form-table
      :hanldeSubmit="handleApi"
      :initForm="initFormData"
      :coverFileList="coverImage"
      :galaryFileList="galaryImage"
      :isAdd="false"
    ></form-table>
  </div>
</template>

<script>
import { getShop, updateShop } from "@/api/shop";
import PageExample from "@/components/PageExample";
import FormTable from "./components/formtable.vue";
export default {
  name: "UpadteShop",
  components: { FormTable, PageExample },
  props: {
    // 路由传参
    // 商品信息界面跳转到更新页面，
    shopID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      initFormData: {
        // 必须要这样，有坑
        title: "",
        categoryID: undefined,
        des: "",
        tagID: [],
      },
      coverImage: [],
      galaryImage: [],
      galaryUpload: [],
    };
  },
  computed: {
    handleApi() {
      return updateShop;
    },
  },
  methods: {
    async getInitFormData() {
      let res = await getShop({ shopID: this.shopID });
      let data = res.data[0];
      console.log("数据：", res);
      this.initFormData = {
        title: data.title,
        categoryID: data.categoryID,
        des: data.des,
        tagID: data.tagID,
        shopID: data.shopID,
      };
      this.coverImage.push({
        url: data.coverPicUrl,
      });
      this.galaryImage = data.imageurl.map((item) => {
        return {
          url: item,
        };
      });
    },
  },
  mounted() {
    this.getInitFormData();
  },
};
</script>

<style>
</style>