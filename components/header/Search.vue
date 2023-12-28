<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import type { Root } from "~/types";

const searchInput = ref("");
const open = ref(false);
const modalOpen = ref(false);
const userid = ref();
const username = ref();
const movies = ref<Root>();

const config = useRuntimeConfig();
const SERVER_HOST = config.public.SERVER_HOST;

onMounted(() => {
  userid.value = localStorage.getItem("userid");
  username.value = localStorage.getItem("username");
});

function home() {
  window.location.href = "/";
}

async function get_search() {
  let result = await axios.post(`${SERVER_HOST}/search`, {
    id: searchInput.value,
  });

  return result.data;
}

function logout() {
  localStorage.removeItem("userid");
  localStorage.removeItem("username");
  userid.value = null;
  username.value = null;
  console.log("log out");
}

watch(userid, () => {});

watch(searchInput, async () => {
  if (searchInput.value !== "") open.value = true;
  else open.value = false;

  movies.value = await get_search();
});
</script>
<template>
  <UContainer>
    <UContainer class="flex items-center justify-center">
      <UButton class="absolute left-0 m-12" @click="home()">Home</UButton>

      <UPopover :open="open" class="m-4 w-3/4" :popper="{ offsetDistance: -10 }" disabled>
        <UInput
          class="m-4 w-screen"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          label="Open"
          :trailing="true"
          placeholder="Search..."
          v-model="searchInput"
        />
        <template #panel
          ><UContainer class="w-fit h-fit flex flex-row">
            <UContainer class="flex flex-col">
              <UCard v-for="(movie, index) of 4" v-bind:key="index" class="w-screen">
                <ULink :to="`/movies/${movies?.results[index].id}`" @click="open = false">
                  <div class="flex flex-row space-x-4">
                    <img
                      :src="
                        movies?.results[index].poster_path !== null
                          ? `https://image.tmdb.org/t/p/w500${movies?.results[index].poster_path}`
                          : 'https://img.freepik.com/free-photo/abstract-luxury-plain-blur-grey-black-gradient-used-as-background-studio-wall-display-your-products_1258-63747.jpg?w=2000'
                      "
                      class="w-20 h-32"
                    />
                    <div>
                      <p>{{ movies?.results[index].title }}</p>
                      <p>{{ movies?.results[index].release_date }}</p>
                      <p class="w-3/5">{{ movies?.results[index].overview }}</p>
                    </div>
                  </div>
                </ULink>
              </UCard>
            </UContainer>
          </UContainer></template
        >
      </UPopover>
      <UButton v-if="userid != null" class="absolute right-0 m-12" @click="logout">Log out</UButton>
      <UButton v-else class="absolute right-0 m-12" @click="modalOpen = true">Login</UButton>
      <UModal v-model="modalOpen">
        <LoginModal @close="(event: any) => (modalOpen = !event)" />
      </UModal>
    </UContainer>
  </UContainer>
  <UDivider class="" />
</template>
<style lang="css"></style>
