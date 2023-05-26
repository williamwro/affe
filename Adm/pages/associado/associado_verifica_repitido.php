<?PHP
require '../../php/banco.php';
$pdo = Banco::conectar_postgres();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$_empregador_original   = isset($_POST['C_empregador_original']) ? (int)$_POST['C_empregador_original'] : 0;
if ($_empregador_original == 0){
    $_matricula         = isset($_POST['C_matricula']) ? $_POST['C_matricula'] : "";
}else{
    $_matricula         = isset($_POST['C_matricula_original']) ? $_POST['C_matricula_original'] : "";
}
$_empregador_novo       = isset($_POST['C_empregador']) ? (int)$_POST['C_empregador'] : 0;
if($_empregador_novo <> $_empregador_original){
    $_empregador = $_empregador_novo;
}else{
    $_empregador = $_empregador_original;
}
$divisao = $_POST['divisao'];
$pdo = Banco::conectar_postgres();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$msg_grava_cad = "nao repitido";
$stmt = new stdClass();

try{
    $select = $pdo ->query("SELECT codigo, nome, empregador 
                                          FROM sind.associado 
                                         WHERE codigo = '".$_POST['C_matricula']."' 
                                           AND empregador = ".$_empregador_novo."
                                           AND id_divisao = ".$divisao);
    $select->execute();
    if($_empregador_original == 0) {
        //cadastrando
        foreach ($select as $row) {
            $msg_grava_cad = "repitido";
        }
    }elseif($_empregador_novo <> $_empregador_original || $_POST['C_matricula_original'] !== $_POST['C_matricula']) {
        //alterando
        foreach ($select as $row) {
            $msg_grava_cad = "repitido";
        }
        if($msg_grava_cad !== "repitido" ){
            // ATUALIZA associado
            $sql = "";
            $sql = "UPDATE sind.associado SET ";
            $sql .= "codigo = :associado, ";
            $sql .= "empregador = :empregador ";
            $sql .= "WHERE codigo = :associado_original AND empregador = :empregador_original AND id_divisao = :id_divisao";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':associado_original', $_POST['C_matricula_original'], PDO::PARAM_STR);
            $stmt->bindParam(':associado', $_POST['C_matricula'], PDO::PARAM_STR);
            $stmt->bindParam(':empregador', $_POST['C_empregador'], PDO::PARAM_INT);
            $stmt->bindParam(':empregador_original', $_POST['C_empregador_original'], PDO::PARAM_INT);
            $stmt->bindParam(':id_divisao', $divisao, PDO::PARAM_INT);

            $stmt->execute();
        }
    }
    $arr = array('resultado' =>$msg_grava_cad);
    $someArray = array_map("utf8_encode",$arr);
    echo json_encode($someArray);
} catch (PDOException $erro) {
   //echo "Não foi possivel inserir os dados no banco: " . $erro->getMessage();
}
