<template>
  <div class="container">
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

import FormTable from "./components/formtable.vue";
export default {
  name: "UpadteShop",
  components: { FormTable },
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
    };
  },
  computed: {
    handleApi() {
      return updateShop;
    },
  },
  methods: {
    async getInitFormData() {
      let res = await getShop(this.shopID);
      console.log("数据：", res);
      this.initFormData = {
        title: res.data[0].title,
        categoryID: res.data[0].categoryID,
        des: res.data[0].des,
        tagID: res.data[0].tagID,
      };
      this.coverImage.push({
        url: res.data[0].coverPicUrl,
      });
      this.galaryImage = res.data[0].imageurl.map((item) => {
        return {
          url: item,
        };
      });
      console.log(this.coverImage);
    },
  },
  mounted() {
    this.getInitFormData();
  },
};
</script>

<style>
</style>