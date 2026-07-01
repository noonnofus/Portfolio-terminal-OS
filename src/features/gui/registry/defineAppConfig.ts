import type {
  AppConfig,
  GuiAppId,
} from "@/features/gui/registry/appTypes";

export function defineAppConfig<K extends GuiAppId>(
  config: AppConfig<K>,
): AppConfig<K> {
  return config;
}
