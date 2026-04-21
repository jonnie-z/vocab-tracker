package httpapi

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (a *API) getNotesHandler(w http.ResponseWriter, r *http.Request) {
	vocabItems, err := a.App.Store.List("")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
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

}

func (a *API) updateNoteHandler(w http.ResponseWriter, r *http.Request) {

}

func (a *API) deleteNoteHandler(w http.ResponseWriter, r *http.Request) {

}