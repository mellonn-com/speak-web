package handler

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/ably/ably-go/ably"

	_ "github.com/go-sql-driver/mysql"
)

type Message struct {
	ID    int
	Title string
}

func TestDB(w http.ResponseWriter, r *http.Request) {
	// Creating connection to DB
	dbUsername := os.Getenv("PLANETSCALE_USERNAME")
	dbPassword := os.Getenv("PLANETSCALE_PASSWORD")
	dataSourceName := dbUsername + ":" + dbPassword + "@tcp(aws.connect.psdb.cloud)/speak?tls=true&interpolateParams=true"

	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		log.Printf("Error while connecting to db: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Printf("Error while pinging db: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}

	// GET
	if r.Method == "GET" {
		rows, err := db.Query("SELECT * FROM Test;")
		if err != nil {
			log.Printf("Error while getting rows: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
		defer rows.Close()

		var messages []Message
		for rows.Next() {
			var message Message
			if err := rows.Scan(&message.ID, &message.Title); err != nil {
				log.Printf("Error while getting columns: %v", err)
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
			}
			log.Printf("Found message with id: %d and title: %v", message.ID, message.Title)
			messages = append(messages, message)
		}
		log.Printf("Found %v message(s)", len(messages))

		resp := make(map[string][]Message)
		resp["messages"] = messages
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Printf("Error while marshalling response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		} else {
			log.Printf("Responded with: %v", string(jsonResp[:]))
			w.WriteHeader(http.StatusCreated)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResp)
		}
	}

	// POST
	if r.Method == "POST" {
		var message Message
		err := json.NewDecoder(r.Body).Decode(&message)
		if err != nil {
			log.Printf("Error while getting message: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
		}

		_, err = db.Exec("INSERT INTO Test (title) VALUES(?);", message.Title)
		if err != nil {
			log.Printf("Error while inserting message in db: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}

		resp := make(map[string]interface{})
		resp["message"] = "Test was created!"
		resp["object"] = message
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Printf("Error while marshalling response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		} else {
			log.Printf("Responded with: %v", string(jsonResp[:]))
			sendMessage("created", string(jsonResp[:]))
			w.WriteHeader(http.StatusCreated)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResp)
		}
	}

	if r.Method == "PUT" {
		var message Message
		err := json.NewDecoder(r.Body).Decode(&message)
		if err != nil {
			log.Printf("Error while getting message: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
		}

		_, err = db.Exec("UPDATE Test SET title = ? WHERE id = ?;", message.Title, message.ID)
		if err != nil {
			log.Printf("Error while inserting message in db: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}

		resp := make(map[string]interface{})
		resp["message"] = "Test was updated!"
		resp["object"] = message
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Printf("Error while marshalling response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		} else {
			log.Printf("Responded with: %v", string(jsonResp)[:])
			sendMessage("updated", string(jsonResp[:]))
			w.WriteHeader(http.StatusCreated)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResp)
		}
	}
}

func sendMessage(topic string, message string) {
	// Creating connection to ably
	ablyKey := os.Getenv("ABLY_API_KEY")
	client, err := ably.NewRealtime(ably.WithKey(ablyKey), ably.WithAutoConnect(false))
	if err != nil {
		log.Printf("Error while connecting to ably: %v", err)
	}
	client.Connection.OnAll(func(change ably.ConnectionStateChange) {
		log.Printf("Connection event: %s state=%s reason=%s\n", change.Event, change.Current, change.Reason)
	})
	client.Connection.On(ably.ConnectionEventClosed, func(change ably.ConnectionStateChange) {
		log.Println("Closed the connection to Ably.")
	})
	client.Connect()

	channel := client.Channels.Get("test")
	err = channel.Publish(context.Background(), topic, message)
	if err != nil {
		log.Printf("Error while sending message: %v", err)
	}
	client.Close()
}
