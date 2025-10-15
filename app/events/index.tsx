import { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import EventItem from '../../components/EventItem';
import EmptyState from '../../components/EmptyState';
import { getEvents, deleteEvent, toggleParticipation, Event } from '../../utils/storage';
import { clearLoggedUser } from '../services/auth';
import { theme } from '../../assets/styles/theme';

export default function EventListScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'participated' | 'notParticipated'>('all');
  const [cityFilter, setCityFilter] = useState('');
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

  // 🔹 Filtrage des événements
  const filteredEvents = events.filter(ev => {
    if (filter === 'participated' && !ev.participated) return false;
    if (filter === 'notParticipated' && ev.participated) return false;
    if (cityFilter && !ev.city?.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={theme.container}>
      {/* 🔹 Déconnexion */}
      <TouchableOpacity style={theme.logoutButton} onPress={handleLogout}>
        <Text style={theme.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      {/* 🔹 Message */}
      {message ? <Text style={theme.message}>{message}</Text> : null}

      {/* 🔹 Filtres */}
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <TouchableOpacity onPress={() => setFilter('all')} style={{ marginRight: 5 }}>
          <Text style={{ color: filter === 'all' ? '#DAA520' : '#fff' }}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('participated')} style={{ marginRight: 5 }}>
          <Text style={{ color: filter === 'participated' ? '#DAA520' : '#fff' }}>✅ Participé</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('notParticipated')}>
          <Text style={{ color: filter === 'notParticipated' ? '#DAA520' : '#fff' }}>❌ Non participé</Text>
        </TouchableOpacity>
      </View>

     <TextInput
       placeholder="Filtrer par ville"
       placeholderTextColor="#ccc" // couleur du texte du placeholder
       value={cityFilter}
       onChangeText={setCityFilter}
       style={{
         borderWidth: 1,
         borderColor: '#ccc',
         padding: 5,
         marginBottom: 10,
         color: '#fff' // texte saisi en blanc
       }}
     />

      {/* 🔹 Liste des événements */}
      {filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
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
    </View>
  );
}
