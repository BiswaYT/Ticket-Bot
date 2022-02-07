const keepAlive = require("./server.js");
  const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: 'everyone'
})
require("dotenv").config()
require('discord-reply');
const { Database } = require("quickmongo");
const db = new Database(process.env.Mongo)
const randomstring = require("randomstring");
const disbut = require('discord-buttons');
require('discord-buttons')(client);
const { MessageMenu, MessageMenuOption } = require('discord-buttons');
const config = require(`./config.json`)
const prefix = config.prefix;

async function channelLog(embed) {
  if (!config.log_channel_id) return;
  let ch = await client.channels.cache.get(!config.log_channel_id) ||  message.guild.channels.cache.find(channel => channel.name.match("log"));
  if (!ch) return console.log(`Pls fill config.json`)
  ch.send(embed)
}

client.on('ready', async () => {
  await console.clear()
  channelLog(`> The **Bot** is connecting to discord API`)
  console.log(`Made by Tejas Lamba$1924 and Hashirama Senju#4222`)
  console.log(`Credits | Visa2Code| Devil | Hashirama Senju |`)
  console.log(`Thank you for using the code. When using the code make sure to mention us`)
  client.user.setActivity(config.status.name, { type: config.status.type.toUpperCase(), url: "https://twitch.tv/SmallCadaver" })
});
client.on("message", async(message) =>{
  if (message.author.bot || !message.guild) return;
  let args = message.content.toLowerCase().split(" ");
  let command = args.shift()
  if (command == prefix + `help`) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Bot commands list`)
      .setDescription(`> \`${prefix}send\` - Send a message to open tickets
> \`${prefix}add\` - Adds a member to a specific ticket
> \`${prefix}remove\` - Removes a member to a specific ticket.
> \`${prefix}delete\` - Delete a specific ticket
> \`${prefix}close\` - Close a specific ticket
> \`${prefix}open\` - Open a specific ticket
> \`${prefix}rename\` - Rename a ticket
>\`${prefix}setchannels\` - set Category 

> \`${prefix}setowner\` - set owner 
> \`${prefix}setchannels\` - set channels relating to ticket log and category
> \`${prefix}setstaff\` - set staff roles`)
      .setTimestamp()
      .setColor(0x5865F2)
    

       
       message.channel.send(embed)
  }
  if (command == prefix + `add`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`Mention a member of its ID`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          ATTACH_FILES: true,
          READ_MESSAGE_HISTORY: true,
        }).then(() => {
          message.lineReply({ embed: { description: `${member} has been successfully added to ${channel}`, color: 0x5865F2 } });
          let log_embed1 = new Discord.MessageEmbed()
            .setTitle(`A person has been added to a ticket`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`Added Person`, member.user)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed1)
        });
      }
      catch (e) {
        return message.channel.send(`An error occurred, please try again!`);
      }
    }
  }
  if (command == prefix + `remove`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`Mention a member of its ID`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: false,
        }).then(() => {
           let log_embed = new Discord.MessageEmbed()
            .setTitle(`People removed to ticket`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`person added`, member.user)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
          message.lineReply({ embed: { description: `Successfully delete ${member} from ${channel}`, color: 0x5865F2 } });
        });
      }
      catch (e) {
        return message.channel.send(`An error occurred, please try again!`);
      }
    }
  }
  if (command == prefix + 'delete') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      message.lineReply({ embed: { description: `Your order is executed after 5 seconds, and it will be closed`, color: 0x5865F2 } })
      setTimeout(async () => {
        let log_embed2 = new Discord.MessageEmbed()
            .setTitle(`Ticket Deleted`)
            .addField(`Ticket number`, `${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
            .addField(`Ticket by`,`<@!${await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by}>`)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed2)
          channel.delete()
      }, 5000)
    }
  }

  
  if (command == prefix + 'close') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.lineReply({ embed: { description: `Your order is executed after 5 seconds, and it will be closed`, color: 0x5865F2 } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Ticket has been closed by <@!${message.author.id}>`, color: `YELLOW` } })
          let type = 'member'
          await Promise.all(channel.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
          channel.setName(`closed-${(await db.get(`ticket_${channel.id}_${message.guild.id}`))}`)
          let log_embed3 = new Discord.MessageEmbed()
            .setTitle(`Ticket closed`)
            .addField(
  `Ticket` `<#${channel.id}>`
      )
              .addField(`Ticket close by ` `<@!${message.author.id}>`)
             
            .setTimestamp()
            .setColor(`YELLOW`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed3)
        } catch (e) {
          return message.channel.send(`An error occurred, please try again!`);
        }
      },21000)
    }
  }

  if (command == prefix + 'open') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.lineReply({ embed: { description: `Your order is executed after 5 seconds`, color: 0x5865F2 } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Ticket opened by <@!${message.author.id}>`, color: `GREEN` } })
          let meember = client.users.cache.get(await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by);
          channel.updateOverwrite(meember, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite((await db.get(`Staff_${message.guild.id}.Admin`)), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite((await db.get(`Staff_${message.guild.id}.Moder`)), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.setName(`ticket-${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
          let log_embed4 = new Discord.MessageEmbed()
            .setTitle(`Ticket has reopened`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed4)
        } catch (e) {
          return message.channel.send(`An error occurred, please try again!`);
        }
      }, 1000)
    }
  }
  if (command == prefix + 'rename' || command == prefix + 'setname') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let args = message.content.split(' ').slice(1).join(' ');
      if (!args) return message.lineReply({ embed: { description: `Please select the name you want for the ticket`, color: 0x5865F2 } })
      channel.setName(args)
      message.delete()
      let log_embed5 = new Discord.MessageEmbed()
        .setTitle(`Ticket name change`)
        .addField(`New name`, args)
        .addField(`Ticket`, `<#${channel.id}>`)
        .addField(`by`, `<@!${message.author.id}>`)
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed5)
    }
  }
  
  if (command == prefix + 'setstaff'){
    console.log(args)
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    if (args.length != 2) return message.lineReply({ embed: { description: `Please provide an Admin role id, *then* a Mod role id with this command! `, color: 0x5865F2 } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Please mention an Admin role (or iD) first, *then* a Mod role (or iD) with this command! `, color: 0x5865F2 } })
    const Admin = message.guild.roles.cache.get(args[0]);
    const Moder = message.guild.roles.cache.get(args[1]);
    await db.set(`Staff_${message.guild.id}.Admin`, Admin.id)
    await db.set(`Staff_${message.guild.id}.Moder`, Moder.id)
    message.react("✅")
  }
  
  if (command == prefix + 'setowner'){
    console.log(args)
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    if (args.length != 2) return message.lineReply({ embed: { description: `Please provide an co owner role id, *then* a coowner id with this command! `, color: 0x5865F2 } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Please mention an owner role (or iD) first, *then* a co owner role (or iD) with this command! `, color: 0x5865F2 } })
    const owner = message.guild.roles.cache.get(args[0]);
    const coowner = message.guild.roles.cache.get(args[1]);
    await db.set(`Staff_${message.guild.id}.owner`, owner.id)
    await db.set(`Staff_${message.guild.id}.coowner`, coowner.id)
    message.react("✅")
  }
  
  if (command == prefix + 'setchannels'){
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    if (args.length != 2) return message.lineReply({ embed: { description: `Please mention a channelid, *then* a categoryid with this command! `, color: 0x5865F2 } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Please mention an Log Channel (or iD), *then* a Category (or iD) with this command! `, color: 0x5865F2 } })
    const txt = message.guild.channels.cache.get(args[0]);
    const cat = message.guild.channels.cache.get(args[1]);
    if (txt.type !== "text") return message.channel.send("The first input should be a text channel");
    if (cat.type !== "category") return message.channel.send("The second input should be a text category");
    await db.set(`Channels_${message.guild.id}.Log`, txt.id)
    await db.set(`Channels_${message.guild.id}.Cat`, cat.id)
    message.react("✅")
  }
  
  if (command == prefix + 'setcat'){
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    if (args.length != 2) return message.lineReply({ embed: { description: `Please mention a channelid, *then* a categoryid with this command! `, color: 0x5865F2 } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Please mention an Log Channel (or iD), *then* a Category (or iD) with this command! `, color: 0x5865F2 } })
    const txt = message.guild.channels.cache.get(args[0]);
    const cat = message.guild.channels.cache.get(args[1]);
    if (cat.type !== "category") return message.channel.send("The first input should be a text category");
    if (cat.type !== "category") return message.channel.send("The second input should be a text category");
    await db.set(`Channels_${message.guild.id}.sorce`, cat.id)
    await db.set(`Channels_${message.guild.id}.custom`, cat.id)
    message.react("✅")
  }
  
  if (command == prefix + 'send' || command == prefix + 'ticket') {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    const sfats = await db.get(`Staff_${message.guild.id}`)
    const sfas = await db.get(`Channels_${message.guild.id}`)
    if (!sfats || sfats === null) return message.lineReply({ embed: { description: `This server needs to setup their staff roles first! \`${prefix}setstaff\``, color: 0x5865F2 } })
    if (!sfas || sfas === null) return message.lineReply({ embed: { description: `This server needs to set up their ticket channels first! \`${prefix}setchannels\``, color: 0x5865F2 } })
    let idd = randomstring.generate({ length: 20 })
    let args = message.content.split(' ').slice(1).join(' ');
    if (!args) args = `Tickets`
    let button1 = new MessageMenuOption()
    .setLabel('I need help  with my bot ')
    .setEmoji('889701910171488316')
    .setValue("men")
    .setDescription('Get help for  your bot ')
    let button2 = new MessageMenuOption()
    .setLabel('I need general  help')
    .setEmoji('❓')
    .setValue("op")
    .setDescription('get help for anything of  ani Development')
    
    let button3 = new MessageMenuOption()
    .setLabel('Apply as a staff member')
    .setEmoji('👨‍💼')
    .setValue("Help")
    .setDescription('apply as a staf member ')  
    
    let button6 = new MessageMenuOption()
    .setLabel('partner your server ')
    .setEmoji('890449051647098930')
    .setValue("shop2")
    .setDescription('partner your server ')  
    
    let button4 = new MessageMenuOption()
    .setLabel('custom code')
    .setEmoji('890449051647098930')
    .setValue("shop1")
    .setDescription('if you want a custom bot/sorce code ')  
    
    let button5 = new MessageMenuOption()
    .setLabel('buy bot source code ')
    .setEmoji('890451058307002399')
    .setValue("shop")
    .setDescription(' buy source code of bots ')  

       
    
    
    let select = new MessageMenu()
    .setID(idd)
    .setPlaceholder('Create A ticket!')
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(button1,button2, button3,button4,button5,button6)
    let embed = new Discord.MessageEmbed()
      .setTitle("Create a Ticket / Application / Partnership")
      .addFields(
        {
    name: "If you want help with this ",
          
 value : "<a:right:889893349702635571>Bot , you want to apply , partner ship or want to oder a custom bot then create a ticket "  
        },
   
)
.setImage("https://media.discordapp.net/attachments/871964152623681566/889852257414303794/20210912_081114.jpg")
        
        .setColor(0x5865F2)
      .setFooter(message.guild.name, message.guild.iconURL())
 let but1 = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🔒`)
          .setLabel(`Close`)
          .setID(idd)
 let but2 = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🤚`)
          .setLabel(`claim`)
          .setID(idd)
 let but3 = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`📝`)
          .setLabel(`Transcript `)
          .setID(idd)


    let msg = await message.channel.send(embed,select,but1,but2,but3).then(async msg => {
      msg.pin()
      let log_embed6 = new Discord.MessageEmbed()
        .setTitle(`A message has been sent to open new tickets`)
        .addField(`Channel`, `<#${message.channel.id}>`)
        .addField(`by`, `<@!` + message.author.id + `>`)
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed6)
      await db.set(`tickets_${idd}_${message.guild.id}`, {
        reason: args,
        msgID: msg.id,
        id: idd,
        options: [button1,  button3],
        guildName: message.guild.name,
        guildAvatar: message.guild.iconURL(),
        channelID: message.channel.id
      })
    })
  }
})


client.on('clickMenu', async (button) => {
  console.log(button.value)
  if (await db.get(`tickets_${button.id}_${button.message.guild.id}`)) {
    await button.reply.send(`Your ticket is being processed. Please wait `, true)
    await db.math(`counts_${button.message.id}_${button.message.guild.id}`, `+`, 1)
    let count = await db.get(`counts_${button.message.id}_${button.message.guild.id}`)
    let channel;
    await button.clicker.fetch();
    if (button.values[0] === "men") { // Admins +
      button.guild.channels.create(`ticket-${count}`, {
        permissionOverwrites: [
          {
            id: button.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: (await db.get(`Staff_${button.message.guild.id}.owner`)),
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
          },
          {
            id: (await db.get(`Staff_${button.message.guild.id}.coowner`)),
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
          },
          {
            id: button.clicker.user.id,
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
          },
        ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
      }).then(async channel => {
        channel = channel
        await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
      
        await button.reply.edit(`
  **Your ticket has been successfully opened** <#${channel.id}>`, true)
            let log_embed7 = new Discord.MessageEmbed()
              .setTitle(`New ticket opened`)
              .addField(`Ticket`, `<#${channel.id}>`)
              .addField(`Ticket by`, `<@!${button.clicker.user.id}>`)
              .addField(`Ticket number`, count)
              .setTimestamp()
              .setColor(`GREEN`)
            channelLog(log_embed7)
        const embedticket = new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Specialised Support")
          .setFooter(`Ticket opened at`)
          .setColor(0x5865F2)
          .setDescription(`Support will be with you soon.\n
  To close this ticket, interact with 🔒`)
        let idd = randomstring.generate({ length: 25 })
        let bu1tton = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🔒`)
          .setLabel(`Close`)
          .setID(idd)
         let bu2tton = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🤚`)
          .setLabel(`Close`)
          .setID(idd)
       
        channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton })
          channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
          msg.pin()
        })
        })
      }  
    
   

          
          if (button.values[0] === "shop2") { // Admins +
      button.guild.channels.create(`ticket-${count}`, {
        permissionOverwrites: [
          {
            id: button.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
          },
          {
            id: button.clicker.user.id,
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
          },
        ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
      }).then(async channel => {
        channel = channel
        await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
      
        await button.reply.edit(`
  **Your ticket has been successfully opened** <#${channel.id}>`, true)
            let log_embed8 = new Discord.MessageEmbed()
              .setTitle(`New ticket opened`)
              .addField(`Ticket`, `<#${channel.id}>`)
              .addField(`Ticket by`, `<@!${button.clicker.user.id}>`)
              .addField(`Ticket number`, count)
              .setTimestamp()
              .setColor(`GREEN`)
            channelLog(lreserved8)
        const embedticket = new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Specialised Support")
          .setFooter(`Ticket opened at`)
          .setColor(0x5865F2)
          .setDescription(`Support will be with you soon.\n
  To close this ticket, interact with 🔒`)
        let idd = randomstring.generate({ length: 25 })
       let bu1tton = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🔒`)
          .setLabel(`Close`)
          .setID(idd)
        channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
          msg.pin()
        })
        })
      }
    
if (button.values[0] === "shop1") { // Admins +
      button.guild.channels.create(`ticket-${count}`, {
        permissionOverwrites: [
          {
            id: button.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
          },
          {
            id: button.clicker.user.id,
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
          },
        ], parent: (await db.get(`Channels_${button.message.guild.id}.custom`)), position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
      }).then(async channel => {
        channel = channel
        await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
      
        await button.reply.edit(`
  **Your ticket has been successfully opened** <#${channel.id}>`, true)
            let log_embed9 = new Discord.MessageEmbed()
              .setTitle(`New ticket opened`)
              .addField(`Ticket`, `<#${channel.id}>`)
              .addField(`Ticket by`, `<@!${button.clicker.user.id}>`)
              .addField(`Ticket number`, count)
              .setTimestamp()
              .setColor(`GREEN`)
            channelLog(log_embed9)
        const embedticket = new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Specialised Support")
          .setFooter(`Ticket opened at`)
          .setColor(0x5865F2)
          .setDescription(`Pls wait Owner and Co owner help you soon <a:right:889893349702635571>Tell how much you can spend on it 
<a:right:889893349702635571> Tell bot Name , Prefix, avatar 
If no one reply you then you can create a other ticket 
<a:right:889893349702635571> Do not expect instant help 
<a:right:889893349702635571> Timing 
Monday- 3pm to 9pm
Tuesday- 3pm to 9pm
Wednesday- 3pm to 9pm
Thursday- 3pm to 9pm 
Saturday- 7am to 9pm  
Sunday- 7am to 9pm
`)
        let idd = randomstring.generate({ length: 25 })
        let bu1tton = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🔒`)
          .setLabel(`Close`)
          .setID(idd)
        channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
          msg.pin()
        })
        })
      }
    
if (button.values[0] === "shop") { // Admins +
      button.guild.channels.create(`ticket-${count}`, {
        permissionOverwrites: [
          {
            id: button.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
          },
          {
            id: button.clicker.user.id,
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
          },
        ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
      }).then(async channel => {
        channel = channel
        await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
      
        await button.reply.edit(`
  **Your ticket has been successfully opened** <#${channel.id}>`, true)
            let log_embed10 = new Discord.MessageEmbed()
              .setTitle(`New ticket opened`)
              .addField(`Ticket`, `<#${channel.id}>`)
              .addField(`Ticket by`, `<@!${button.clicker.user.id}>`)
              .addField(`Ticket number`, count)
              .setTimestamp()
              .setColor(`GREEN`)
            channelLog(log_embed10)
        const embedticket = new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Specialised Support")
          .setFooter(`Ticket opened at`)
          .setColor(0x5865F2)
          .setDescription(`Pls wait Owner and Co owner help you soon <a:right:889893349702635571>Tell how much you can spend on it 
<a:right:889893349702635571> Tell bot Name , Prefix, avatar 
If no one reply you then you can create a other ticket 
<a:right:889893349702635571> Do not expect instant help 
<a:right:889893349702635571> Timing 
Monday- 3pm to 9pm
Tuesday- 3pm to 9pm
Wednesday- 3pm to 9pm
Thursday- 3pm to 9pm 
Saturday- 7am to 9pm  
Sunday- 7am to 9pm
`)
        let idd = randomstring.generate({ length: 25 })
        let bu1tton = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🔒`)
          .setLabel(`Close`)
          .setID(idd)
        channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
          msg.pin()
        })
        })
      }
    
    if (button.values[0] === "help") { // Admins +
      button.guild.channels.create(`ticket-${count}`, {
        permissionOverwrites: [
          {
            id: button.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
          },
          {
            id: button.clicker.user.id,
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
          },
        ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
      }).then(async channel => {
        channel = channel
        await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
      
        await button.reply.edit(`
  **Your ticket has been successfully opened** <#${channel.id}>`, true)
            let log_embed11 = new Discord.MessageEmbed()
              .setTitle(`New ticket opened`)
              .addField(`Ticket`, `<#${channel.id}>`)
              .addField(`Ticket by`, `<@!${button.clicker.user.id}>`)
              .addField(`Ticket number`, count)
              .setTimestamp()
              .setColor(`GREEN`)
            channelLog(log_embed11)
        const embedticket = new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Custum Bot ticket")
          .setFooter(`Ticket opened at`)
          .setColor(0x5865F2)
          .setDescription(`Pls wait Owner and Co owner help you soon <a:right:889893349702635571>Tell how much you can spend on it 
<a:right:889893349702635571> Tell bot Name , Prefix, avatar 
If no one reply you then you can create a other ticket 
<a:right:889893349702635571> Do not expect instant help 
<a:right:889893349702635571> Timing 
Monday- 3pm to 9pm
Tuesday- 3pm to 9pm
Wednesday- 3pm to 9pm
Thursday- 3pm to 9pm 
Saturday- 7am to 9pm  
Sunday- 7am to 9pm

`)

        let idd = randomstring.generate({ length: 25 })
        let bu1tton = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🔒`)
          .setLabel(`Close`)
          .setID(idd)
        channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
          msg.pin()
        })
        })
      }
    
    
        if (button.values[0] === "op"){ // help +
          button.guild.channels.create(`ticket-${count}`, {
            permissionOverwrites: [
              {
                id: button.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Moder`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: button.clicker.user.id,
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
              },
            ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
          }).then(async channel => {
            channel = channel
            await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
          
            await button.reply.edit(`
      **Your ticket has been successfully opened** <#${channel.id}>`, true)
                let log_embed12 = new Discord.MessageEmbed()
                  .setTitle(`New ticket opened`)
                  .addField(`Ticket`, `<#${channel.id}>`)
                  .addField(`Ticket by`, `<@!${button.clicker.user.id}>`)
                  .addField(`Ticket number`, count)
                  .setTimestamp()
                  .setColor(`GREEN`)
                channelLog(log_embed12)
            const embedticket = new Discord.MessageEmbed()
              .setTimestamp()
              .setTitle("General Support")
              .setFooter(`Ticket opened at`)
              .setColor(0x5865F2)
              .setDescription(`Support will be with you soon.\n
      To close this ticket, interact with 🔒`)
            let idd = randomstring.generate({ length: 25 })
            await db.set(`close_${button.clicker.user.id}`, idd)
            let bu1tton = new disbut.MessageButton()
              .setStyle(`gray`)
              .setEmoji(`🔒`)
              .setLabel(`Close`)
              .setID(idd)
            channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
              msg.pin()
            })
            })
        }
      }
    });
      client.on('clickButton', async (button1) => {
        await button1.clicker.fetch()
        let idd = randomstring.generate({ length: 25 })
        await db.set(`close_${button1.clicker.user.id}_sure`, idd)
        if (button1.id == (await db.get(`close_${button1.clicker.user.id}`))) {
          let bu0tton = new disbut.MessageButton()
            .setStyle(`red`)
            .setLabel(`close`)
            .setID(idd)
          await button1.reply.send(`Are you sure you want to close this ticket?`, { component: bu0tton, ephemeral: true });
        }
      })
        client.on('clickButton', async (button) => {
          await button.clicker.fetch()
          if (button.id == (await db.get(`close_${button.clicker.user.id}_sure`))) {
          await button.reply.send(`Your order is executed after 5 seconds, and it will be closed`, true)   
            let ch = button.channel
            if (!ch) return;
            setTimeout(async () => {
              try {
                await ch.send({ embed: { description: `The ticket has already been closed <@!${button.clicker.user.id}>`, color: `YELLOW` } });
                let type = 'member'
                await Promise.all(ch.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
                ch.setName(`closed-ticket`)
                let log_embed14 = new Discord.MessageEmbed()
                  .setTitle(`Ticket closed`)
                  .addField(`Ticket`, `<#${ch.id}>`)
                  .addField(`Action by`, `<@!${button.clicker.user.id}>`)
                  .setTimestamp()
                  .setColor(`YELLOW`)
                channelLog(log_embed14)
              } catch (e) {
                return button.channel.send(`An error occurred, please try again!`);
              }
              
              console.log (`bot online`)
            }, 4000)
          }
        })
  
                                                  
                                    












keepAlive();
client.login(process.env.TOKEN);
