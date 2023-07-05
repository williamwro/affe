CREATE TABLE IF NOT EXISTS sind.empregador
(
    id bigint NOT NULL DEFAULT,
    nome character varying(50) COLLATE pg_catalog."default",
    responsavel character varying(50) COLLATE pg_catalog."default",
    telefone character varying(30) COLLATE pg_catalog."default",
    abreviacao character varying(50) COLLATE pg_catalog."default",
    divisao integer,
    CONSTRAINT empregador_pkey PRIMARY KEY (id),
    CONSTRAINT divisao_fk FOREIGN KEY (divisao)
        REFERENCES sind.divisao (id_divisao) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS sind.divisao
(
    nome character varying(50) COLLATE pg_catalog."default" NOT NULL,
    cidade character varying(50) COLLATE pg_catalog."default" NOT NULL,
    id_divisao bigint NOT NULL DEFAULT nextval('sind.divisao_id_divisao_seq'::regclass),
    descricao character varying COLLATE pg_catalog."default",
    CONSTRAINT divisao_pkey PRIMARY KEY (id_divisao)
)