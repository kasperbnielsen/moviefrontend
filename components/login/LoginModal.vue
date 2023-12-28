<script setup lang="ts">
import axios from "axios";
import { useRuntimeConfig } from "nuxt/app";

import { ref } from "vue";
import { watch } from "vue";

const user = ref();

const config = useRuntimeConfig();
const SERVER_HOST = config.public.SERVER_HOST;

const emit = defineEmits<{ (e: "close", value: boolean): void }>();

const username = ref("");
const password = ref("");
const signupPassword = ref("");
const signupUsername = ref("");
const showSignup = ref(false);

user.value = {
  userid: "123",
  email: "123",
  password: "123",
  refreshToken: "123",
  watchList: ["213231"],
};

watch(user, () => {
  console.log(user.value);
});

async function signup() {
  await axios.post(`${SERVER_HOST}/users`, {
    username: signupUsername.value,
    password: signupPassword.value,
  });

  showSignup.value = false;
}

async function login() {
  await axios
    .post(`${SERVER_HOST}/authenticate`, {
      username: username.value,
      password: password.value,
    })
    .then((response) => {
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userid", response.data._id);
    });

  console.log(localStorage.getItem("userid"));

  emit("close", true);
}
</script>

<template>
  <UContainer v-if="!showSignup" class="flex flex-col">
    <button @click="emit('close', true)">
      <UIcon name="i-material-symbols-close" dynamic class="absolute top-0 right-0 m-6" />
    </button>

    <h1 class="self-center m-4 mb-20 text-xl">Login</h1>
    <UInput placeholder="Username" type="text" v-model="username" class="m-4 self-center" />
    <UInput placeholder="Password" type="password" v-model="password" class="m-4 self-center" />
    <UButton @click="login" class="self-center m-4"> Login</UButton>
    <button @click="showSignup = true">
      <ULink class="mt-16 mb-4">Sign up</ULink>
    </button>
  </UContainer>
  <UContainer v-else class="flex flex-col"
    ><button @click="emit('close', true)">
      <UIcon name="i-material-symbols-close" dynamic class="absolute top-0 right-0 m-6" />
    </button>

    <h1 class="self-center m-4 mb-20 text-xl">Sign up</h1>
    <UInput placeholder="Username" type="text" v-model="signupUsername" class="m-4 self-center" />
    <UInput placeholder="Password" type="password" v-model="signupPassword" class="m-4 self-center" />
    <UButton @click="signup" class="self-center m-4"> Sign up</UButton>
    <div>
      Already have an account?
      <button @click="showSignup = false">
        <ULink class="mt-16 mb-4">Log in</ULink>
      </button>
    </div>
  </UContainer>
</template>

<style lang="scss"></style>
