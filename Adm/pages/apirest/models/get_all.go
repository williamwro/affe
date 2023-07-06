package models

import (
	"context"

	"makecard.com.br/db"

	dbsql "makecard.com.br/dbsql/db"
)

func GetAll() (empregadores []dbsql.Empregador, err error) {
	conn, err := db.OpenConnection()
	if err != nil {
		return
	}
	defer conn.Close()

	conn.Exec(`set search_path='sind'`)

	dt := dbsql.New(conn)

	ctx := context.Background()

	empregadores, err := dt.ListEmpregadores(ctx)

	return
}
