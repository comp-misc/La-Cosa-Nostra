var lcn = require("../../../../source/lcn.js");
var auxils = lcn.auxils;

var zlib = require("zlib");
var fs = require("fs");
var request = require("request-promise");

var logger = process.logger;

module.exports = async function (message, params, config) {

  var client = message.client;

  if (params.length < 3) {
    await message.channel.send(":x: Incorrect syntax. Please use `" + config["command-prefix"] + "d-archive <save file name> <truncate unix timestamp> <text/category channel ID> [<text/category channel ID>...]` instead!");
    return null;
  };

  var truncate_time = params[1] * 1000;
  var channel_ids = params.splice(2, Infinity);

  await message.channel.send(":hourglass_flowing_sand: Archiving the channels into a file. Please be patient.");

  var start_time = new Date();

  var output = await serialise(channel_ids);

  var archive_directory = __dirname + "/../../../../data/d-archive/";

  if (!fs.existsSync(archive_directory)) {
    logger.log(2, "[Archiver] Made d-archive directory in data.");
    fs.mkdirSync(archive_directory);
  };

  var save_directory = archive_directory + params[0];

  var savable = JSON.stringify(output);
  savable = zlib.deflateSync(savable);

  fs.writeFileSync(save_directory, savable.toString("base64"));
  var file_size = fs.statSync(save_directory).size / 1000000;

  logger.log(2, "[Archiver] Saved file to %s [%s MB]", save_directory, file_size);

  await message.channel.send(":exclamation: Complete! - Save file is **" + Math.floor(file_size * 1000) / 1000 + "**MB! Took **" + auxils.formatDate(new Date().getTime() - start_time.getTime()) + "**.");

  async function serialise (channel_ids=new Array()) {

    var channels = new Array();
    var returnable = {
      channels: new Array(),
      users: new Array(),
      categories: new Array(),
      guilds: new Array()
    };

    // {guild, channels: [], users: []}
    for (var i = 0; i < channel_ids.length; i++) {

      var channel = client.channels.find(x => x.id === channel_ids[i]);

      if (channel.type === "category") {
        // Get children IDs and concat if non-existent
        channel_ids = channel_ids.concat(channel.children.array().map(x => x.id));
        returnable.categories.push({id: channel.id, name: channel.name});
        continue;
      };

      // Text
      if (channel.type === "text") {
        channels.push(channel);
        continue;
      };

    };

    var message_amount = new Number();

    var load_message = null;

    // Index
    for (var i = 0; i < channels.length; i++) {

      var channel = channels[i];

      // Log
      logger.log(2, "[Archiver] \x1b[1mSerialising %s/%s channels.\x1b[0m", i + 1, channels.length);
      var output = await serialiseChannel(channel);

      returnable.channels.push({
        id: channels.id,
        position: channel.position,
        calculated_position: channel.calculatedPosition,
        name: channel.name,
        topic: channel.topic,
        last_pin_at: channel.lastPinAt,
        parentID: channel.parentID,
        rate_limit_per_user: channel.rateLimitPerUser,
        messages: output.messages,
        guild: channel.guild.id
      });

      message_amount += output.messages.length;

      if (!returnable.categories.some(x => x.id === channel.parentID)) {
        returnable.categories.push({id: channel.parent.id, name: channel.parent.name});
      };

      if (!returnable.guilds.some(x => x.id === channel.guild.id)) {
        var addable = {id: channel.guild.id, name: channel.guild.name, icon_url: channel.guild.iconURL, icon: null};

        if (addable.icon_url) {
          logger.log(2, "[Archiver] Downloading profile picture of guild icon %s", channel.guild.id);
          addable.icon = await request(addable.icon_url);
        };

        returnable.guilds.push(addable);
      };

      for (var id in output.users) {

        if (returnable.users.some(x => x.id === id)) {
          continue;
        };

        var addable = output.users[id];

        addable.id = id;

        if (addable.avatar) {
          addable.avatar_displayable = await request(addable.avatar);
        };

        returnable.users.push(addable);

      };

      if (!load_message) {
        load_message = await message.channel.send(":exclamation: Finished serialising channel **" + channel.name + "** (" + channel.id + ") [" + (i + 1)+ "/" + channels.length +"]");
      } else {
        await load_message.edit(":exclamation: Finished serialising channel **" + channel.name + "** (" + channel.id + ") [" + (i + 1)+ "/" + channels.length +"]");
      };

    };

    await message.channel.send(":exclamation: Logged " + returnable.categories.length + " category/(ies), " + returnable.channels.length + " channel(s), " + returnable.users.length + " user(s), " + message_amount + " message(s). Saving...");

    logger.log(2, "[Archiver] \x1b[1mLogged %s category/(ies), %s channel(s), %s user(s), %s message(s)\x1b[0m", returnable.categories.length, returnable.channels.length, returnable.users.length, message_amount);

    return returnable;

  };

  async function serialiseChannel (channel) {

    var messages = await indexChannel(channel);

    var storage = {
      users: new Object(),
      messages: new Array()
    };

    for (var i = 0; i < messages.length; i++) {

      var message = messages[i];

      if (message.createdTimestamp < truncate_time) {
        break;
      };

      var user = message.author;
      var member = message.member;

      if (!storage.users[user.id]) {

        storage.users[user.id] = {
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.displayAvatarURL,
          bot: user.bot,
          avatar_displayable: null,
          display_name: member ? member.displayName : null,
          display_hex_colour: member ? member.displayHexColor : null
        };

      };

      var pushable = {id: message.id, content: message.cleanContent, user: message.author.id, createdTimestamp: message.createdTimestamp, system: message.system, pinned: message.pinned, editedTimestamp: message.editedTimestamp, attachments: new Array()};

      if (message.attachments.size > 0) {

        var attachments = message.attachments.array();
        for (var j = 0; j < attachments.length; j++) {
          var attachment = attachments[j];

          logger.log(2, "[Archiver] Downloading attachment %s, %s [%s bytes]", attachment.filename, attachment.id, attachment.filesize);

          var data = await request(attachment.url);
          pushable.attachments.push({id: attachment.url, data: data, filename: attachment.filename, filesize: attachment.filesize});
        };

      };

      storage.messages.push(pushable);

    };

    return storage;

  };

  async function indexChannel (channel) {

    var id = undefined;
    var concat = new Array();

    while (true) {

      var messages = await getMessage(channel, id);

      concat = messages.concat(concat);

      if (messages.length < 100) {
        break;
      } else {
        id = messages[99].id;
      };

      logger.log(2, "[Archiver] Indexed %s", messages[99].createdAt);

      if (messages[99].createdTimestamp < truncate_time) {
        logger.log(2, "[Archiver] Truncated.");
        break;
      };

    };

    return concat;

  };

  async function getMessage (channel, from) {

    var messages = (await channel.fetchMessages({limit: 100, before: from})).array();

    return messages;

  };

};