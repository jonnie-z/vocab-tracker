package app

import "github.com/jonnie-z/vocab-tracker/internal/store"

type VocabRepository interface {
	List(query string) ([]store.VocabItem, error)
	Create(body string) (store.VocabItem, error)
	Update(id int, body string) (store.VocabItem, error)
	Delete(id int) error
}

type App struct {
	Store VocabRepository

	Port string
}