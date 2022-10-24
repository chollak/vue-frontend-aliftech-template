## Pulling 2.x Templates (Legacy)[#](https://cli.vuejs.org/guide/creating-a-project.html#pulling-2-x-templates-legacy)

Vue CLI >= 3 uses the same  `vue`  binary, so it overwrites Vue CLI 2 (`vue-cli`). If you still need the legacy  `vue init`  functionality, you can install a global bridge:

```
npm install -g @vue/cli-init
# vue init now works exactly the same as vue-cli@2.x
vue init chollak/vue-frontend-aliftech-template
```