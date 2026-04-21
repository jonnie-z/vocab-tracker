package store

import "github.com/google/uuid"

type VocabItem struct {
	Id       uuid.UUID   `json:"id"`
	Term     string `json:"term"`
	Meaning  string `json:"meaning"`
	Language string `json:"language"`
	Learned  bool   `json:"learned"`
}
