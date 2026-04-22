package store

import (
	"errors"
	"fmt"
	"slices"
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
	result, err := getVocabItems(i, "")
	if err != nil {
		return nil, err
	}

	return result, nil
}

func getVocabItems(i *InMemoryStore, query string) ([]VocabItem, error) {
	if query != "" {
		return nil, errors.New("not implemented yet")
	}

	i.mu.Lock()
	defer i.mu.Unlock()
	result := slices.Clone(i.vocabItems)

	return result, nil
}

func (i *InMemoryStore) Create(vocabItem *VocabItem) {
	createVocabItem(i, vocabItem)
}

func createVocabItem(i *InMemoryStore, vocabItem *VocabItem) {
	i.mu.Lock()
	defer i.mu.Unlock()

	vocabItem.Id = uuid.New()

	i.vocabItems = append(i.vocabItems, *vocabItem)
}

func (i *InMemoryStore) Update(id uuid.UUID, vocabItem *VocabItem) error {
	i.mu.Lock()
	defer i.mu.Unlock()

	itemIdx := getVocabItemIdx(i.vocabItems, id)
	if itemIdx == -1 {
		return fmt.Errorf("Vocab Item with id '%v' not found!", id)
	}

	i.vocabItems[itemIdx] = *vocabItem

	return nil
}

func (i *InMemoryStore) Delete(id uuid.UUID) error {
	i.mu.Lock()
	defer i.mu.Unlock()

	itemIdx := getVocabItemIdx(i.vocabItems, id)
	if itemIdx == -1 {
		return fmt.Errorf("Vocab Item with id '%v' not found!", id)
	}

	i.vocabItems = append(i.vocabItems[:itemIdx], i.vocabItems[itemIdx+1:]...)

	return nil
}
