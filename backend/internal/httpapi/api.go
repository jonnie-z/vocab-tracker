package httpapi

import (
	"fmt"
	"net/http"

	"github.com/jonnie-z/vocab-tracker/internal/app"
)

type API struct {
	App *app.App
}

func (a API) Routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "HOLA COMO ESTAIS")
	})
	mux.HandleFunc("GET /api/vocab", a.getNotesHandler)
	mux.HandleFunc("POST /api/vocab", a.addNoteHandler)
	mux.HandleFunc("PUT /api/vocab/{id}", a.updateNoteHandler)
	mux.HandleFunc("DELETE /api/vocab/{id}", a.deleteNoteHandler)

	return mux
}

