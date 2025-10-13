import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur EventEase</Text>
      <Text style={styles.subtitle}>Organisez et suivez vos événements facilement !</Text>

      <View style={styles.buttons}>
        <Button
          title="Se connecter"
          onPress={() => router.push('/login')}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title="S'inscrire"
          onPress={() => router.push('/register')}
          color="#4CAF50"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 40, textAlign: 'center', color: '#555' },
  buttons: { width: '80%', marginVertical: 10 },
});
