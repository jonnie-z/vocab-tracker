
export type VocabItem = {
    id: number;
    term: string;
    meaning: string;
    language: string;
    learned: boolean;
};

export type NewVocabInput = {
    term: string;
    meaning: string;
    language: string;
};