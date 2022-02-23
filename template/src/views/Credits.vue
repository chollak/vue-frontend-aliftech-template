<template>
  <h1>Credits page</h1>
  <p>This is test page to get data from api</p>
</template>

<script>
import { apiClient } from "~/services/apiClient";
export default {
  setup() {
    apiClient.get(`/app`);
  },
};
</script>

<style></style>
