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

      {/* Ville */}
      {event.city ? <Text style={theme.cityText}>📍 {event.city}</Text> : null}

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
            style={[
              theme.button,
              {
                flex: 1,
                marginRight: 5,
                paddingVertical: 4,
                backgroundColor: '#7FB77E',
              },
            ]}
          >
            <Text style={[theme.buttonText, { fontSize: 12 }]}>Participé</Text>
          </TouchableOpacity>
        )}

        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            style={[
              theme.button,
              {
                flex: 1,
                marginRight: 5,
                paddingVertical: 4,
                backgroundColor: '#6b92c0ff',
              },
            ]}
          >
            <Text style={[theme.buttonText, { fontSize: 12 }]}>Modifier</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onDelete}
          style={[
            theme.button,
            {
              flex: 1,
              paddingVertical: 4,
              backgroundColor: '#D77C6B',
            },
          ]}
        >
          <Text style={[theme.buttonText, { fontSize: 12 }]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

