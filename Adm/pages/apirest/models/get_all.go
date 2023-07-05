package models

import (
	"log"

	"makecard.com.br/db"
)

func GetAll() (empregadores []Empregador, err error) {
	conn, err := db.OpenConnection()
	if err != nil {
		return
	}
	defer conn.Close()

	err = conn.Ping()
	if err != nil {
		log.Printf("Erro ao conectar o banco de dados", err)
	}

	conn.Exec(`set search_path='sind'`)

	rows, err := conn.Query(`SELECT id, nome, responsavel, telefone, abreviacao, divisao FROM empregador;`)
	if err != nil {
		return
	}

	for rows.Next() {
		var empregador Empregador

		err = rows.Scan(&empregador.ID, &empregador.nome, &empregador.responsavel, &empregador.telefone, &empregador.abreviacao, &empregador.divisao)
		if err != nil {
			continue
		}

		empregadores = append(empregadores, empregador)
	}

	return
}
