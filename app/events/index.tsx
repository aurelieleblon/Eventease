import { useState, useCallback } from 'react';
import { View, FlatList, Button, Alert, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import EventItem from '../../components/EventItem';
import EmptyState from '../../components/EmptyState';
import { getEvents, deleteEvent, toggleParticipation, Event } from '../../utils/storage';
import { theme } from '../styles/theme';

export default function EventListScreen() {
  const [events, setEvents] = useState<Event[]>([]);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const handleDelete = async (id: string) => {
    console.log('Suppression demandée pour id:', id);
    await deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleMarkParticipated = async (id: string) => {
  // On ne fait rien si déjà participé
  const event = events.find(e => e.id === id);
  if (event?.participated) return;

  await toggleParticipation(id); // met participated à true dans AsyncStorage
  setEvents(prev =>
    prev.map(e => (e.id === id ? { ...e, participated: true } : e))
  );
  console.log('Événement marqué comme participé →', id);
};
  return (
    <View style={theme.container}>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventItem
              event={item}
              onMarkParticipated={() => handleMarkParticipated(item.id)} // <-- nouveau
              onDelete={() => handleDelete(item.id)}
              onEdit={() => router.push(`/events/edit?id=${item.id}`)}
            />
          )}
        />
      ) : (
        <EmptyState message="Aucun événement pour le moment." />
      )}

      {/* Boutons principaux */}
      <TouchableOpacity style={theme.button} onPress={() => router.push('/events/new')}>
        <Text style={theme.buttonText}>Créer un nouvel événement</Text>
      </TouchableOpacity>

      <TouchableOpacity style={theme.button} onPress={() => router.push('/events/calendar')}>
        <Text style={theme.buttonText}>Voir le calendrier</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={theme.button}
        onPress={async () => {
          const events = await getEvents();
          console.log('📦 Événements AsyncStorage →', events);
        }}
      >
        <Text style={theme.buttonText}>Voir les événements dans la console</Text>
      </TouchableOpacity>
    </View>
  );
}

