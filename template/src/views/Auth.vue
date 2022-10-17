<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <img
      class="mx-auto h-12 w-auto"
      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
      alt="Workflow"
    />
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Or
      <router-link :to="{ path: '/' }" class="font-medium text-indigo-600 hover:text-indigo-500"> go home </router-link>
    </p>
  </div>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <AtAlert v-if="alert" class="mb-5" type="danger" dismissible :title="alert.title"> </AtAlert>
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" @submit.prevent="login">
        <AtPhoneSelect
          label="Phone number"
          :error="errors?.phone"
          v-model="phoneNumber"
          :disabled="loading"
        ></AtPhoneSelect>
        <AtInput
          label="Password"
          v-model="password"
          :error="errors?.password"
          autocomplete="current-password"
          type="password"
          :disabled="loading"
        />

        <AtCheckbox label="Remember me" v-model="isRemember" />
        <AtButton class="w-full flex justify-center" type="submit" color="primary" :loading="loading">
          Sign in</AtButton
        >
      </form>
    </div>
  </div>
</template>

<script>
  import AtPhoneSelect from '~/plugins/aliftech-ui/components/AtPhoneSelect/AtPhoneSelect';
  import AtAlert from '~/plugins/aliftech-ui/components/AtAlert/AtAlert';
  import AtInput from '~/plugins/aliftech-ui/components/AtInput/AtInput';
  import AtCheckbox from '~/plugins/aliftech-ui/components/AtCheckbox/AtCheckbox';
  import AtButton from '~/plugins/aliftech-ui/components/AtButton/AtButton';

  import { login as serviceLogin } from '~/services/auth.api';
  import { useService } from '~/hooks/useService';
  import { ref, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  export default {
    components: {
      AtPhoneSelect,
      AtAlert,
      AtInput,
      AtCheckbox,
      AtButton,
    },
    name: 'Auth',
    setup() {
      const router = useRouter();
      const route = useRoute();

      const phoneNumber = ref('');
      const password = ref('');
      const isRemember = ref(false);

      const { loading, errors: serviceErrors, execute, alert } = useService(serviceLogin);

      const errors = computed(() => serviceErrors.value);

      const login = () => {
        const params = {
          phone: phoneNumber.value,
          password: password.value,
          remember_me: isRemember.value,
        };
        execute(params).then(() => {
          router.replace({ path: route?.query?.from ?? '/' });
        });
      };

      return {
        phoneNumber,
        password,
        isRemember,
        errors,
        login,
        loading,
        alert,
      };
    },
  };
</script>
