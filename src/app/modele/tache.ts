export interface Tache {
    id: number;
    titre: string;
    description: string;
    etat: 'a_faire' | 'en_cours' | 'termine'; // ou simplement string si c’est dynamique
    deadline: string;
    project_id: number;
    assigned_to: number;
    priority: 'haute' | 'moyenne' | 'basse';
    created_at: string;
    updated_at: string;
    project?: { id: number, nom_project: string };
    assignee?: { id: number, name: string };
}