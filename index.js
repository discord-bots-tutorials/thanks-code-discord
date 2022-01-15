const Discord = require("discord.js");
const {Permissions, Intents, Client} = require("discord.js");
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES]})
const express = require("express");
const app = express();
const db = require("quick.db");

const cooldown = new Set();

const prefix = "-"

app.get("/", (req, res) => {
    res.sendStatus(200);
})

client.on("ready", () => {
console.log("logged into: ", client.user.tag)
})

//الحين بنبدا بالاكواد حقت امر الشكر

client.on("messageCreate", message => {
    const user = message.mentions.users.first();
    if(!message.guild || message.author.bot)return;
    if(message.content.startsWith(prefix + "thx")) {
        if(!user)return message.reply("Please mention someone !")
        if(user.bot)return message.reply("You can't thank bots !")
        if(message.author.id === user.id)return message.reply("You can't thank yourself !");
        if(cooldown.has(message.author.id))return message.reply("You are in cooldown for 6 hours !")
        db.add(`thx_${user.id}_${message.guild.id}`, 1)
        let thanksCount = db.fetch(`thx_${user.id}_${message.guild.id}`)
        cooldown.add(message.author.id)
        setTimeout(function() {
            cooldown.delete(message.author.id)
        }, 21600000)
        message.channel.send(`${message.author} has thanked ${user}\n\n${user} you have now ${thanksCount}`)
    }
})

client.on("messageCreate", message => {
    const user = message.mentions.users.first() || message.author;
    if(!message.guild || message.author.bot)return;
    if(message.content.startsWith(prefix + "thanks")) {
        if(user.bot)return message.reply("Bots do not have thanks !")
        let thanksCount = db.fetch(`thx_${user.id}_${message.guild.id}`)
        if(thanksCount === null)return message.reply(`${user} you don't have any thanks !`)
        message.channel.send(`${user} you have ${thanksCount} thanks !`)
    }
})

app.listen(3000);

client.login("")//لاتسوي قافط غيرت التوكن الي بالمقطع :)
