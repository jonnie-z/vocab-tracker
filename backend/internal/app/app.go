package app

import (
	"github.com/google/uuid"
	"github.com/jonnie-z/vocab-tracker/internal/store"
)

type VocabRepository interface {
	List(query string) ([]store.VocabItem, error)
	Create(vocabItem *store.VocabItem)
	Update(id uuid.UUID, vocabItem *store.VocabItem) error
	Delete(id uuid.UUID) error
}

type App struct {
	Store VocabRepository

	Port string
}
