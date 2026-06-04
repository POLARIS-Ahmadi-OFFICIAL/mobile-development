import { Text, TextInput, View } from "react-native";

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
}: {
  label: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
}) {
  return (
    <View className="mb-3">
      <Text className="mb-1 text-sm font-medium text-[var(--st-text)]">{label}</Text>
      <TextInput
        className="rounded-md border border-[var(--st-border)] bg-[var(--st-surface)] px-3 py-2 text-sm text-[var(--st-text)]"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="var(--st-muted)"
        secureTextEntry={secureTextEntry}
        multiline={multiline}
      />
    </View>
  );
}
