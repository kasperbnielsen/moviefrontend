<script setup lang="ts">
import type { Root } from "~/types";
import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const SERVER_HOST = config.public.SERVER_HOST;

defineProps<{ data: any; movieid: any }>();
</script>
<template>
  <div>
    <ULink :to="data !== '' ? `/movies/${movieid}` : ''"
      ><img
        class="w-80 h-72"
        :src="
          data === ''
            ? 'https://img.freepik.com/free-photo/abstract-luxury-plain-blur-grey-black-gradient-used-as-background-studio-wall-display-your-products_1258-63747.jpg?w=2000'
            : `https://image.tmdb.org/t/p/w500${data}`
        "
    /></ULink>
  </div>
</template>
<style></style>
