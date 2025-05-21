import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppRoutes } from '@/src/config/routes';

export default function Onboarding3() {
  const router = useRouter();

  async function finishOnboarding() {
    await AsyncStorage.setItem("onboardingDone", "true"); // NEUŽKOMENTUOK!!!
    router.replace(AppRoutes.REGISTER);
  }

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Onboarding Screen 3</Text>
      <Button title="Finish" onPress={finishOnboarding} />


    </View>
  );
}
