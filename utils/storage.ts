import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const EVENTS_KEY = '@events';

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;       // format YYYY-MM-DD
  participated?: boolean;
  city?: string;
  category?: 'conf' | 'atelier' | 'sortie';
  latitude?: number; 
  longitude?: number;
}

// Récupérer tous les événements
export const getEvents = async (): Promise<Event[]> => {
  const jsonValue = await AsyncStorage.getItem(EVENTS_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

// Sauvegarder tous les événements
export const saveEvents = async (events: Event[]) => {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

// Ajouter un événement avec ID unique
export const addEvent = async (event: Omit<Event, 'id'>) => {
  const events = await getEvents();
  const newEvent: Event = {
    id: uuid.v4() as string, // génération automatique
    ...event,
    participated: false,
  };
  events.push(newEvent);
  await saveEvents(events);
  console.log('Nouvel événement ajouté →', newEvent);
};

// Supprimer un événement
export const deleteEvent = async (id: string) => {
  const events = await getEvents();
  const filtered = events.filter(e => e.id !== id);
  await saveEvents(filtered);
};

// Toggle participation
export const toggleParticipation = async (id: string) => {
  const events = await getEvents();
  const updated = events.map(e =>
    e.id === id ? { ...e, participated: !e.participated } : e
  );
  await saveEvents(updated);
};

// Modifier un événement existant
export const updateEvent = async (updatedEvent: Event) => {
  const events = await getEvents();
  const updated = events.map(e => (e.id === updatedEvent.id ? updatedEvent : e));
  await saveEvents(updated);
};

export const logEvents = async () => {
  const events = await getEvents();
  console.log('📦 Événements stockés dans AsyncStorage:', events);
};
