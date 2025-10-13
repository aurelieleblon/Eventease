// app/styles/theme.ts
import { StyleSheet } from 'react-native';

export const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // fond clair
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A1F44', // bleu foncé
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#0A1F44',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#0A1F44',
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#1ABC9C', // bleu turquoise
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF', // texte blanc
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0A1F44', // accent bleu foncé
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  cardTitle: {
    color: '#0A1F44', // bleu foncé
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#4B4B4B', // gris foncé
    marginTop: 6,
    fontSize: 15,
  },
  cardDate: {
    color: '#0A1F44', 
    marginTop: 5,
    fontWeight: '600',
  },
  participatedBadge: {
    color: '#1ABC9C', // bleu turquoise pour participé
    marginTop: 5,
    fontWeight: 'bold',
  },
  notParticipatedBadge: {
    color: '#E74C3C', // rouge doux pour non participé
    marginTop: 5,
    fontWeight: 'bold',
  },
});



