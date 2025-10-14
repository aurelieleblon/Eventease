import { View, Text, TouchableOpacity } from 'react-native';
import { Event } from '../utils/storage';
import { theme } from '../assets/styles/theme';

interface Props {
  event: Event;
  onMarkParticipated: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export default function EventItem({ event, onMarkParticipated, onDelete, onEdit }: Props) {
  return (
    <View style={theme.card}>
      {/* Titre */}
      <Text style={theme.cardTitle}>{event.title}</Text>

      {/* Description */}
      {event.description ? <Text style={theme.cardDescription}>{event.description}</Text> : null}

      {/* Date */}
      <Text style={theme.cardDate}>📅 {event.date}</Text>

      {/* Statut participation */}
      <Text
        style={event.participated ? theme.participatedBadge : theme.notParticipatedBadge}
      >
        {event.participated ? '✅ Participé' : '❌ Non participé'}
      </Text>

      {/* Boutons */}
      <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
        {!event.participated && (
          <TouchableOpacity
            onPress={onMarkParticipated}
            style={[theme.button, { flex: 1, marginRight: 5, backgroundColor: '#7FB77E' }]} // vert doux
          >
            <Text style={theme.buttonText}>Participé</Text>
          </TouchableOpacity>
        )}

        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            style={[theme.button, { flex: 1, marginRight: 5, backgroundColor: '#6b92c0ff' }]}
          >
            <Text style={theme.buttonText}>Modifier</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onDelete}
          style={[theme.button, { flex: 1, backgroundColor: '#D77C6B' }]} // rouge doux
        >
          <Text style={theme.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
