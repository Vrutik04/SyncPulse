import { Text } from "react-native";

export default function AuthError({ error }: { error: string | null }) {
  if (!error) return null;
  return <Text style={{ color: "red" }}>{error}</Text>;
}