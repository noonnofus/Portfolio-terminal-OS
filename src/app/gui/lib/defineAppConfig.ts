import type {
  AppConfig,
  GuiAppId,
} from "@/app/gui/types/appTypes";

export function defineAppConfig<K extends GuiAppId>(
  config: AppConfig<K>,
): AppConfig<K> {
  return config;
}
