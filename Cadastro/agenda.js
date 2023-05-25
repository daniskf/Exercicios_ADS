let express = require('express');
// Componente necessário para capturar dados do formulario
// Para instalá-lo, execute no console: npm install body-parser

let bodyparser = require('body-parser')
let app = express()

// funções do body-parser para capturar dados do formulário
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}))

// Inicia a API
app.listen(3000,function(){
        console.log('Serviço iniciado na porta 3000.');
})

//Função que retorna o formulário para o usuário.
app.get('/',function(req,res){
        res.sendFile(__dirname + '/cadastro.html');
})

//configurando o acesso ao banco de dados MySql
var mysql = require('mysql');

//Função que trata a submissão do formulário teste.
app.post('/', function(req,res){
    var con = mysql.createConnection({
        host: "localhost",
        user:"api_agenda",
        password: "agenda",
        database: "agenda"
    });

// abertura da conexão com o banco de dados
con.connect(function(err){
    if(err)throw err;
    console.log("Conectamos com o banco de dados.");
    var sql = "INSERT INTO contatos(nome, endereco, telefone) "+
    "VALUES ('"+req.body.nome+"', '"+req.body.endereco+"', "+req.body.telefone+");";

    //submissão do comando ao banco de dados
    con.query(sql, function(err, result){
        if(err)throw err;
        console.log("1 contato gravado."+sql);
    });
    //Fechamento da conexão com o banco de dados
    con.end(function(err){
        if(err)throw err;
    })
})
})
//função q exibe o conteudo da tabela agenda
app.get('/agenda', function(req, res) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "api_agenda",
        password: "agenda",
        database: "agenda"
    });
    con.connect(function(err){
        if (err) throw err;
        console.log("conectando ao banco de dados.");
        //Vamos criar o comando de consulta
        var sql = "SELECT nome, endereco,telefone FROM contatos";
        //Submissão da consulta ao banco de dados 
        con.query(sql,function (err, result){
            if (err) throw err;
            // criação de uma página dinâmica com uma tabela 
            res.writeHead(200, {"Content-Type": "text/html"});
            var tabela = "<table border=\"1\"><tr><th>Nome</th>" +
                "<th>Endere&ccedilo</th><th>Telefone</th></td>";
                for(i=0; i < result.length; i++){
                    tabela += "<tr><td>" + result[i].nome +
                        "</td><td>" + result[i].endereco +
                        "</td><td>" + result[i].telefone +
                        "</td></tr>";
                }
                //envio da tabela para a página
                res.write(tabela);
                res.end();
        });
        //fechamento da conexão
        con.end(function(err){
            if(err) throw err;
        });
    });
});