package store

import "github.com/google/uuid"

func getVocabItemIdx(vocabItems []VocabItem, id uuid.UUID) int {
	for i, vocabItem := range vocabItems {
		if vocabItem.Id == id {
			return i
		}
	}

	return -1
}
