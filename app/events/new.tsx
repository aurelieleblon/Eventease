import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { addEvent } from '../../utils/storage';
import { theme } from '../../assets/styles/theme';

export default function NewEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!title || !date) {
      setErrorMessage('Veuillez remplir le titre et la date.');
      return;
    }

    const formattedDate = new Date(date).toISOString().split('T')[0];

    try {
      await addEvent({
        title,
        description,
        date: formattedDate,
        participated: false,
      });

      setSuccessMessage('🎉 Événement ajouté !');
      setTitle('');
      setDescription('');
      setDate('');

      setTimeout(() => router.back(), 1000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage('Impossible d’ajouter l’événement.');
    }
  };

  return (
    <View style={[theme.container, { justifyContent: 'center' }]}>
      <Text style={theme.title}>Nouvel événement</Text>

      <TextInput
        placeholder="Titre"
        placeholderTextColor="#555"
        style={theme.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor="#555"
        style={theme.input}
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor="#555"
        style={theme.input}
        value={date}
        onChangeText={setDate}
      />

      {errorMessage ? <Text style={[theme.notParticipatedBadge, { textAlign: 'center' }]}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={[theme.participatedBadge, { textAlign: 'center' }]}>{successMessage}</Text> : null}

      <TouchableOpacity style={theme.button} onPress={handleSave}>
        <Text style={theme.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}
