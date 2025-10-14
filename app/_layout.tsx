// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Splash en premier */}
        <Stack.Screen name="splash" />
        {/* Autres écrans */}
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="events/index" />
        <Stack.Screen name="events/calendar" />
        <Stack.Screen name="events/edit" />
        <Stack.Screen name="events/new" options={{ title: 'Nouvel événement', presentation: 'modal' }} />
      </Stack>
    </SafeAreaView>
  );
}


