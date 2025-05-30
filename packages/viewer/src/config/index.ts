import {
  Config,
  LocalStorageSource,
  ViteEnvSource
} from "@tikkhun/web-config";
const LocalStorageConfigKey = "VoerkaPhoneConfig";
// export class ViteEnvSource extends EnvSource {
//   getEnv() {
//     return import.meta.env;
//   }
//   initEnv() {
//     return true;
//   }
// }

const envSource = new ViteEnvSource({
  includePrefix: "VITE__VOERKA__",
  shouldRemovedPrefix: "VITE__VOERKA__",
  valueTransformer(_, value) {
    // 转换bool
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    return value;
  },
});
export const config = Config.create({
  sources: [
    envSource,
    new LocalStorageSource({ key: LocalStorageConfigKey, emitError: false }),
  ],
});
// console.log(`import.env`, import.meta.env);
if (import.meta.env.DEV) {
  (globalThis as any).$config = config;
}
