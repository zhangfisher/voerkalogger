import { Config, EnvSource, LocalStorageSource } from "@tikkhun/web-config";
// import { LocalStorageSource } from "@tikkhun/web-config";
const LocalStorageConfigKey = "VoerkaIndoorPositioningConfig";
// export
class ViteEnvSource extends EnvSource {
  getEnv() {
    return import.meta.env;
  }
  initEnv() {
    return true;
  }
}

const envSource = new ViteEnvSource({
  includePrefix: "VITE__VOERKA__",
  shouldRemovedPrefix: "VITE__VOERKA__",
  valueTransformer(key, value) {
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

export const LocalStorageSourceDefaultOptions = {
  // 存储的键值对
  key: "config",
  // 存储的
  saveDebounce: 10,
  emitError: false,
};

export const config = Config.create({
  sources: [
    envSource,
    new LocalStorageSource({
      key: LocalStorageConfigKey,
      saveDebounce: 0,
    }),
  ],
});
if (import.meta.env.DEV) {
  globalThis.$config = config;
}
