import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../assets/styles/theme';

export default function HomeScreen() {
  return (
    <View style={theme.container}>
      <Text style={[theme.title, {marginTop: 120}]}>Bienvenue sur EventEase</Text>
      <Text style={{ color: '#E0E1DD', fontSize: 16, marginBottom: 40, textAlign: 'center' }}>
        Organisez et suivez vos événements facilement !
      </Text>

      <TouchableOpacity style={theme.button} onPress={() => router.push('/login')}>
        <Text style={theme.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[theme.button, { backgroundColor: '#7980caff' }]} onPress={() => router.push('/register')}>
        <Text style={theme.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

