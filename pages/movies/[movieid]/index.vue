<script setup lang="ts">
import axios from "axios";
import { useRuntimeConfig, useRoute } from "nuxt/app";
import type { Details, Videos } from "~/types";
import { ref } from "vue";
const config = useRuntimeConfig();
const SERVER_HOST = config.public.SERVER_HOST;
const router = useRouter();
const data = ref<Details>();
const video = ref<Videos>();
const comment = ref();
const is_watchlisted = ref<{ is_watchlisted: boolean }>({
  is_watchlisted: false,
});
const is_logged = ref(false);
const comments = ref<{ list: { user_id: string; comment: string }[] }>({ list: [] });

const MOVIE_ID = router.currentRoute.value.path.split("/")[2];

async function get_details() {
  let details = await axios.post(`${SERVER_HOST}/details`, {
    id: MOVIE_ID,
  });

  return details.data;
}

async function get_watchlist_current(): Promise<{ is_watchlisted: boolean }> {
  let result = await axios.post(`${SERVER_HOST}/watchlist`, {
    user_id: localStorage.getItem("userid"),
    movie_id: MOVIE_ID,
  });

  return result.data;
}

async function remove_from_watchlist() {
  await axios
    .post(`${SERVER_HOST}/watchlist/remove`, {
      user_id: localStorage.getItem("userid"),
      movie_id: MOVIE_ID,
    })
    .then(() => {
      is_watchlisted.value.is_watchlisted = false;
    });
}

async function post_comment() {
  let com = await axios.post(`${SERVER_HOST}/movies/${MOVIE_ID}/comments`, {
    user_id: localStorage.getItem("userid"),
    comment: comment.value,
  });
}

async function get_comments(): Promise<{ list: { user_id: string; comment: string }[] }> {
  let result = await axios.get(`${SERVER_HOST}/movies/${MOVIE_ID}/comments`);

  return result.data;
}

async function get_video() {
  let video = await axios.post(`${SERVER_HOST}/video`, {
    id: MOVIE_ID,
  });

  return video.data;
}

async function add_to_watchlist() {
  await axios
    .post(`${SERVER_HOST}/watchlist/add`, {
      user_id: localStorage.getItem("userid"),
      movie_id: MOVIE_ID,
    })
    .then(() => {
      is_watchlisted.value.is_watchlisted = true;
    });
}

onMounted(async () => {
  is_logged.value = localStorage.getItem("userid") == null;
  data.value = await get_details();
  video.value = await get_video();
  is_watchlisted.value = await get_watchlist_current();
  comments.value = await get_comments();
});

watch(is_watchlisted, () => {});
watch(data, () => {});
watch(video, () => {});
watch(comments, () => {});
</script>
<template>
  <div class="flex flex-col gap-8">
    <div class="">
      <div class="flex">
        <h1 class="text-3xl m-4">{{ data?.original_title }}</h1>
        <UButton
          @click="is_watchlisted.is_watchlisted ? remove_from_watchlist() : add_to_watchlist()"
          :color="is_watchlisted.is_watchlisted ? 'grey' : 'yellow'"
          :disabled="is_logged"
          class="absolute mr-52 right-0 mt-8"
          :class="is_watchlisted.is_watchlisted ? 'bg-slate-600' : 'bg-yellow-300'"
          >Add to watchlist</UButton
        >
      </div>
      <div class="flex flex-row">
        <img class="w-1/4" :src="`https://image.tmdb.org/t/p/w500${data?.poster_path}`" />
        <iframe
          class="w-3/4"
          :src="`https://www.youtube.com/embed/${video?.results[0].key}?controls=0&autoplay=0&mute=1`"
        ></iframe>
      </div>

      <div class="flex flex-row m-4 space-x-8">
        <div v-for="(item, index) of data?.genres" v-bind:key="index">
          <ULink
            ><UBadge>{{ item.name }}</UBadge></ULink
          >
        </div>
      </div>
    </div>
    {{ data?.overview }}
    <div class="flex flex-col gap-2">
      <div class="font-bold">Reviews</div>
      <UTextarea v-model="comment" class="w-96 max-w-full" :rows="5" placeholder="Add a comment"
        ><UButton @click="post_comment" class="w-fit right-0 absolute m-2">Comment</UButton></UTextarea
      >
    </div>
    <div>
      <div v-for="(temp_comment, index) of comments.list" v-bind:key="index" class="flex flex-row space-y-12">
        <UCard class="h-40 w-96 mt-8"
          ><p class="mb-1">{{ temp_comment.user_id }}</p>
          {{ temp_comment.comment }}</UCard
        >
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
