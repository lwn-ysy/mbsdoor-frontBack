<template>
  <div class="container">
    <page-example></page-example>
    <form-table :hanldeSubmit="handleApi"></form-table>
  </div>
</template>

<script>
import PageExample from "@/components/PageExample";
import FormTable from "./components/formtable.vue";
import { addShop } from "@/api/shop";
export default {
  name: "UpadteShop",
  components: { FormTable, PageExample },
  computed: {
    handleApi() {
      return addShop;
    },
  },
  methods: {},
};
</script>

<style>
</style>