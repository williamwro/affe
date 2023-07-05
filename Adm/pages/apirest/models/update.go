package models

import "makecard.com.br/db"

func Update(id int64, empregador Empregador) (int64, error) {
	conn, err := db.OpenConnection()
	if err != nil {
		return 0, err
	}
	defer conn.Close()

	res, err := conn.Exec(`UPDATE sind.empregador
	SET nome=$2, responsavel=$3, telefone=$4, abreviacao=$5, divisao=$6
	WHERE id=$1`, id, empregador.nome, empregador.responsavel, empregador.telefone, empregador.abreviacao, empregador.divisao)
	if err != nil {
		return 0, err
	}

	return res.RowsAffected()

}
