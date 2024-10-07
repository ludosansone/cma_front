export interface Instrument {
    id: number;
    nameKey: string; // Clé pour la traduction
    category: string; // Par exemple : "string", "wind", "percussion", etc.
    icon?: string; // URL ou nom de l'icône représentant l'instrument
}
