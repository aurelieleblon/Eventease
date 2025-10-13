import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Event } from '../utils/storage';

interface Props {
  onSubmit: (data: Omit<Event, 'id' | 'participated'>) => void;
  defaultValues?: Partial<Omit<Event, 'id' | 'participated'>>;
}

export default function EventForm({ onSubmit, defaultValues = {} }: Props) {
  const [title, setTitle] = useState(defaultValues.title || '');
  const [desc, setDesc] = useState(defaultValues.description || '');
  const [date, setDate] = useState(defaultValues.date || '');

  const handleSave = () => {
    if (!title || !date) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
    console.log('EventForm handleSave →', { title, description: desc, date });
    onSubmit({ title, description: desc, date });
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (ex: 2025-10-15)"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Enregistrer" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

