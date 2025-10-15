import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { validateUser, storeLoggedUser } from '../app/services/auth';
import { theme } from '../assets/styles/theme';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const user = await validateUser(email, password);
      if (user) {
        await storeLoggedUser(user);
        Alert.alert('Connexion réussie', `Bienvenue ${user.email} !`);
        router.push('/events'); // redirection vers liste des événements
      } else {
        setErrorMessage('Email ou mot de passe incorrect.');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de la connexion.');
    }
  };

  return (
    <View style={theme.container}>
      <Text style={[theme.title, {marginTop: 120}]}>Connexion</Text>

      <TextInput
        style={theme.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={theme.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMessage ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMessage}</Text> : null}

      <TouchableOpacity style={theme.button} onPress={handleLogin}>
        <Text style={theme.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={theme.button} onPress={() => router.push('/register')}>
        <Text style={theme.buttonText}>Pas encore inscrit ?</Text>
      </TouchableOpacity>
    </View>
  );
}


