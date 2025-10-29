import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function TabLayout() {
  return (
    <NativeTabs
      // Label style for both default (unselected) and selected states
      labelStyle={{
        default: {
          color: DynamicColorIOS({
            dark: "#9CA3AF", // gray for dark mode
            light: "#6B7280", // gray for light mode
          }),
        },
        selected: {
          color: DynamicColorIOS({
            dark: "#383AB2", // accent color for dark mode
            light: "#383AB2", // accent color for light mode
          }),
        },
      }}
      // Icon tint color for selected state
      tintColor={DynamicColorIOS({
        dark: "#383AB2",
        light: "#383AB2",
      })}
    >
      <NativeTabs.Trigger name="index">
        <Label>Upload</Label>
        <Icon
          sf={{
            default: "square.and.arrow.up",
            selected: "square.and.arrow.up.fill",
          }}
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>

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
