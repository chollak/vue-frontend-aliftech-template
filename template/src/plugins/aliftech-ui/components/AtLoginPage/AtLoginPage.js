import { h, defineComponent, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";
import { EyeIcon, EyeOffIcon } from "@heroicons/vue/solid";

import AtCheckbox from "../AtCheckbox/AtCheckbox";
import AtInput from "../AtInput/AtInput";
import AtInputAddOn from "../AtInputAddOn/AtInputAddOn";
import AtPhoneSelect from "../AtPhoneSelect/AtPhoneSelect";
import AtButton from "../AtButton/AtButton";
import { hasOwnProperty } from "~/plugins/aliftech-ui/utils";

export default defineComponent({
  name: "AtLoginPage",
  model: {
    prop: ["phone", "email", "password", "rememberMe"],
  },
  props: {
    title: { type: String, default: "Авторизация" },
    titleLogo: {
      type: Object,
      default: () => {},
      validator: function (obj) {
        return hasOwnProperty(obj, "name") && hasOwnProperty(obj, "path");
      },
    },
    phoneLabel: { type: String, default: "Номер телефона" },
    phoneErrorText: {
      type: String,
      default: "Номер телефона не может быть пустым",
    },
    phone: { type: String, default: "" },
    emailLabel: { type: String, default: "Эл.почта" },
    emailErrorText: {
      type: Array,
      default: () => [
        "Эл.почта не может быть пустым",
        "Убедитесь в правильности эл.почти",
      ],
    },
    email: { type: String, default: "" },
    withEmail: { type: Boolean, default: false },
    password: { type: String, default: "" },
    passwordLabel: { type: String, default: "Пароль" },
    passwordErrorText: {
      type: Array,
      default: () => [
        "Пароль не может быть пустым",
        "Длина пароля минимум 6 символов",
      ],
    },
    rememberMe: { type: Boolean, default: false },
    rememberMeLabel: {
      type: String,
      default: "Запомнить меня на этом устройстве",
    },
    submitLabel: { type: String, default: "Войти" },
    submitLoading: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    let isSubmitted = ref(false);
    const v$ = useVuelidate();
    let passwordInputType = ref("password");

    const submit = () => {
      isSubmitted.value = true;
      if (
        (!v$.value.email.email.$invalid &&
          !v$.value.email.required.$invalid &&
          !v$.value.password.required.$invalid &&
          !v$.value.password.minLength.$invalid) ||
        (!v$.value.phone.required.$invalid &&
          !v$.value.password.required.$invalid &&
          !v$.value.password.minLength.$invalid)
      ) {
        emit("login");
      }
    };
    return {
      v$,
      passwordInputType,
      isSubmitted,
      submit,
    };
  },
  validations() {
    return {
      phone: { required, minLength: minLength(4) },
      email: { required, email },
      password: { required, minLength: minLength(6) },
    };
  },
  render() {
    return h(
      "div",
      {
        class: "p-4 max-w-xl min-w-md sm:py-6 sm:px-8 mx-auto relative m-auto",
      },
      [
        h("div", { class: "text-center w-96" }, [
          this.titleLogo
            ? h("img", {
                class: "h-10 mx-auto",
                src: this?.titleLogo?.path,
                alt: this?.titleLogo?.name,
              })
            : h("h", { class: "text-xl mx-auto inline" }, [h("b", this.title)]),
        ]),
        this.withEmail
          ? h(
              "div",
              { class: "mb-4 w-96" },
              h(AtInput, {
                label: this.emailLabel,
                placeholder: "test-08@mail.com",
                error:
                  this.isSubmitted &&
                  this.v$.email.email.$invalid &&
                  !this.v$.email.required.$invalid
                    ? this.emailErrorText[1]
                    : this.isSubmitted && this.v$.email.required.$invalid
                    ? this.emailErrorText[0]
                    : null,
                modelValue: this.email,
                type: "email",
                "onUpdate:modelValue": (email) =>
                  this.$emit("update:email", email),
              })
            )
          : h("div", { class: "mb-4 mt-4 w-96" }, [
              h(AtPhoneSelect, {
                label: this.phoneLabel,
                error:
                  this.v$.phone.$invalid && this.isSubmitted
                    ? this.phoneErrorText
                    : null,
                modelValue: this.phone,
                "onUpdate:modelValue": (phoneNumber) =>
                  this.$emit("update:phone", phoneNumber),
              }),
            ]),
        h(
          "div",
          { class: "mb-4 w-96" },
          h(
            AtInput,
            {
              label: this.passwordLabel,
              placeholder: "*********",
              error:
                this.isSubmitted &&
                this.v$.password.minLength.$invalid &&
                !this.v$.password.required.$invalid
                  ? this.passwordErrorText[1]
                  : this.isSubmitted && this.v$.password.required.$invalid
                  ? this.passwordErrorText[0]
                  : null,
              modelValue: this.password,
              type: this.passwordInputType,
              "onUpdate:modelValue": (password) =>
                this.$emit("update:password", password),
            },
            {
              addOnAfter: () =>
                h(
                  AtInputAddOn,
                  {
                    side: "right",
                    select: true,
                    class: "border-r-0 border-t-0 border-b-0 cursor-pointer",
                  },
                  {
                    default: () =>
                      this.passwordInputType === "text"
                        ? h(EyeIcon, {
                            class: "h-5 w-5 text-gray-400",
                            onClick: () =>
                              (this.passwordInputType = "password"),
                          })
                        : h(EyeOffIcon, {
                            class: "h-5 w-5 text-gray-400",
                            onClick: () => (this.passwordInputType = "text"),
                          }),
                  }
                ),
            }
          )
        ),
        h("div", { class: "w-96 grid grid-cols-5 gap-4" }, [
          h(
            "div",
            { class: "col-start-1 col-span-5" },
            h(AtCheckbox, {
              modelValue: this.rememberMe,
              label: this.rememberMeLabel,
              "onUpdate:modelValue": (checked) =>
                this.$emit("update:rememberMe", checked),
            })
          ),
          h(
            "div",
            { class: "col-span-5 w-96" },
            h(
              AtButton,
              {
                color: "primary",
                class: "w-full",
                loading: this.submitLoading,
                onClick: () => this.submit(),
              },
              {
                default: () =>
                  h(
                    "span",
                    { class: `${this.submitLoading ? "ml-3" : ""}` },
                    this.submitLabel
                  ),
              }
            )
          ),
        ]),
      ]
    );
  },
});
