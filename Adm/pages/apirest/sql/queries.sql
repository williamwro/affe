-- name: ListEmpregadores :many
SELECT * FROM sind.empregador;

-- name: ListEmpregador :many
SELECT * FROM sind.empregador WHERE id = $1 LIMIT 1;

-- name: CreateEmpregador :one
INSERT INTO sind.empregador(
	id, nome, responsavel, telefone, abreviacao, divisao)
	VALUES (?, ?, ?, ?, ?, ?) RETURNING *;

-- name: UpdateEmpregador :exec
UPDATE sind.empregador
	SET id=?, nome=?, responsavel=?, telefone=?, abreviacao=?, divisao=?
	WHERE id=? RETURNING *;

-- name: DeleteEmpregador :exec
DELETE FROM sind.empregador
	WHERE id=?;		