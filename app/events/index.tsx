import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import EventItem from '../../components/EventItem';
import EmptyState from '../../components/EmptyState';
import { getEvents, deleteEvent, toggleParticipation, Event } from '../../utils/storage';
import { clearLoggedUser } from '../services/auth';
import { theme } from '../../assets/styles/theme';

export default function EventListScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

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
    await deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
    setMessage('🗑️ Événement supprimé !');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleMarkParticipated = async (id: string) => {
    const event = events.find(e => e.id === id);
    if (event?.participated) return;

    await toggleParticipation(id);
    setEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, participated: true } : e))
    );

    setMessage('✅ Participation enregistrée !');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleLogout = async () => {
    await clearLoggedUser();
    setMessage('🚪 Déconnexion réussie !');
    setTimeout(() => setMessage(''), 2000);
    router.replace('/login');
  };

  return (
    <View style={theme.container}>
      {/* 🔹 Bouton Déconnexion */}
      <TouchableOpacity style={theme.logoutButton} onPress={handleLogout}>
        <Text style={theme.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      {/* 🔹 Message */}
      {message ? <Text style={theme.message}>{message}</Text> : null}

      {/* 🔹 Liste ou message vide */}
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventItem
              event={item}
              onMarkParticipated={() => handleMarkParticipated(item.id)}
              onDelete={() => handleDelete(item.id)}
              onEdit={() => router.push(`/events/edit?id=${item.id}`)}
            />
          )}
        />
      ) : (
        <EmptyState message="Aucun événement pour le moment." />
      )}

      {/* 🔹 Boutons principaux */}
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
          console.log('Événements AsyncStorage →', events);
        }}
      >
        <Text style={theme.buttonText}>Voir les événements dans la console</Text>
      </TouchableOpacity>
    </View>
  );
}



