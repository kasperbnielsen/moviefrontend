import { defineStore } from "pinia";
import { ref } from "vue";

export const userStore = defineStore("user", () => {
  const user = ref<{
    userid: string;
    email: string;
    password: string;
    refreshToken: string;
    watchList: string[];
  }>();

  const temp = ref<string>();

  return { user, temp };
});
