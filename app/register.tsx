import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { saveUser } from '../app/services/auth';
import { theme } from '../assets/styles/theme';

export default function RegisterScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password || !confirmPassword) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const user = await saveUser({ email, password });
      setSuccessMessage('🎉 Vous êtes bien inscrit !');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de l’inscription.');
    }
  };

  return (
    <View style={[theme.container, { justifyContent: 'center' }]}>
      <Text style={theme.title}>Inscription</Text>

      <TextInput
        style={theme.input}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={theme.input}
        placeholder="Mot de passe"
        placeholderTextColor="#555"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={theme.input}
        placeholder="Confirmer mot de passe"
        placeholderTextColor="#555"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {errorMessage ? <Text style={{ color: '#E53935', textAlign: 'center', marginBottom: 10 }}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={{ color: '#4CAF50', textAlign: 'center', marginBottom: 10 }}>{successMessage}</Text> : null}

      <TouchableOpacity style={theme.button} onPress={handleRegister}>
        <Text style={theme.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[theme.button, { backgroundColor: '#4CAF50', marginTop: 10 }]}
        onPress={() => router.push('/login')}
      >
        <Text style={theme.buttonText}>Déjà inscrit ?</Text>
      </TouchableOpacity>
    </View>
  );
}
