# githubwebhook
A Bot created to pull basic information from github repositories
Setup:
invite the bot to your server: https://discord.com/api/oauth2/authorize?client_id=758256337926225930&permissions=604105792&scope=bot
go onto github
go to the repository you want to watch, then go to settings
create a new webhook and select the endpoints you want to watch
add https://githubwebhook.timemaster111.repl.co as the payload URL
change the payload type to application/JSON
create the webhook
now back on discord use the following commands:
g!repo get <user/name> (repo must be public for this to work) for the ID
g!repo add <id> <channel mention>
g!repo remove <id> <channel mention>
and you're done!

implemented endpoints:
pushes
branch creation
branch deletes
issue actions
issue comments
pull requests
