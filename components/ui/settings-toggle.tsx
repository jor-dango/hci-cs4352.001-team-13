import { GlobalStyles } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { Text, TouchableOpacity, View } from "react-native";

interface SettingsToggleProps {
  name: string;
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function SettingsToggle({ name, label, value, onValueChange }: SettingsToggleProps) {
  const handleToggle = async () => {
    // Selection haptic feedback
    await Haptics.selectionAsync();
    onValueChange(!value);
  };

  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minWidth: '100%', paddingTop: 8, paddingBottom: 8 }}>
      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Text style={[GlobalStyles.body]}>
          {name}
        </Text>
        {label &&
          <Text style={[GlobalStyles.small, { color: "#6C6C6C" }]} >
            {label}
          </Text>
        }
      </View>
      <TouchableOpacity
        style={{ width: 24, aspectRatio: 1 / 1, backgroundColor: '#BEBEBE', borderRadius: 6, padding: 4 }}
        onPress={handleToggle}
      >
        <View style={{ backgroundColor: value ? '#383AB2' : '', width: '100%', aspectRatio: 1 / 1, borderRadius: 2 }} />
      </TouchableOpacity>
    </View>
  );
}