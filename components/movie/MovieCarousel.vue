<script setup lang="ts">
import axios from "axios";
import { useRuntimeConfig } from "nuxt/app";
import { onMounted } from "vue";
import { ref } from "vue";
import type { Details, Root } from "~/types";

const config = useRuntimeConfig();
const SERVER_HOST = config.public.SERVER_HOST;

let index = ref(0);

defineProps<{
  type?: string;
}>();

watch(index, () => {
  if (index.value < 0) index.value = 0;
  if (index.value > 5) index.value = 5;
});

const popular = ref<Root>();
const watchlist = ref<{ list: Details[] }>({ list: [] });

async function get_popular() {
  let movies = await axios.get(`${SERVER_HOST}/popular`);

  return movies.data;
}

async function get_watchlist() {
  let watchlist = await axios.get(`${SERVER_HOST}/watchlist/${localStorage.getItem("userid")}`);

  return watchlist.data;
}

onMounted(async () => {
  popular.value = await get_popular();
  watchlist.value = await get_watchlist();
});

watch(watchlist, () => {
  console.log(watchlist.value?.list);
});

watch(popular, () => {
  console.log(popular.value?.results);
});
</script>
<template>
  <div class="flex justify-center h-full">
    <UCard class="w-full h-full">
      <UContainer class="h-full flex space-x-14">
        <a
          @click="type === 'popular' ? (index -= 1) : watchlist?.list.length > 5 ? (index -= 1) : {}"
          class="flex flex-col justify-center"
          ><UIcon dynamic name="material-symbols:arrow-back-ios"></UIcon
        ></a>
        <div class="flex space-x-4 h-full">
          <MovieCard
            v-for="(movie, i) of 5"
            v-bind:key="i"
            :data="
              type === 'popular'
                ? popular?.results[i + index].poster_path
                : watchlist?.list.length > i + index
                ? watchlist.list[i + index].poster_path
                : ''
            "
            :movieid="
              type === 'popular'
                ? popular?.results[i + index].id
                : watchlist.list.length > i + index
                ? watchlist?.list[i + index].id
                : ''
            "
          />
        </div>
        <a
          class="flex flex-col justify-center"
          @click="type === 'popular' ? (index += 1) : watchlist?.list.length > 5 ? (index += 1) : {}"
          ><UIcon dynamic name="material-symbols:arrow-forward-ios"></UIcon
        ></a>
      </UContainer>
    </UCard>
  </div>
</template>
<style lang="scss"></style>
