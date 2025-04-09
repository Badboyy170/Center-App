import { View, Text, Button } from "react-native";
import { logout } from "@/firebase/authService";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome Home!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
