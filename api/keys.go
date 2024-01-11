package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func Keys(w http.ResponseWriter, r *http.Request) {
	key := os.Getenv("ABLY_API_KEY")
	resp := make(map[string]string)
	resp["key"] = key
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Printf("Error while marshalling response: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	} else {
		log.Printf("Responded with: %v", jsonResp)
		w.WriteHeader(http.StatusCreated)
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResp)
	}
}
