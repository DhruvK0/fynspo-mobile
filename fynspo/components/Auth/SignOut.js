import { useAuth } from "@clerk/clerk-expo";
import { View } from "react-native";  
import { IconButton } from "react-native-paper";

export const SignOut = () => {
  const { isLoaded,signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <IconButton icon="logout" label="Logout" onPress={() => {
          signOut();
        }} />
    </View>
  );
};