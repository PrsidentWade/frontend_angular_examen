import { Projet } from "./projet";
import { Tache } from "./tache";

export interface StatisticsResponse {
    status: boolean;
    data: {
        users_count: number;
        projet_count: number;
        taks_count: number;
        Project_recent: Projet[];
        Taks_recent: Tache[];
    };
}