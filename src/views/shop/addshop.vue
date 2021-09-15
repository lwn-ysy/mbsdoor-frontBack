<template>
  <div class="container">
    <form-table :hanldeSubmit="handleApi"></form-table>
  </div>
</template>

<script>
import { addShop } from "@/api/shop";

import FormTable from "./components/formtable.vue";
export default {
  name: "UpadteShop",
  components: { FormTable },
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