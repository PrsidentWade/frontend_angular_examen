import { User } from "./user";

export interface Projet {
    taches: any;
    id: number;
    nom_project: string;
    description: string;
    owners_id: number;
    created_at?: string;
    updated_at?: string;
    owner?: User;
}
