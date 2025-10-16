import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { addEvent } from '../../utils/storage';
import { theme } from '../../assets/styles/theme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

export default function NewEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!title || !date || !city) {
      setErrorMessage('Veuillez remplir le titre, la date et la ville.');
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];

    try {
      // 🔹 Géocodage de la ville
      const geocode = await Location.geocodeAsync(city.trim());
      if (geocode.length === 0) {
        setErrorMessage("Ville introuvable, veuillez vérifier l'orthographe !");
        return;
      }

      const coords = { latitude: geocode[0].latitude, longitude: geocode[0].longitude };

      await addEvent({
        title,
        description,
        date: formattedDate,
        city: city.trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
        participated: false,
      });

      setSuccessMessage('🎉 Événement ajouté !');
      setTitle('');
      setDescription('');
      setCity('');
      setDate(new Date());
      setTimeout(() => router.back(), 1000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Impossible d’ajouter l’événement.");
    }
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(Platform.OS === 'ios');
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
        placeholder="Ville (ex: Paris)"
        placeholderTextColor="#555"
        style={theme.input}
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity
        style={[theme.input, { justifyContent: 'center' }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: '#000' }}>
          📅 {date.toISOString().split('T')[0]}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
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


