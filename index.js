const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database');
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

//DataBase
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados!')
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.set('view engine','ejs')
app.use(express.static('public'))
//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());


app.get('/', (req, res) =>{
  Pergunta.findAll({raw: true, order:[
    ['id','DESC']
  ]}).then(perguntas =>{
    res.render("index", {perguntas})
  })
})

app.get('/perguntar', (req, res) =>{
  res.render("perguntar")
})

app.get('/pergunta/:id', (req, res) =>{
  const {id} = req.params
  Pergunta.findOne({
    where: {id},
    
  }).then(pergunta =>{
    if(pergunta != undefined){



      Resposta.findAll({
        where: {perguntaID : id},
        order:[
          ['id','DESC']
        ]
      }).then(respostas =>{
        res.render("pergunta", {pergunta, respostas})
      })



      
    }
    else{
      res.redirect("/")
    }
  });

})

app.post('/salvarpergunta', (req, res) =>{
  const {titulo, descricao} = req.body
  Pergunta.create({
    titulo,
    descricao
  }).then(() =>{
    res.redirect("/")
  })
  // res.send("Fomulário recebido")
})

app.post('/responder', (req, res) =>{
  const {corpo, perguntaID} = req.body
  Resposta.create({
    corpo,
    perguntaID
  }).then(() =>{
    res.redirect("/pergunta/"+perguntaID)
  })
  // res.send("Fomulário recebido")
})


app.listen(8080, (err) =>{
  
  if(err){
    console.log(err)
  }
  else{
    console.log("Server rodando")
  }
})