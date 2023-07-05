package models

import "makecard.com.br/db"

func Insert(empregador Empregador) (id int64, err error) {
	conn, err := db.OpenConnection()
	if err != nil {
		return
	}
	defer conn.Close()

	sql := `INSERT INTO sind.empregador(
		    nome, responsavel, telefone, abreviacao, divisao)
		    VALUES($1, $2, $3, $4, $5) RETURNING id`

	err = conn.QueryRow(sql, empregador.nome, empregador.responsavel, empregador.telefone, empregador.abreviacao, empregador.divisao).Scan(&id)

	return
}
