import { TextInput, View, Text } from "react-native";

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  secure?: boolean;
}

export default function AuthInput({
  label,
  value,
  onChange,
  secure,
}: Props) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        style={{ borderWidth: 1, padding: 10 }}
      />
    </View>
  );
}