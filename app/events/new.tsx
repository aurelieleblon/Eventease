import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { addEvent } from '../../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export default function NewEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSave = async () => {
  if (!title || !date) {
    Alert.alert('Erreur', 'Veuillez remplir le titre et la date.');
    return;
  }

  // Normaliser la date
  const formattedDate = new Date(date).toISOString().split('T')[0];

  // Ajouter l'événement (id sera généré dans addEvent)
  await addEvent({
    title,
    description,
    date: formattedDate,
    participated: false
  });

  Alert.alert('Événement ajouté !');
  router.back();
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvel événement</Text>

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
