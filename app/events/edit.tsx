import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getEvents, updateEvent, Event } from '../../utils/storage';

export default function EditEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // récupère l'id depuis la route
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

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
    if (!title || !date) {
      Alert.alert('Erreur', 'Veuillez remplir le titre et la date.');
      return;
    }

    const updatedEvent: Event = { id: id as string, title, description, date };
    await updateEvent(updatedEvent);
    Alert.alert('Événement modifié !');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier l'événement</Text>
      <TextInput placeholder="Titre" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput placeholder="Date (YYYY-MM-DD)" style={styles.input} value={date} onChangeText={setDate} />
      <Button title="Enregistrer" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
