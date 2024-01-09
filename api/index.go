package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	dbUsername := os.Getenv("PLANETSCALE_USERNAME")
	dbPassword := os.Getenv("PLANETSCALE_PASSWORD")
	dataSourceName := dbUsername + ":" + dbPassword + "@tcp(aws.connect.psdb.cloud)/speak?tls=true&interpolateParams=true"

	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		fmt.Printf("failed to connect: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		fmt.Printf("failed to ping: %v", err)
	}

	rows, err := db.Query("SELECT * FROM Test")
	if err != nil {
		fmt.Printf("failed to get rows: %v", err)
	}
	defer rows.Close()

	var result string = "<h1>Connected to the database!</h1>"
	for rows.Next() {
		var title string
		if err := rows.Scan(&title); err != nil {
			fmt.Print(err)
		}

		result += "<br>Row title: " + title
	}

	fmt.Fprintf(w, result)
}
