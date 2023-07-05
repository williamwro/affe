package models

type Empregador struct {
	ID          int64 `json:"id"`
	nome        string
	responsavel string
	telefone    string
	abreviacao  string
	divisao     int64
}
