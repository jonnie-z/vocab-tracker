package main

import (
	"os"
	"strings"

	"github.com/jonnie-z/vocab-tracker/internal/app"
	"github.com/jonnie-z/vocab-tracker/internal/store"
)

func env(key, fallback string) string {
	v := os.Getenv(key)

	if v == "" {
		return fallback
	}

	return v
}

func newApp(storeType store.StoreType) *app.App {
	var vocabStore app.VocabRepository
	port := env("PORT", ":8080")

	if !strings.HasPrefix(port, ":") {
		port = ":" + port
	}

	app := &app.App{}
	app.Port = port
	
	switch storeType {
	case store.StoreInMemory:
		vocabStore = store.NewInMemoryStore()
	}

	app.Store = vocabStore

	return app
}