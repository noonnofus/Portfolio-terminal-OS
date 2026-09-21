import type {
  AppConfig,
  DesktopAppId,
} from "@/app/desktop/types/appTypes";

export function defineAppConfig<K extends DesktopAppId>(
  config: AppConfig<K>,
): AppConfig<K> {
  return config;
}
