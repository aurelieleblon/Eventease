import { StyleSheet } from 'react-native';

export const theme = StyleSheet.create({
  // --- Container général ---
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A', // bleu nuit profond
    padding: 20,
  },

  // --- Titres ---
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E1DD', // texte clair chic
    marginBottom: 20,
    textAlign: 'center',
  },

  // --- Input ---
  input: {
    borderWidth: 1,
    borderColor: '#415A77', // bleu-gris
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: '#0D1B2A', // texte sombre
    backgroundColor: '#E5E5E5', // gris clair
  },

  // --- Boutons ---
  button: {
    backgroundColor: '#415A77', // bleu-gris
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  buttonText: {
    color: '#E0E1DD', // texte clair
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },

  // --- Cards ---
  card: {
    backgroundColor: '#E5E5E5', // gris clair
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D1B2A',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardDescription: {
    color: '#333333',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
  },
  cardDate: {
    color: '#0D1B2A',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },

  // --- Badges ---
  participatedBadge: {
    color: '#4CAF50',
    marginTop: 5,
    fontWeight: '500',
  },
  notParticipatedBadge: {
    color: '#E53935',
    marginTop: 5,
    fontWeight: '500',
  },

  // --- Messages / Logout / etc ---
  message: {
    textAlign: 'center',
    color: '#4CAF50',
    fontWeight: '600',
    marginVertical: 8,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  logoutText: {
    color: '#333333',
    fontWeight: '600',
  },
});



