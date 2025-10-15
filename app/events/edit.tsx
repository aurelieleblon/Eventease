import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { getEvents, updateEvent, Event } from '../../utils/storage';
import { theme } from '../../assets/styles/theme';

export default function EditEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState(new Date()); // <-- stocke en Date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      const events = await getEvents();
      const ev = events.find(e => e.id === id);
      if (!ev) return;
      setTitle(ev.title);
      setDescription(ev.description || '');
      setCity(ev.city || '');
      setDate(new Date(ev.date)); // <-- convertit la string en Date
    };
    loadEvent();
  }, [id]);

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!title || !city || !date) {
      setErrorMessage('Veuillez remplir le titre, la ville et la date.');
      return;
    }

    try {
      const updatedEvent: Event = { 
        id: id as string, 
        title, 
        description, 
        city, 
        date: date.toISOString().split('T')[0] // <-- format YYYY-MM-DD
      };
      await updateEvent(updatedEvent);

      setSuccessMessage('🎉 Événement modifié !');
      setTimeout(() => router.back(), 1000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage('Impossible de modifier l’événement.');
    }
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(Platform.OS === 'ios'); // sur iOS, le picker reste visible
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
        placeholder="Ville"
        placeholderTextColor="#555"
        style={theme.input}
        value={city}
        onChangeText={setCity}
      />

      {/* DatePicker */}
      <TouchableOpacity
        style={[theme.input, { justifyContent: 'center' }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: '#000' }}>📅 {date.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date(2020, 0, 1)}
          maximumDate={new Date(2035, 11, 31)}
        />
      )}

      {errorMessage ? <Text style={[theme.notParticipatedBadge, { textAlign: 'center' }]}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={[theme.participatedBadge, { textAlign: 'center' }]}>{successMessage}</Text> : null}

      <TouchableOpacity style={theme.button} onPress={handleSave}>
        <Text style={theme.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}
