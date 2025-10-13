import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="index" options={{ title: 'Connexion' }} />
        <Stack.Screen name="events/index" options={{ title: 'Événements' }} />
        <Stack.Screen name="events/new" options={{ title: 'Nouvel événement' }} />
      </Stack>
    </SafeAreaView>
  );
}

