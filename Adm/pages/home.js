$(document).ready(function() {


    var divisao = sessionStorage.getItem("divisao");
    var divisao_nome = sessionStorage.getItem("divisao_nome");
    var descricao = sessionStorage.getItem("descricao");
    if(divisao === "1"){//casserv
        $("#img_makecard").attr("src", "");
        $("#img_empresa").attr("src", "../Adm/pages/logo_affe.jpeg");
        $('#rotulo_divisao_makecard').html("Sistema administrativo de cartão convenio");

    }else if(divisao === "2"){//sindicato
        $("#img_makecard").attr("src", "");
        $("#img_empresa").hide() //.attr("src", "../Adm/pages/logo_sind.png").width('128px').height('128px');
        $('#rotulo_divisao_makecard').html("");
    }
    $('#rotulo_divisao').html(divisao_nome)
    $('#rotulo_descricao').html(descricao)

})