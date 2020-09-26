# GitHub Webhook
A bot created to pull basic information from GitHub repositories and send them to Discord


### How to Setup?
1) Invite the bot to your server with [this link](https://discord.com/api/oauth2/authorize?client_id=758256337926225930&permissions=604105792&scope=bot)

2) On GitHub, go to the repository you want to watch 
3) Go to settings and create a new webhook 
4) Select the endpoints you want to watch
5) Add https://githubwebhook.timemaster111.repl.co as the payload URL (change the payload type to *application/JSON*)
6) Create the webhook

You can now go back to Discord and use the following commands:

`g!repo get <user/repo>` 

> **Note:** The linked repository must be public for this to work

`g!repo add <ID> <#channel>`

`g!repo remove <ID> <#channel>`
  
  
And you're done! 

### Implemented Endpoints
✔ Pushes

✔ Branch Creation & Deletion

✔ Issue Actions & Comments

✔ Pull Requests (PR)

