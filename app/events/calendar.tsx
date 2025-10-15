import { useState, useCallback, useEffect } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { getEvents, Event } from '../../utils/storage';
import { getWeather } from '../services/weather';
import { getUserLocation, getDistanceFromLatLonInKm } from '../services/location';

export default function EventCalendarScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const loadEvents = async () => {
    const data = await getEvents();
    const normalized = data.map(ev => ({ ...ev, date: ev.date.split('T')[0] }));
    setEvents(normalized);

    const marks: { [key: string]: { marked: boolean; dotColor: string } } = {};
    normalized.forEach(ev => {
      marks[ev.date] = { marked: true, dotColor: ev.participated ? 'green' : 'red' };
    });
    setMarkedDates(marks);
  };

  useFocusEffect(useCallback(() => { loadEvents(); }, []));

  useEffect(() => {
    (async () => {
      const location = await getUserLocation();
      setUserLocation(location);
    })();
  }, []);

  const handleDayPress = async (day: DateData) => {
    const dayEvents = events.filter(ev => ev.date === day.dateString);

    if (dayEvents.length > 0) {
      setSelectedDate(day.dateString);
      setSelectedDayEvents(dayEvents);
      setModalVisible(true);

      // Récupération météo pour la première ville trouvée
      const firstCity = dayEvents[0].city || 'Paris';
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

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/events')}
      >
        <Text style={styles.backButtonText}>← Retour à la liste</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> Événements du {selectedDate}</Text>

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

                  {/* Distance utilisateur → événement */}
                  {userLocation && ev.latitude && ev.longitude && (
                    <Text style={{ marginTop: 4, fontWeight: '500' }}>
                      📏 {getDistanceFromLatLonInKm(
                        userLocation.latitude,
                        userLocation.longitude,
                        ev.latitude,
                        ev.longitude
                      ).toFixed(2)} km
                    </Text>
                  )}

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
  container: { flex: 1, backgroundColor: '#0D1B2A', padding: 10 },
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
    backgroundColor: '#fffefeff',
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
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dddcdaff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002855',
    textAlign: 'center',
  },
  eventDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  cityText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
  status: {
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#aeaeadff',
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
  backButton: {
    backgroundColor: '#415A77',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
