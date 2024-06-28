import {View, Text} from 'react-native';
import { SignOut } from './Auth/SignOut';
export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
      <SignOut />
    </View>
  );
}