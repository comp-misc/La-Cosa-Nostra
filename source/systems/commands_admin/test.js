var Discord = require("discord.js");

module.exports = async function (game, message, params) {
    const members = guild.members;

    var roles = game.players;

    let membersWithRole = message.guild.members.filter(member => { 
        return member.roles.find(roleName => roleName.name === "Alive");
    }).map(member => {
        return member.user.username;
    })

    if (membersWithRole == 0) {
        return;
    }

    message.channel.send(`**Alive Players**`)

    for (var i = 0; i < roles.length; i++) {
        if (roles[i].status.alive) {
          // Get display role
  
          if (roles[i].getStatus("lynch-proof")) {
            displays.push("<@" + roles[i].id + "> (\\✖)");
            continue;
          };
  
          // Get people voting against
          var voting_against = roles[i].votes;
          var concat = new Array();
  
          // Get their display names
          for (var j = 0; j < voting_against.length; j++) {
  
            // Mapped by IDs
            var player = game.getPlayerByIdentifier(voting_against[j].identifier);
            concat.push(player.getDisplayName());
  
          };
          const embed = new Discord.RichEmbed()
            // Set the color of the embed
            .setColor(0xff0000)
            // Set the main content of the embed
            .setDescription(`\n\n **${"<@" + roles[i].id + ">"}**`);

            message.channel.send(embed)
        }
    }
    
    //message.channel.send(`Alive players \n\n**${membersWithRole.join("\n")}**`)

}