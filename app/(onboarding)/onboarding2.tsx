import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding1() {
  const router = useRouter();

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Onboarding Screen 1</Text>
      <Button 
        title="Next" 
        onPress={() => router.push('/(onboarding)/onboarding3')} 
      />
    </View>
  );
}
