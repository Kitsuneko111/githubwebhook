const Discord = require("discord.js")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const sqlite3 = require("sqlite3").verbose()
const Github = require("github-api")
let gh = new Github()

let db = new sqlite3.Database("./dbs/repos.db", err => {
  if(err) console.log(err)
  else console.log('success')
})
//db.run("drop table if exists repos")
db.run("create table if not exists repos(repo integer, guild varchar(20), channel varchar(20), id integer primary key autoincrement)")

app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.sendStatus(200)
})
app.post('/', (req, res) => {
  const embed = new Discord.RichEmbed()
  let body = req.body
  let head = req.headers
  //console.log(head)
  //console.log(body)
  switch(head["x-github-event"]){
    case "push":
      embed.setTitle("New Push")
      embed.addField("Branch", body.ref.split(/\/+/)[body.ref.split(/\/+/).length-1])
      embed.addField("Summary", body.commits[0].message)
      break
    case "create":
      embed.setTitle("New Branch")
      embed.addField("Branch name", body.ref)
      break
    case "delete":
      embed.setTitle("Deleted Branch")
      embed.addField("Branch name", body.ref)
      break
    case "issues":
      console.log("received")
      embed.setTitle(`${body.action.charAt(0).toUpperCase() + body.action.slice(1)} Issue`)
      embed.addField("Issue Name", body.issue.title)
      embed.setURL(body.issue.html_url)
      embed.addField("Issue", body.issue.body)
      break
    case "issue_comment":
      embed.setTitle(`New Comment On ${body.issue.title}`)
      embed.setURL(body.issue.html_url)
      embed.addField("Comment", body.comment.body)
      break
    case "pull_request":
      embed.setTitle(`${body.action.charAt(0).toUpperCase()+body.action.slice(1)} Pull Request`)
      embed.addField("Pull Title", body.pull_request.title)
      embed.addField("Pull Number", body.number)
      embed.setURL(body.pull_request.html_url)

  }
  //embed.setTitle(`new ${head['x-github-event']}`)
  embed.setColor("#4099D3")
  embed.setAuthor(body.sender.login, body.sender.avatar_url, body.sender.html_url)
  //embed.addField("Name", body.ref.split(/\/+/)[body.ref.split(/\/+/).length-1])
  //embed.addField("Description", body.commits[0] ? body.commits[0].message : body.description)
  embed.setFooter(`Automated Github Webhook | RepoID ${body.repository.id}`)
  embed.setTimestamp(Date.now())
  console.log(body.repository)
  db.all("select * from repos where repo = ?", [body.repository.id], (err, rows) => {
    if(err) console.log(err)
    rows.forEach(row => {
      client.guilds.find(val => val.id == row.guild).channels.find(val => val.id == row.channel).send(embed)
    })
  })
  //client.guilds.find(val => val.id == "710887242100375664").channels.find(val => val.id == "758267909440667668").send(embed)
  res.sendStatus(200)
})

const client = new Discord.Client()

client.on("ready", ()=>{
  console.log("ready")
})

client.on("message", message => {
  content = message.content
  if(content.toLowerCase().startsWith('g!repo add')){ 
  args = content.split(/ +/)
  args.shift()
  args.shift()
  if(args.length != 2) return message.reply("g!repo add <repo id> <channel mention>")
  db.run("insert into repos values(?, ?, ?, null)", [parseInt(args[0]), message.guild.id, message.mentions.channels.first().id])
  message.reply("added")}
  if(content.toLowerCase().startsWith("g!repo get")){
    args = content.split(/ +/)
    args.shift()
    args.shift()
    repoName = args[0].split(/\//)
    //console.log(repoName)
    repo = gh.getRepo(repoName[0], repoName[1])
    repo.getDetails((err, res, req) => {
      console.log(res)
    message.channel.send(`ID is ${res.id}`)
    })
  }
  if(content.toLowerCase().startsWith("g!repo rem")){
    args = content.split(/ +/)
    args.shift()
    args.shift()
    if(args.length != 2) return message.reply("g!repo rem <id> <channel mention>")
    db.run("delete from repos where repo = ? and channel = ?", [args[0], message.mentions.channels.first().id])
    message.reply("removed")
  }
})

client.login(process.env.TOKEN)
app.listen(3000)