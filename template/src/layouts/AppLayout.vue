<template>
  <div class="min-h-screen bg-white">
    <AtNavbar
      :navLinks="navLinks"
      :user="$_at_user"
      in-container
      @logout="logout"
    />
    <div class="py-10">
      <header>
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            {{ $route.name }}
          </h1>
        </div>
      </header>
      <main>
        <div class="container mx-auto sm:px-6 lg:px-8">
          <!-- Replace with your content -->
          <div class="px-4 py-8 sm:px-0">
            <router-view />
          </div>
          <!-- /End replace -->
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import AtNavbar from "~/plugins/aliftech-ui/components/AtNavbar/AtNavbar";
import { logout as serviceLogout } from "~/services/auth.api";

export default {
  components: {
    AtNavbar,
  },
  setup() {
    const navLinks = ref([
      { title: "Home", to: { name: "Home" } },
      { title: "About", to: { name: "About" } },
      { title: "Auth", to: { name: "Auth" } },
      { title: "Credits", to: { name: "Credits" } },
    ]);

    const logout = () => {
      serviceLogout();
    };

    return { navLinks, logout };
  },
};
</script>
