import { Service } from '@/types';

export const services: Service[] = [
  {
    id: '1',
    title: 'Consultation Générale',
    description: 'Consultations médicales complètes avec nos médecins généralistes qualifiés pour un suivi personnalisé de votre santé.',
    icon: 'Stethoscope',
    features: ['Bilan de santé complet', 'Prescription médicale', 'Suivi personnalisé', 'Certificats médicaux'],
  },
  {
    id: '2',
    title: 'Téléconsultation',
    description: "Consultez un médecin depuis chez vous par vidéo. Rapide, sécurisé et accessible partout en Haïti.",
    icon: 'Video',
    features: ['Disponible 7j/7', 'Vidéo HD sécurisée', 'Ordonnance en ligne', 'Tarifs accessibles'],
  },
  {
    id: '3',
    title: 'Pharmacie en Ligne',
    description: 'Commandez vos médicaments et produits de santé en ligne. Livraison rapide et sécurisée à domicile.',
    icon: 'Pill',
    features: ['Produits certifiés', 'Livraison express', 'Conseils pharmaceutiques', 'Prix compétitifs'],
  },
  {
    id: '4',
    title: 'Spécialistes',
    description: 'Accédez à un réseau de médecins spécialistes : cardiologie, dermatologie, pédiatrie et plus encore.',
    icon: 'UserCheck',
    features: ['Large réseau de spécialistes', 'Prise de rendez-vous rapide', 'Dossier médical partagé', 'Second avis médical'],
  },
  {
    id: '5',
    title: 'Analyses & Examens',
    description: 'Réservez vos analyses de laboratoire et examens médicaux. Résultats disponibles en ligne rapidement.',
    icon: 'FlaskConical',
    features: ['Résultats en 24-48h', 'Laboratoires agréés', 'Résultats en ligne', 'Interprétation médicale'],
  },
  {
    id: '6',
    title: 'Urgences & Premiers Secours',
    description: "Service d'orientation vers les urgences les plus proches. Conseils de premiers secours disponibles 24h/24.",
    icon: 'Heart',
    features: ['Disponible 24h/24', 'Géolocalisation urgences', 'Conseils immédiats', "Numéros d'urgence"],
  },
];
