package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/jonnie-z/vocab-tracker/internal/httpapi"
	"github.com/jonnie-z/vocab-tracker/internal/store"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: '%v'", err)
	}

	storeTypeFlag := flag.String("s", "InMemoryStore", "-s: define the repository to use")
	flag.Parse()
	var storeType store.StoreType

	if *storeTypeFlag == "" {
		storeType = store.StoreInMemory
	} else {
		switch *storeTypeFlag {
		case "InMemoryStore":
			storeType = store.StoreInMemory
		}
	}
	
	app := newApp(storeType)
	api := &httpapi.API{App: app}
	mux := api.Routes()

	fmt.Println("Starting Server on", app.Port)
	if err := http.ListenAndServe(app.Port, mux); err != nil {
		log.Fatalf("Error occurred when starting server: '%v'", err)
	}
}