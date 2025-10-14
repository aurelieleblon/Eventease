import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getEvents, updateEvent, Event } from '../../utils/storage';
import { theme } from '../../assets/styles/theme';

export default function EditEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      const events = await getEvents();
      const ev = events.find(e => e.id === id);
      if (!ev) return;
      setTitle(ev.title);
      setDescription(ev.description || '');
      setDate(ev.date);
    };
    loadEvent();
  }, [id]);

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!title || !date) {
      setErrorMessage('Veuillez remplir le titre et la date.');
      return;
    }

    try {
      const updatedEvent: Event = { id: id as string, title, description, date };
      await updateEvent(updatedEvent);

      setSuccessMessage('🎉 Événement modifié !');
      setTimeout(() => router.back(), 1000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage('Impossible de modifier l’événement.');
    }
  };

  return (
    <View style={[theme.container, { justifyContent: 'center' }]}>
      <Text style={theme.title}>Modifier l'événement</Text>

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

      {errorMessage ? (
        <Text style={[theme.notParticipatedBadge, { textAlign: 'center' }]}>{errorMessage}</Text>
      ) : null}

      {successMessage ? (
        <Text style={[theme.participatedBadge, { textAlign: 'center' }]}>{successMessage}</Text>
      ) : null}

      <TouchableOpacity style={theme.button} onPress={handleSave}>
        <Text style={theme.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}
