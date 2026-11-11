// Colombine CV Studio — auteure et propriétaire : Curtis CAFAFA. Données de démonstration.
export type Job = {
  id: string; title: string; company: string; city: string; contract: string;
  source: "France Travail" | "Emploi public" | "La Bonne Alternance";
  salary?: string; posted: string; lat: number; lng: number; remote?: boolean; summary: string;
};

export const JOBS: Job[] = [
  { id: "j1", title: "Cheffe de projet digital", company: "Studio Lumen", city: "Nantes (44)", contract: "CDI", source: "France Travail", salary: "42–48 k€", posted: "il y a 2 j", lat: 47.218, lng: -1.553, remote: true, summary: "Pilotage de projets web et mobiles, coordination design/dev, suivi des KPI." },
  { id: "j2", title: "Assistant(e) administratif(ive)", company: "Mairie de Paris", city: "Paris (75)", contract: "CDD", source: "Emploi public", salary: "24–27 k€", posted: "il y a 1 j", lat: 48.8566, lng: 2.3522, summary: "Accueil, gestion du courrier, suivi des dossiers et des agendas." },
  { id: "j3", title: "Développeur React / TypeScript", company: "Nova Systems", city: "Lyon (69)", contract: "CDI", source: "France Travail", salary: "45–55 k€", posted: "il y a 3 j", lat: 45.764, lng: 4.8357, remote: true, summary: "Développement d'interfaces modernes, tests, revue de code." },
  { id: "j4", title: "Alternance — Chargé(e) de communication", company: "Maison Verte", city: "Rennes (35)", contract: "Alternance", source: "La Bonne Alternance", posted: "aujourd'hui", lat: 48.1173, lng: -1.6778, summary: "Réseaux sociaux, newsletter, événements, création de contenus." },
  { id: "j5", title: "Technicien(ne) support informatique", company: "Helios IT", city: "Bordeaux (33)", contract: "Intérim", source: "France Travail", salary: "2 100 € / mois", posted: "il y a 5 j", lat: 44.8378, lng: -0.5792, summary: "Support N1/N2, gestion de parc, déploiement de postes." },
  { id: "j6", title: "Gestionnaire RH", company: "Groupe Atlas", city: "Lille (59)", contract: "CDI", source: "France Travail", salary: "35–40 k€", posted: "il y a 4 j", lat: 50.6292, lng: 3.0573, summary: "Administration du personnel, paie, recrutement." },
  { id: "j7", title: "Chargé(e) d'accueil", company: "Région Occitanie", city: "Toulouse (31)", contract: "CDD", source: "Emploi public", posted: "il y a 6 j", lat: 43.6047, lng: 1.4442, summary: "Accueil physique et téléphonique des usagers." },
  { id: "j8", title: "Data analyst junior", company: "Kairos", city: "Marseille (13)", contract: "CDI", source: "France Travail", salary: "38 k€", posted: "il y a 2 j", lat: 43.2965, lng: 5.3698, summary: "Tableaux de bord, SQL, analyse des parcours clients." },
];

export type AppStatus = "todo" | "applied" | "interview" | "refused";
export const STATUSES: { id: AppStatus; label: string; tone: string }[] = [
  { id: "todo", label: "À postuler", tone: "primary" },
  { id: "applied", label: "Postulé", tone: "info" },
  { id: "interview", label: "Entretien", tone: "warning" },
  { id: "refused", label: "Refusé", tone: "danger" },
];

export const DOCUMENTS = [
  { id: "d1", kind: "CV", name: "CV H. Nicolas", template: "Botanique Émeraude", updated: "il y a 2 h", score: 76 },
  { id: "d2", kind: "CV", name: "CV Kelly Otto", template: "L'Orfèvre Crépusculaire", updated: "hier", score: 64 },
  { id: "d3", kind: "Lettre", name: "Lettre — Studio Lumen", template: "Classique Raffiné", updated: "il y a 3 j" },
  { id: "d4", kind: "CV", name: "CV Curtis CAFAFA", template: "Colombine", updated: "il y a 1 sem.", score: 88 },
  { id: "d5", kind: "Lettre", name: "Lettre — Nova Systems", template: "Modern Corporate", updated: "il y a 2 sem." },
];

export const COMPANIES = [
  { name: "Studio Lumen", sector: "Agence digitale", city: "Nantes", offers: 12, size: "60 pers." },
  { name: "Nova Systems", sector: "Éditeur logiciel", city: "Lyon", offers: 8, size: "250 pers." },
  { name: "Groupe Atlas", sector: "Services RH", city: "Lille", offers: 21, size: "1 200 pers." },
  { name: "Helios IT", sector: "Infogérance", city: "Bordeaux", offers: 15, size: "400 pers." },
  { name: "Kairos", sector: "Data & conseil", city: "Marseille", offers: 6, size: "90 pers." },
  { name: "Maison Verte", sector: "E-commerce", city: "Rennes", offers: 4, size: "120 pers." },
];

export const QUOTAS = [
  { label: "CV", used: 4, max: 5 },
  { label: "Lettres", used: 2, max: 5 },
  { label: "Requêtes IA", used: 18, max: 30 },
];
