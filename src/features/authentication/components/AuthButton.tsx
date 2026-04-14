import { TouchableOpacity, Text } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export default function AuthButton({
  title,
  onPress,
  loading,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{ padding: 15, backgroundColor: "black" }}
    >
      <Text style={{ color: "white" }}>
        {loading ? "Please wait..." : title}
      </Text>
    </TouchableOpacity>
  );
}