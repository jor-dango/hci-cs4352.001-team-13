import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        default: {
          color: DynamicColorIOS({
            dark: "#9CA3AF",
            light: "#6B7280",
          }),
        },
        selected: {
          color: DynamicColorIOS({
            dark: "#383AB2",
            light: "#383AB2",
          }),
        },
      }}
      tintColor={DynamicColorIOS({
        dark: "#383AB2",
        light: "#383AB2",
      })}
    >
      <NativeTabs.Trigger name="index">
        <Icon
          sf={{
            default: "square.and.arrow.up",
            selected: "square.and.arrow.up.fill",
          }}
          drawable="custom_android_drawable"
        />
        <Label>Upload</Label>
      </NativeTabs.Trigger>

      {/* Hide analysis and chat from tab bar */}

      <NativeTabs.Trigger name="history">
        <Icon
          sf={{
            default: "text.book.closed",
            selected: "text.book.closed.fill",
          }}
          drawable="custom_android_drawable"
        />
        <Label>History</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Icon
          sf={{
            default: "gearshape",
            selected: "gearshape.fill",
          }}
          drawable="custom_settings_drawable"
        />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
