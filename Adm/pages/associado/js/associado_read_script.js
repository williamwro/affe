var usuario_global;
var usuario_cod;
var divisao;
var divisao_nome;
var table_associados;
var C_cep = $("#C_cep");
var cidadex;
var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth()+1;
var curr_year = d.getFullYear();
var controle = false;
var card1;
var card2;
var card3;
var card4;
var card5;
var card6;

$(document).ready(function(){

    //$("#operation").val("Add");
    $('#C_telres').mask('(99)9999-9999');
    $('#C_telcom').mask('(99)9999-9999');
    $('#C_cel').mask('(99)99999-9999');
    C_cep.mask("99.999-999");
    $('#C_cpf').mask('999.999.999-99');
    $('#C_nascimento').mask('99/99/9999');
    $('#C_datadesfiliacao').mask('99/99/9999');
    $("#C_salario").maskMoney({
        prefix: "",
        decimal: ",",
        thousands: "."
    });
    $("#C_limite").maskMoney({
        prefix: "",
        decimal: ",",
        thousands: "."
    });

    d = new Date();
    curr_date = d.getDate();
    curr_month = d.getMonth()+1;
    curr_year = d.getFullYear();
    curr_date = pad(curr_date,2)
    curr_month = pad(curr_month,2)

    divisao = sessionStorage.getItem("divisao");
    divisao_nome = sessionStorage.getItem("divisao_nome");
    card1 = sessionStorage.getItem("card1");
    card2 = sessionStorage.getItem("card2");
    card3 = sessionStorage.getItem("card3");
    card4 = sessionStorage.getItem("card4");
    card5 = sessionStorage.getItem("card5");
    card6 = sessionStorage.getItem("card6");


    $('#divisao').val(divisao);
    var detailRows = [];
    //$("#frmSenha")[0].reset();
    $.getJSON( "pages/associado/associado_situacao.php", function( data ) {
        $.each(data, function (index, value) {
            $('#C_situacao').append('<option value="' + value.codigo + '">' + value.nome + '</option>');
        });
    });
    $.getJSON( "pages/associado/associado_tipos.php", function( data ) {
        $.each(data, function (index, value) {
            $('#C_tipo').append('<option value="' + value.id_tipo_associado + '">' + value.nome + '</option>');
        });
    });
    $.getJSON( "pages/associado/associado_empregador.php", { "divisaox": divisao }, function( data ) {
        $.each(data, function (index, value) {
            $('#C_empregador').append('<option value="' + value.id + '">' + value.nome + '</option>');
        });
    });
    $.getJSON( "pages/associado/associado_funcao.php", function( data ) {
        $.each(data, function (index, value) {
            $('#C_funcao').append('<option value="' + value.id + '">' + value.nome + '</option>');
        });
    });
    var naodefinico = "Não definido"
    $.getJSON( "pages/associado/secretarias.php", function( data ) {
        $('#C_secretaria').append('<option value="' + 0 + '">' + naodefinico + '</option>');
        $.each(data, function (index, value) {
            $('#C_secretaria').append('<option value="' + value.id_secretaria + '">' + value.nome_secretaria + '</option>');
        });
    });
    $('#tabela_producao tfoot th').each( function () {
        var title = $(this).text();
        if(title !== ""){
            $(this).html( '<input type="text" class="small" placeholder="Busca '+title+'" />' );
        }
    } );
    debugger;
    usuario_global = sessionStorage.getItem("usuario_global");
    usuario_cod = sessionStorage.getItem("usuario_cod");
    if(divisao === "1"){ //CASSERV
        filtra_associado(0,divisao);// filtra todos
    }else if(divisao === "2"){ //SINDICATO
        filtra_associado_sind(0,divisao);// filtra todos
        $('#campo_codigo_casserv').hide();
        $('#campo_C_limite').hide();
    }

    $('#tabela_producao tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table_associados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
    // Add event listener for opening and closing details
    $('#tabela_producao tbody').on( 'click', 'tr td.details-control', function () {
  
        var tr = $(this).closest('tr');
        var row = table_associados.row( tr );
        var idx = $.inArray( tr.attr('id'), detailRows );

        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();

            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        }
        else {
            tr.addClass( 'details' );
            row.child( format( row.data() ) ).show();

            // Add to the 'open' array
            if ( idx === -1 ) {
                detailRows.push( tr.attr('id') );
            }
        }
    });
    function limpa_formulario_cep() {
        // Limpa valores do formulário de cep.
        $("#C_endereco").val("");
        $("#C_bairro").val("");
        $("#C_cidade").val("");
        $("#C_uf").val("");
    }
    //Quando o campo cep perde o foco.
    $("#C_cep").blur(function() {

        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep !== "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                //$("#C_endereco").val("");
                //$("#C_bairro").val("");
                //$("#C_cidade").val("");
                //$("#C_uf").val("");
                //$("#ibge").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("#C_uf").val(dados.uf).change();
                        $("#C_endereco").val(dados.logradouro);
                        $("#C_bairro").val(dados.bairro);
                        $("#C_cidade").val(dados.localidade);
                        validar();
                        //$("#ibge").val(dados.ibge);
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.
                        //limpa_formulario_cep();
                        alert("CEP não encontrado.");
                    }
                });
            } //end if.
            else {
                //cep é inválido.
                //limpa_formulario_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            //limpa_formulario_cep();
        }
    });
    $.getJSON('pages/associado/estados_cidades.json', function (data) {
        var items = [];
        var options = '<option value="">escolha um estado</option>';
        $.each(data, function (key, val) {
            options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
        });
        $("#C_uf").html(options);
        $('#C_uf').val($('#C_uf option').eq(11).val());

        $("#C_uf").change(function () {

            var options_cidades = '';
            var str = "";

            $("#C_uf option:selected").each(function () {
                str += $(this).text();
            });
            options_cidades = '<option value="">escolha a cidade</option>';
          
            $.each(data, function (key, val) {
                if(val.sigla === str) {
                    $.each(val.cidades, function (key_city, val_city) {
                        options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                    });
                }
            });
            $("#C_cidade").html(options_cidades);
        }).change();
    });
    $.getJSON( "../Adm/pages/conta/meses_conta.php",{ "origem": "ultimo_mes" }, function( data ) {
        $('#C_ultimo_mes').append('<option value="todos">---</option>');
     
        $.each(data, function (index, value) {
            if (value.abreviacao !== undefined){
                $('#C_ultimo_mes').append('<option value="' + value.abreviacao + '">' + value.abreviacao + '</option>');
            }
        });
    });
});
$("#C_nome").keypress(function(event) {
    var character = String.fromCharCode(event.keyCode);
    return isValid(character);
});
function isValid(str) {
    return !/[~`!@#$%\^&*()+=\-\[\]\\'´.;,/{}|\\":<>\?]/g.test(str);
}
$('#C_matricula').on('keypress', function (event) {
    var regex = new RegExp("^[0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
$(document).on('click','.update',function () {
   
    var cod_associado = $(this).attr("id");
    var tdobj = $(this).closest('tr').find('td');
    var empregador = table_associados.row($(this).parents('tr')).data()["id_empregador"];

    $("#rotulo_associado").html("Alterando");
    $.ajax({
        url: "pages/associado/associado_exibe.php",
        method: "POST",
        data: {cod_associado : cod_associado, empregador: empregador},
        dataType: "json",
        success:function (data) {

            $.fn.modal.Constructor.prototype.enforceFocus = function() {};
            $("#ModalEditaAssociado").modal("show");
           
            $("#C_nome").val(data.nome);
            $("#C_endereco").val(data.endereco);
            if(data.data_filiacao){
                $("#C_datacadastro").val(data.data_filiacao);
            }else{
                $("#C_datacadastro").val(data.data_filiacao);
            }
            $("#C_complemento").val(data.complemento);
            $("#C_bairro").val(data.bairro);
            $("#C_numero").val(data.numero);
            $("#C_cpf").val(data.cpf);
            $("#C_rg").val(data.rg);
            $('[name=C_uf] option').filter(function() {
                return ($(this).text() === data.uf);
            }).prop('selected', true);
            $("#C_uf").val(data.uf).change();
            cidadex = data.cidade;
            cidadex = ucFirstAllWords(cidadex);
            $('[name=C_cidade] option').filter(function() {
                return ($(this).text() === cidadex);
            }).prop('selected', true);
            C_cep.val(data.cep);
            $("#C_telres").val(data.telres);
            $("#C_telcom").val(data.telcom);
            $("#C_cel").val(data.cel);
            $("#C_nascimento").val(data.nascimento);
            $("#C_salario").val(numeroParaMoeda(data.salario));
            $("#C_limite").val(numeroParaMoeda(data.limite));
            $("#C_limite_hidden").val(numeroParaMoeda(data.limite));
            $("#C_situacao").val(data.id_situacao);
            $("#C_situacao_original").val(data.id_situacao);
            $("#C_tipo").val(data.tipo);
            $("#C_tipo_original").val(data.tipo);
            $("#C_empregador").val(data.empregador);
            $("#C_empregador_original").val(data.empregador);
            $("#C_funcao").val(data.codfuncao);
            $("#C_funcao_original").val(data.codfuncao);
            $("#C_Email").val(data.email);
            $("#C_parcelas_permitidas").val(data.parcelas_permitidas);
            $("#C_datadesfiliacao").val(data.data_desfiliacao);
            $("#C_obs").val(data.obs);
            $("#C_filiado").prop("checked", data.filiado);
            $("#SwitchCelular").prop("checked", data.celwatzap);
            $("#C_tem_cadastro_conta").val(data.tem_cadastro_conta);
            $("#C_secretaria").val(data.id_secretaria);
            $("#C_local").val(data.localizacao);
            //if(data.tem_cadastro_conta === true){
            //    $("#C_matricula").attr('disabled', 'true');
            //}else{
            //    $("#C_matricula").removeAttr('disabled');
            //}
            $("#C_matricula").val(data.codigo);
            $('#C_matricula_original').val(data.codigo);
            $("#C_codcaserv_original").val(data.codigo_isa);
            $("#C_codcaserv").val(data.codigo_isa);
            $("#C_ultimo_mes").val(data.ultimo_mes);
            /*if($("#C_codcaserv").val() === "") {
                $("#C_codcaserv").removeAttr('disabled');
            }else{
                $("#C_codcaserv").attr('disabled', 'true');
            }*/
            $('#operation').val("Update");


            $('#frmassociado').validator('validate');
        }
    });
});
$("#btnInserir").click(function(){
    $("#frmassociado")[0].reset();
    $("#rotulo_associado").html("Cadastrando");
    $("#C_empregador_origem").val(0);
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    $("#ModalEditaAssociado").modal("show");
    $('#operation').val("Add");
    var d = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    var d2 = d.substring(0,10);
    $('#C_datacadastro').val(d2);
    $('#C_uf').val($('#C_uf option').eq(11).val());
    $('#C_cidade').val($('#C_cidade option').eq(835).val());
    $("#C_matricula").removeAttr('disabled');
});
$("#btnSalvar").click(function(event){
   waitingDialog.show('Gravando, aguarde ...');
  
   $("#btnSalvar").attr("disabled", true);
   $('#frmassociado').validator('validate');
   var campo_vazio = validar();
   if (campo_vazio === "validou") {

       if( $('#operation').val() === "Add") {
           $.ajax({
               url: "pages/associado/associado_verifica_repitido.php?divisao="+divisao,
               method: "POST",
               data: $('#frmassociado').serialize()+'&divisao='+divisao,
               dataType: "json",
               async: false,
               success: function (data) {
              
                   if (data.resultado === "nao repitido") {

                       $.ajax({
                           url: "pages/associado/associado_salvar.php",
                           method: "POST",
                           data: $('#frmassociado').serialize()+'&divisao='+divisao+'&usuario_cod='+usuario_cod,
                           success: function (data) {
                               $("#frmassociado")[0].reset();
                               if (data === "atualizado") {
                                   Swal.fire({
                                       title: "Parabens!",
                                       text: "Associado atualizado com sucesso !",
                                       icon: "success",
                                       showConfirmButton: false,
                                       timer: 1500
                                   });
                               } else if (data === "cadastrado") {
                                   Swal.fire({
                                       title: "Parabens!",
                                       text: "Associado cadastrado com sucesso !",
                                       icon: "success",
                                   });
                               } else if (data === "Seu usuario não tem permissão!") {
                                   Swal.fire({
                                       title: "Atenção!",
                                       text: "Seu usuário não tem permissão.",
                                       icon: "error",
                                   });
                               }
                               $("#frmassociado")[0].reset();
                               $("#btnSalvar").attr("disabled", false);
                               waitingDialog.hide();
                               $("#ModalEditaAssociado").modal('hide');
                               table_associados.ajax.reload();
                           }
                       });
                   } else if (data.resultado === "repitido") {
                       BootstrapDialog.show({
                           closable: false,
                           title: 'Atenção',
                           message: 'A matricula : '+$("#C_matricula").val()+' já existe no empregador : '+$( "#C_empregador option:selected" ).text()+'.',
                           buttons: [{
                               cssClass: 'btn-warning',
                               label: 'Ok',
                               action: function (dialogItself) {
                                   dialogItself.close();
                                   $("#C_Senha").focus();
                               }
                           }]
                       });
                       $("#btnSalvar").attr("disabled", false);
                       waitingDialog.hide();
                   }
               }
           });
       }else{
           $.ajax({
               url: "pages/associado/associado_verifica_repitido.php",
               method: "POST",
               data: $('#frmassociado').serialize(),
               dataType: "json",
               success: function (data) {
                   if (data.resultado === "nao repitido") {
                       $.ajax({
                           url: "pages/associado/associado_salvar.php",
                           method: "POST",
                           data: $('#frmassociado').serialize()+'&divisao='+divisao+'&usuario_cod='+usuario_cod,
                           success: function (data) {
                               $("#frmassociado")[0].reset();
                               if (data === "atualizado") {
                                   Swal.fire({
                                       title: "Parabens!",
                                       text: "Associado atualizado com sucesso !",
                                       icon: "success",
                                       timer: 3000
                                   });
                               } else if (data === "cadastrado") {
                                   Swal.fire({
                                       title: "Parabens!",
                                       text: "Associado cadastrado com sucesso !",
                                       icon: "success",
                                   });
                               } else if (data === "Seu usuario não tem permissão!") {

                                   BootstrapDialog.show({
                                       closable: false,
                                       title: 'Atenção',
                                       message: 'Atualização cancelada, seu usuario não tem permissão!',
                                       buttons: [{
                                           cssClass: 'btn-danger',
                                           label: 'Ok',
                                           action: function (dialogItself) {
                                               dialogItself.close();
                                               //$("#C_Senha").focus();
                                           }
                                       }]
                                   });
                               } else {

                                   BootstrapDialog.show({
                                       closable: false,
                                       title: 'Atenção',
                                       message: 'Algum problema ocorreu na atualização, comunique o administrador.',
                                       buttons: [{
                                           cssClass: 'btn-danger',
                                           label: 'Ok',
                                           action: function (dialogItself) {
                                               dialogItself.close();
                                               //$("#C_Senha").focus();
                                           }
                                       }]
                                   });
                               }
                               $("#frmassociado")[0].reset();
                               $("#btnSalvar").attr("disabled", false);
                               waitingDialog.hide();
                               $("#ModalEditaAssociado").modal('hide');
                               table_associados.ajax.reload();
                           },
                           error: function (request, status, erro) {
                               alert("Problema ocorrido: " + status + "\nDescição: " + erro);
                               //Abaixo está listando os header do conteudo que você requisitou, só para confirmar se você setou os header e dataType corretos
                               alert("Informações da requisição: \n" + request.getAllResponseHeaders());
                               $("#btnSalvar").attr("disabled", false);
                               waitingDialog.hide();
                           }
                       });
                   } else if (data.resultado === "repitido") {
                       BootstrapDialog.show({
                           closable: false,
                           title: 'Atenção',
                           message: 'A matricula : '+$("#C_matricula").val()+' já existe no empregador : '+$( "#C_empregador option:selected" ).text()+'.',
                           buttons: [{
                               cssClass: 'btn-warning',
                               label: 'Ok',
                               action: function (dialogItself) {
                                   dialogItself.close();
                                   $("#C_Senha").focus();
                               }
                           }]
                       });
                       $("#btnSalvar").attr("disabled", false);
                       waitingDialog.hide();
                   }
               }
           });
       }
   }else {
       var nome_campo;
       switch (campo_vazio) {
           case 'C_nome':
               nome_campo = "Nome";
               break;
           case 'C_matricula':
               nome_campo = "Matricula";
               break;
           case 'C_endereco':
               nome_campo = "Endereço";
               break;
           case 'C_numero':
               nome_campo = "Numero";
               break;
           case 'C_bairro':
               nome_campo = "Bairro";
               break;
           case 'C_cidade':
               nome_campo = "Cidade";
               break;
           case 'C_uf':
               nome_campo = "uf";
               break;
           case 'C_nascimento':
               nome_campo = "Data de Nascimento";
               break;
           case 'C_salario':
               nome_campo = "Salário";
               break;
           case 'C_limite':
               nome_campo = "Limite";
               break;
       }
       BootstrapDialog.show({
           closable: false,
           title: 'Atenção',
           message: 'O campo ' + nome_campo + ' é obrigatório !!!',
           buttons: [{
               cssClass: 'btn-warning',
               label: 'Ok',
               action: function (dialogItself) {
                   dialogItself.close();
                   $("#" + campo_vazio).focus();
                   $("#btnSalvar").attr("disabled", false);
                   waitingDialog.hide();
               }
           }]
       });
   }
   table_associados.columns.adjust().draw();
});
$('#tabela_producao').on('click', 'tbody .btnsenha', function () {

    var data_row = table_associados.row($(this).closest('tr')).data();
    var cod_associado = data_row.codigo;
    var id_empregador = data_row.id_empregador;
    $("#frmSenha")[0].reset();
    $("#ModalSenha").modal("show");
    $.ajax({
        url: "pages/associado/associado_exibe_usuario.php",
        method: "POST",
        data: {cod_associado: cod_associado, id_empregador: id_empregador},
        dataType: "json",
        success: function (data) {

            $("#cod_associado").val(data.matricula);
            $("#senha_associado").val(data.senha);
            $("#C_Senha").val(data.senha);
            $("#associado_rotulo").html(data.nome);
            $("#existe_senha").val(data.existesenha);
            $("#id_empregador").val(id_empregador);
        }
    })
 });
/*$('#tabela_producao').on('click', 'tbody .btnexcluir', function () {

    var data_row = table_associados.row($(this).closest('tr')).data();
    var cod_associado = data_row.codigo;
    var nome_associado = data_row.nome;
    var empregador = data_row.abreviacao;
    var id_empregador = data_row.id_empregador;
    $.ajax({
        url: "pages/associado/associado_valid_excluir.php",
        method: "POST",
        dataType: "json",
        data: {"cod_associado": cod_associado, "id_empregador": id_empregador},
        success: function (data) {

            if (data.Resultado === "nao existe conta") {
                BootstrapDialog.confirm({
                    message: '<table style="width: 100%;"><tr><th style="text-align: right;padding: 8px;background-color: #dddddd;">MATRICULA:</th><th style="background-color: #dddddd;"><b>' + cod_associado + '</b></th>' +
                        '<tr><th style="text-align: right;padding: 8px;">NOME:</th><th><b>' + nome_associado + '</th>' +
                        '<tr><th style="text-align: right;padding: 8px;background-color: #dddddd;">EMPREGADOR:</th><th style="background-color: #dddddd;"><b>' + empregador + '</th>',
                    title: 'Confirma a exclusão do associado ?',
                    type: BootstrapDialog.TYPE_PRIMARY,
                    closable: true,
                    draggable: true,
                    btnCancelLabel: 'Não',
                    btnOKLabel: 'Sim',
                    btnOKClass: 'btn btn-success',
                    btnCancelClass: 'btn btn-warning',
                    callback: function (result) {
                        if (result) {
                            waitingDialog.show('Excluindo, aguarde ...');
                            $.ajax({
                                url: "pages/associado/associado_excluir.php",
                                method: "POST",
                                dataType: "json",
                                data: {"cod_associado": cod_associado, "id_empregador": id_empregador},
                                success: function (data) {

                                    if (data.Resultado === "excluido") {

                                        //table_associados.row( $button.parents('tr') ).remove().draw();
                                        //alert("Excluido com sucesso");
                                        waitingDialog.hide();
                                        BootstrapDialog.show({
                                            closable: false,
                                            title: 'Atenção',
                                            message: 'Excluído com Sucesso!!!',
                                            buttons: [{
                                                cssClass: 'btn-warning',
                                                label: 'Ok',
                                                action: function (dialogItself) {
                                                    dialogItself.close();
                                                    //$("#C_Senha").focus();
                                                    table_associados.ajax.reload();
                                                }
                                            }]
                                        });
                                    }else{
                                        alert("Não Excluiu");
                                        waitingDialog.hide();
                                    }
                                }
                            });
                        } else {
                            //alert('No');
                        }
                    }
                });
            }else if (data.Resultado === "existe conta") {
                BootstrapDialog.show({
                    closable: false,
                    title: 'Atenção',
                    message: 'Não é possível exluir, existem lançamentos para este associado!',
                    buttons: [{
                        cssClass: 'btn-warning',
                        label: 'Ok',
                        action: function(dialogItself){
                            dialogItself.close();
                            $("#C_Senha").focus();
                        }
                    }]
                });
            }
        }
    });
});*/
$("#btnsalvarsenha").click(function(event){
    var senha = $("#C_Senha").val();
    var confirmasenha = $("#C_Confirma_Senha").val();
    if(senha !== ""){
        if(confirmasenha !== ""){
            if(senha === confirmasenha){
                $.ajax({
                    url:"pages/associado/associado_salvar_senha.php",
                    method: "POST",
                    data: $('#frmSenha').serialize(),
                    success:function (data) {
                        if (data === "senha_fazia"){
                            BootstrapDialog.show({
                                closable: false,
                                title: 'Atenção',
                                message: 'Informe a senha!',
                                buttons: [{
                                    cssClass: 'btn-warning',
                                    label: 'Ok',
                                    action: function(dialogItself){
                                        dialogItself.close();
                                        $("#C_Senha").focus();
                                    }
                                }]
                            });
                        }else if (data === "senha_divergente") {
                            BootstrapDialog.show({
                                closable: false,
                                title: 'Atenção',
                                message: 'Senha e Confirma estão diferentes !',
                                buttons: [{
                                    cssClass: 'btn-warning',
                                    label: 'Ok',
                                    action: function(dialogItself){
                                        dialogItself.close();
                                        $("#C_Senha").focus();
                                    }
                                }]
                            });
                        }else if (data === "atualizado") {
                            Swal.fire({
                                title: "Parabens!",
                                text: "Senha atualizada com sucesso !",
                                icon: "success",
                                timer: 3000
                            });
                            $("#ModalSenha").modal('hide');
                        }else if(data === "cadastrado"){
                            Swal.fire({
                                title: "Parabens!",
                                text: "Senha cadastrada com sucesso !",
                                icon: "success",
                                timer: 3000
                            });
                            $("#ModalSenha").modal('hide');
                        } else if (data === "Seu usuario não tem permissão!") {
                            BootstrapDialog.show({
                                closable: false,
                                title: 'Atenção',
                                message: 'Atualização cancelada, seu usuario não tem permissão!',
                                buttons: [{
                                    cssClass: 'btn-danger',
                                    label: 'Ok',
                                    action: function (dialogItself) {
                                        dialogItself.close();
                                        $("#ModalSenha").modal('hide');
                                    }
                                }]
                            });
                        }
                    }
                })
            }else{
                BootstrapDialog.show({
                    closable: false,
                    title: 'Atenção',
                    message: 'As senha não sao iguais!',
                    buttons: [{
                        cssClass: 'btn-warning',
                        label: 'Ok',
                        action: function(dialogItself){
                            dialogItself.close();
                            $("#C_Senha").focus();
                        }
                    }]
                });
            }
        }else{
            BootstrapDialog.show({
                closable: false,
                title: 'Atenção',
                message: 'Digite a confirmação da senha!!',
                buttons: [{
                    cssClass: 'btn-warning',
                    label: 'Ok',
                    action: function(dialogItself){
                        dialogItself.close();
                        $("#C_Confirma_Senha").focus();
                    }
                }]
            });
        }
    }else{
        BootstrapDialog.show({
            type: [BootstrapDialog.TYPE_DANGER],
            closable: false,
            title: 'Atenção',
            message: 'Digite a senha!!',
            buttons: [{
                cssClass: 'btn-warning',
                label: 'Ok',
                action: function(dialogItself){
                    dialogItself.close();
                    $("#C_Senha").focus();
                }
            }]
        });
    }
});
$(document).on('click','.btnextrato',function () {
    var caminho = "pages/associado_extrato/extrato_associado_read.php";
    var matricula = $(this).attr("id");
    //********pega o dado da segunda coluna com o nome do associado**
    var tdobj = $(this).closest('tr').find('td');
    var nome = tdobj[2].innerHTML;
    //***************************************************************
    //********pega o dado da segunda coluna com o nome do empregador**
    var tdobjemp = $(this).closest('tr').find('td');
    var empregador = tdobjemp[6].innerHTML;
    //***************************************************************

    $.redirect('index.php',{ caminho: caminho, matricula: matricula, nome: nome, empregador: empregador});
});

// Array to track the ids of the details displayed rows



// On each draw, loop over the `detailRows` array and show any child rows
/* table.on( 'draw', function () {
    $.each( detailRows, function ( i, id ) {
        $('#'+id+' td.details-control').trigger( 'click' );
    } );
} );*/
function moedaParaNumero(valor)
{
    return isNaN(valor) === false ? parseFloat(valor) :   parseFloat(valor.replace("R$","").replace(".","").replace(",","."));
}
function numeroParaMoeda(n, c, d, t)
{
    c = isNaN(c = Math.abs(c)) ? 2 : c, d = d === undefined ? "," : d, t = t === undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
function format ( d ) {
     return'<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                '<td>Salario :</td>'+
                '<td>'+d.salario+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Limite  :</td>'+
                '<td>'+d.limite+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Cep     :</td>'+
                '<td>'+d.cep+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>TelRes  :</td>'+
                '<td>'+d.telres+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>TelCom  :</td>'+
                '<td>'+d.telcom+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>CPF  :</td>'+
                '<td>'+d.cpf+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>RG  :</td>'+
                '<td>'+d.rg+'</td>'+
                '</tr>'+
                 '<tr>'+
                 '<td>Complemento  :</td>'+
                 '<td>'+d.complemento+'</td>'+
                 '</tr>'+
           '</table>';

}
function validar(){

    var nome       = $('#C_nome').val();
    var matricula  = $('#C_matricula').val();
    var endereco   = $('#C_endereco').val();
    var numero     = $('#C_numero').val();
    var bairro     = $('#C_bairro').val();
    var cidade     = $('#C_cidade').val();
    var uf         = $('#C_uf').val();
    var nascimento = $('#C_nascimento').val();
    var salario    = $('#C_salario').val();
    var limite     = $('#C_limite').val();
    if (nome === ""){
        return $('#C_nome').attr('name');
    }else if (matricula === "") {
        return $('#C_matricula').attr('name');
    }else if (endereco === "") {
        return $('#C_endereco').attr('name');
    }else if (numero === "") {
        return $('#C_numero').attr('name');
    }else if (bairro === "") {
        return $('#C_bairro').attr('name');
    }else if (cidade === "") {
        return $('#C_cidade').attr('name');
    }else if (uf === "") {
        return $('#C_uf').attr('name');
    }else if (nascimento === "") {
        return $('#C_nascimento').attr('name');
    }else if (salario === "") {
        return $('#C_salario').attr('name');
    }else if (limite === "") {
        return $('#C_limite').attr('name');
    }else{
        return "validou";
    }
}
function ucFirstAllWords( str )
{
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1).toLowerCase();
    }
    return pieces.join(" ");
}
$('#RadioTodos').change(function(){
    cod_situacao = $('#RadioTodos').val();
    filtra_associado(cod_situacao,divisao);
    if(divisao === "1"){ //CASSERV
        filtra_associado(cod_situacao,divisao);// filtra todos
    }else if(divisao === "2"){ //SINDICATO
        filtra_associado_sind(cod_situacao,divisao);// filtra todos
    }
});
$('#RadioFiliados').change(function(){
    cod_situacao = $('#RadioFiliados').val();
    if(divisao === "1"){ //CASSERV
        filtra_associado(cod_situacao,divisao);// filtra todos
    }else if(divisao === "2"){ //SINDICATO
        filtra_associado_sind(cod_situacao,divisao);// filtra todos
    }
});
$('#RadioDesfiliados').change(function(){
    cod_situacao = $('#RadioDesfiliados').val();
    if(divisao === "1"){ //CASSERV
        filtra_associado(cod_situacao,divisao);// filtra todos
    }else if(divisao === "2"){ //SINDICATO
        filtra_associado_sind(cod_situacao,divisao);// filtra todos
    }
});
$('#RadioFalecidos').change(function(){
    cod_situacao = $('#RadioFalecidos').val();
    if(divisao === "1"){ //CASSERV
        filtra_associado(cod_situacao,divisao);// filtra todos
    }else if(divisao === "2"){ //SINDICATO
        filtra_associado_sind(cod_situacao,divisao);// filtra todos
    }
});

function filtra_associado(codigo,divisao){
    table_associados = $('#tabela_producao').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "todos"]],
        "destroy": true,
        "processing": false,
        "serverSide": false,
        "paging": true,
        "deferRender": true,
        "fixedColumns": true,
        "ajax": {
            "url": 'pages/associado/associado_read2.php',
            "method": 'POST',
            "data":  { 'usuario_global': usuario_global, 'divisao': divisao, 'id_situacao': codigo, 'card1': card1, 'card2': card2, 'card3': card3, 'card4': card4, 'card5': card5, 'card6': card6  },
            "dataType": 'json'
        },
        "order": [[ 2, "asc" ]],
        "columns": [
            {
                "class":"details-control",
                "orderable":false,
                "data":null,
                "defaultContent": ""
            },
            { "data": "codigo" },
            { "data": "nome" },
            { "data": "endereco" },
            { "data": "bairro" },
            { "data": "nascimento" },
            { "data": "abreviacao" },
            { "data": "id_empregador" },
            { "data": "codigo_isa" },
            { "data": "nome_situacao" },
            { "data": "botao" },
            { "data": "botaosenha" },
            { "data": "botaoexcluir" }
        ],
        "createdRow": function(row, aData, dataIndex ) {
          
            if (aData['nome_situacao'] === "ATIVO") {
                $(row).addClass("green");
            } else if (aData['nome_situacao'] === "DESFILIADO") {
                $(row).addClass("red");
            } else if (aData['nome_situacao'] === "FALECIDO") {
                $(row).addClass("black");
            }
        },
        "columnDefs": [
            {
                "targets": [ 7 ],
                "visible": false,
                "searchable": true,
            },
        ],
        language: {
            decimal: ",",
            thousands: ".",
            zeroRecords: "Não ha dados",
            emptyTable: "Não ha dados.",
            infoEmpty: 'Zero registros',
            paginate: {
                next: "Próximo",
                previous: "Anterior",
                first: "Primeiro",
                last: "Último"
            },
            search: "Pesquisar",
            info: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            infoFiltered: "(Filtrados de _MAX_ registros)",
            infoPostFix: "",
            lengthMenu: "_MENU_ resultados por página"
        },
        "pagingType": "full_numbers"
    });
}
function filtra_associado_sind(codigo,divisao){
    table_associados = $('#tabela_producao').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "todos"]],
        "destroy": true,
        "processing": false,
        "serverSide": false,
        "paging": true,
        "deferRender": true,
        "fixedColumns": true,
        "ajax": {
            "url": 'pages/associado/associado_read2.php',
            "method": 'POST',
            "data":  { 'usuario_global': usuario_global, 'divisao': divisao, 'id_situacao': codigo, 'id_situacao': codigo, 'card1': card1, 'card2': card2, 'card3': card3, 'card4': card4, 'card5': card5, 'card6': card6  },
            "dataType": 'json'
        },
        "order": [[ 2, "asc" ]],
        "columns": [
            {
                "class":"details-control",
                "orderable":false,
                "data":null,
                "defaultContent": ""
            },
            { "data": "codigo" },
            { "data": "nome" },
            { "data": "endereco" },
            { "data": "bairro" },
            { "data": "nascimento" },
            { "data": "abreviacao" },
            { "data": "id_empregador" },
            { "data": "codigo_isa" },
            { "data": "nome_situacao" },
            { "data": "botao" },
            { "data": "botaosenha" },
            { "data": "botaoexcluir" }
        ],
        "createdRow": function(row, aData, dataIndex ) {
   
            if (aData['nome_situacao'] === "ATIVO") {
                $(row).addClass("green");
            } else if (aData['nome_situacao'] === "DESFILIADO") {
                $(row).addClass("red");
            } else if (aData['nome_situacao'] === "FALECIDO") {
                $(row).addClass("black");
            }
        },
        "columnDefs": [
            {
                "targets": [ 7 ],
                "visible": false,
                "searchable": true,
            },
            {
                "targets": [ 8 ],
                "visible": false,
                "searchable": true,
            }
        ],

            language: {
                decimal: ",",
                thousands: ".",
                zeroRecords: "Não ha dados",
                emptyTable: "Não ha dados.",
                infoEmpty: 'Zero registros',
                paginate: {
                    next: "Próximo",
                    previous: "Anterior",
                    first: "Primeiro",
                    last: "Último"
                },
                search: "Pesquisar",
                info: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                infoFiltered: "(Filtrados de _MAX_ registros)",
                infoPostFix: "",
                lengthMenu: "_MENU_ resultados por página"
            },
        "pagingType": "full_numbers"
    });
}
$("#C_situacao").change(function () {

    if(controle === false) {
        if($("#C_situacao").val() === "2" || $("#C_situacao").val() === "3"){//desfiliado or falecido
            $("#C_datadesfiliacao").val(curr_date + "/" + curr_month + "/" + curr_year);
            $("#C_filiado").prop("checked", false);

        }else{
            $("#C_datadesfiliacao").val('');
            $("#C_filiado").prop("checked", true);

        }
    }else{
        controle = false;
    }
})
$('#C_filiado').change(function() {

    controle = true;
    if ($(this).is(':checked')) {
        $("#C_datadesfiliacao").val('');
        $("#C_situacao").val('1').change();
        //$("#C_filiado").prop("checked", true);
    } else {
        $("#C_datadesfiliacao").val(curr_date + "/" + curr_month + "/" + curr_year);
        $("#C_situacao").val('2').change();
        //$("#C_filiado").prop("checked", false);
    }
});
function pad (str, max) {
    str = str.toString();
    str = str.length < max ? pad("0" + str, max) : str; // zero à esquerda
    str = str.length > max ? str.substr(0,max) : str; // máximo de caracteres
    return str;
}