import { useState, useCallback, useEffect } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { getEvents, Event } from '../../utils/storage';
import { getWeather } from '../../utils/weather'; // ← importe ici

export default function EventCalendarScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);

  const loadEvents = async () => {
    const data = await getEvents();
    const normalized = data.map(ev => ({ ...ev, date: ev.date.split('T')[0] }));
    setEvents(normalized);

    const marks: { [key: string]: { marked: boolean; dotColor: string } } = {};
    normalized.forEach(ev => {
      marks[ev.date] = { marked: true, dotColor: ev.participated ? 'green' : 'gold' };
    });
    setMarkedDates(marks);
  };

  useFocusEffect(useCallback(() => { loadEvents(); }, []));

  const handleDayPress = async (day: DateData) => {
    const dayEvents = events.filter(ev => ev.date === day.dateString);

    if (dayEvents.length > 0) {
      setSelectedDate(day.dateString);
      setSelectedDayEvents(dayEvents);
      setModalVisible(true);

      // Récupération météo pour la première ville trouvée
      const firstCity = dayEvents[0].city || 'Paris'; // <-- valeur par défaut
      const weatherData = await getWeather(firstCity);
      setWeather(weatherData);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: '#002855',
          todayTextColor: '#DAA520',
          dotColor: '#DAA520',
          arrowColor: '#002855',
        }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎶 Événements du {selectedDate}</Text>

            {/* SECTION MÉTÉO */}
            {weather && (
              <View style={styles.weatherBox}>
                <Text style={styles.weatherText}>
                  🌤️ {weather.city} — {weather.temperature}°C, {weather.description}
                </Text>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
                  style={{ width: 50, height: 50 }}
                />
              </View>
            )}

            <ScrollView style={{ maxHeight: 300 }}>
              {selectedDayEvents.map((ev) => (
                <View key={ev.id} style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{ev.title}</Text>
                  {ev.description ? <Text style={styles.eventDescription}>{ev.description}</Text> : null}
                  {ev.city ? <Text style={styles.cityText}>📍 {ev.city}</Text> : null}
                  <Text style={[styles.status, { color: ev.participated ? 'green' : 'red' }]}>
                    {ev.participated ? '✅ Participé' : '❌ Non participé'}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001F3F', padding: 10 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#002855',
    textAlign: 'center',
  },
  weatherBox: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 16,
    color: '#002855',
  },
  eventCard: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#DAA520',
  },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#002855' },
  eventDescription: { fontSize: 14, color: '#333', marginTop: 4 },
  cityText: { fontSize: 14, color: '#555', marginTop: 4 },
  status: { marginTop: 6, fontWeight: '600' },
  closeButton: {
    backgroundColor: '#DAA520',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#002855',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

