<template>
  <div class="container">
    <page-example />
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page.sync="currentPage"
      @current-change="handleChange"
    >
    </el-pagination>
    <!-- 表格 -->
    <el-table
      v-loading="tableLoading"
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
          <!-- <el-button
            class="mgl-10"
            size="mini"
            type="success"
            @click="goAddDialog()"
            >添加</el-button
          > -->
          <el-button
            class="mgl-10"
            size="mini"
            type="success"
            @click="goAddShopPage"
            >添加</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="goUpdatePage(scope.row)"
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
import { getShop, deleteShop } from "@/api/shop";
import { getShopTotal } from "@/api/count";
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
      // dialog no.3 for delete
      dialogVisble: false,
      deleteData: {
        shopID: "",
      },
      // 分页
      total: 86,
      currentPage: 1,
    };
  },
  // watch: {
  //   currentPage: {
  //     handler(newvalue) {
  //       console.log(newvalue);
  //     },
  //   },
  // },
  methods: {
    refreshTableData(objectData) {
      this.tableLoading = true;
      getShop(objectData).then((res) => {
        this.tableData = res.data;
        this.tableLoading = false;
      });
      getShopTotal().then((res) => (this.total = res.data[0].total));
    },
    goDeleteDialog(row) {
      this.dialogVisble = true;
      this.deleteData = { ...row };
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
    // 跳转到添加商品路由
    goAddShopPage() {
      this.$router.push("/shop/addshop");
    },
    // 跳转到更新商品的路由
    goUpdatePage(row) {
      this.$router.push({
        path: "/shop/updateshop",
        query: { shopID: row.shopID },
      });
    },
    //分页
    handleChange(val) {
      this.refreshTableData({ currentPage: val });
    },
  },
  mounted() {
    this.refreshTableData();
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
  .search {
    width: 120px;
  }
  .mgr-5 {
    margin-right: 5px;
  }
}
</style>