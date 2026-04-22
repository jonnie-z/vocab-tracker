package httpapi

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/jonnie-z/vocab-tracker/internal/store"
)

func (a *API) getNotesHandler(w http.ResponseWriter, r *http.Request) {
	vocabItems, err := a.App.Store.List("")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Printf("vocabItems: %#v\n", vocabItems)
	if err := json.NewEncoder(w).Encode(vocabItems); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *API) addNoteHandler(w http.ResponseWriter, r *http.Request) {
	var vocabItem store.VocabItem
	if err := json.NewDecoder(r.Body).Decode(&vocabItem); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	a.App.Store.Create(&vocabItem)

	w.Header().Set("Content-Type", "application/json")
	fmt.Printf("vocabItem created: '%#v'\n", vocabItem)
	if err := json.NewEncoder(w).Encode(vocabItem); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *API) updateNoteHandler(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	var vocabItem store.VocabItem
	if err := json.NewDecoder(r.Body).Decode(&vocabItem); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	vocabItem.Id = id

	err = a.App.Store.Update(id, &vocabItem)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Printf("vocabItem updated: '%#v\n", vocabItem)
	if err := json.NewEncoder(w).Encode(vocabItem); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *API) deleteNoteHandler(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = a.App.Store.Delete(id)
	fmt.Printf("vocabItem deleted: '%v'\n", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
