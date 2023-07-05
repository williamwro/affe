package models

import "makecard.com.br/db"

func Get(id int64) (empregador Empregador, err error) {
	conn, err := db.OpenConnection()
	if err != nil {
		return
	}
	defer conn.Close()

	row := conn.QueryRow(`SELET * FROM sind.empregador WHERE id=$1`, id)

	err = row.Scan(&empregador.ID, &empregador.nome, &empregador.responsavel, &empregador.telefone, &empregador.abreviacao, &empregador.divisao)

	return
}
