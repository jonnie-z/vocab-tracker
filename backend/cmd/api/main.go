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
	
	handler := withCORS(mux)

	fmt.Println("Starting Server on", app.Port)
	if err := http.ListenAndServe(app.Port, handler); err != nil {
		log.Fatalf("Error occurred when starting server: '%v'", err)
	}
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}