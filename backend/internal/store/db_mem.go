package store

import (
	"sync"

	"github.com/google/uuid"
)

type InMemoryStore struct {
	vocabItems []VocabItem

	mu sync.Mutex
}

func NewInMemoryStore() *InMemoryStore {
	inMemoryStore := &InMemoryStore{
		vocabItems: newVocabItems(),
	}

	return inMemoryStore
}

func newVocabItems() []VocabItem {
	items := []VocabItem{
		{Id: uuid.New(), Term: "Baum", Meaning: "tree", Language: "German", Learned: false},
		{Id: uuid.New(), Term: "chien", Meaning: "dog", Language: "French", Learned: true},
		{Id: uuid.New(), Term: "casa", Meaning: "house", Language: "Spanish", Learned: false},
	}

	return items
}

func (i *InMemoryStore) List(query string) ([]VocabItem, error) {
	return nil, nil
}

func (i *InMemoryStore) Create(body string) (VocabItem, error) {
	return VocabItem{}, nil
}

func (i *InMemoryStore) Update(id int, body string) (VocabItem, error) {
	return VocabItem{}, nil
}

func (i *InMemoryStore) Delete(id int) error {
	return nil
}
