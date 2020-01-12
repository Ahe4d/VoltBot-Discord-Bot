const fs = require('fs');
const math = require('mathjs');
const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const config = require('./data/config.json');
const minecraft = require('./data/minecraft.json');
const orbanswers = require('./data/orbanswers.json');
const piper = require('./data/piper.json');
const channels = require('./data/channels.json');
const prefix = config.prefix;
const keywords = [
  'constructor',
  'prototype',
  'function',
  '()=>',
  '() =>',
  'return',
  'global',
  'eval',
  'fs',
  'require'
];
const rejectMessage = 'Invalid equation.';
const util = require('util');
const Markov = require('js-markov');
const Twitter = require('twitter');

// functions that do stuff
function checkContains(check_string, check_array) {
  var length = check_array.length;
  for (var i = 0; i < length; i++) {
    if (check_string.includes(check_array[i])) return true;
  }

  return false;
}

function convertTime(mode, time) {
  if (mode === 'seconds') {
    timeConv = time * 1000;
    return timeConv;
  } else if (mode === 'minutes') {
    timeConv = time * 60 * 1000;
    return timeConv;
  } else if (mode === 'hours') {
    timeConv = time * 60 * 60 * 1000;
    return timeConv;
  }
}

function read(file, callback) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      callback('Could not read file');
    } else {
      callback(null, data);
    }
  });
}

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
    return array;
  }
}

function writeToChannels(type, content) {
  fs.readFile('./data/channels.json', 'utf8', function readFileCallback(err, data){
    if (err) console.log(err);
    else {
      obj = JSON.parse(data); //now it an object
      if (type == "nsfw") 
        obj.nsfw.push(content);
      else if (type == "twitter")
        obj.twitter.push(content); 
      else if (type == "added")
        obj.added.push(content);
      else if (type == "talk")
        obj.talk.push(content); 
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile('./data/channels.json', json, 'utf8', callback); // write it back 
    }
  });
}

client.on('message', async message => {
  var input = message.content.toUpperCase();

  // EVERYTHING ELSE
	/*if(message.content.startsWith("https://twitter.") && ) {
		var twcli = new Twitter({
			consumer_key: process.env.twitter_consumer_key,
			consumer_secret: process.env.twitter_consumer_secret,
			access_token_key: process.env.twitter_access_token_key,
			access_token_secret: process.env.twitter_access_token_secret
		});
		
		var args = args[0].split('/');
		
		twcli.get('statuses/show', { id: args[args.length - 1], tweet_mode:'extended'}, function(error, tweets, response) {
			if (!error) {   
				// check if any media objects present
				if (tweets.extended_entities.media.length == 0) {
					message.channel.send("There are no photos in this tweet silly!");
				}
				else {
					// loop through and print media objects
					for (var i = 0; i < tweets.extended_entities.media.length; i++) 
					{
						message.channel.send(tweets.extended_entities.media[i].media_url);
					}
				}
				
			}
		});
	}*/
			
  if (message.content === 'q' && message.author.id === config.owner) {
    message.channel.send('Emergency shutdown initiated');
    process.exit();
  }

  if (message.content === prefix + 'time') message.channel.send(Date());

  if (
    message.content.includes('STAR PLATINUM') &&
    message.author.id === config.owner
  )
    message.channel.send(
      'https://vignette3.wikia.nocookie.net/jjba/images/9/9b/SPTW_Key_Art.png/revision/latest?cb=20160515054430'
    );

  if (message.content === 'ORA' && message.author.id === config.owner)
    message.channel.send('https://i.imgur.com/1wb4XCj.gif');

  if (message.content === 'ZA WARUDO' && message.author.id == config.owner) {
    message.channel.send(':stopwatch: Time has been stopped. :stopwatch:');
    setTimeout(function() {
      message.channel.send(
        ':fast_forward: Time has begun to move again. :fast_forward:'
      );
    }, 11000);
  }

  if (message.content.startsWith(prefix + 'help')) {
    read('help.txt', function(err, data) {
      if (err) {
        console.log(err);
      } else {
        message.reply(data);
      }
    });
  }

  if (message.content === prefix + 'icon') {
    message.channel.send(
      '`' +
        message.guild.name +
        "`'s icon:" +
        message.guild.iconURL +
        '?size=2048'
    );
  }

  if (message.content.includes('/o/') && message.author.id !== config.bot) {
    message.channel.send('\\o\\');
  } else if (message.content.includes('\\o\\') && message.author.id !== config.bot) {
    message.channel.send('/o/');
  }
  
  if (message.content === '<o/' && message.author.id !== config.bot) {
    message.channel.send('\\o>');
  } else if (message.content === '\\o>' && message.author.id !== config.bot) {
    message.channel.send('<o/');
  }

	if(message.content.startsWith(prefix + "av")) {
		const args = message.content.split(" ").splice(1).join(" ");
		let person;
		
		// try to find the person by nickname; then username; then mentioned; and finally if all else fails, default to the message author
		if(message.mentions.users.first() != null) {
			person = message.guild.member(message.mentions.users.first())
		} else if (person == null && args) {
			let usersinserver = message.guild.members.array().map(people => people);
			for(let i = 0; i < usersinserver.length; i++) {
				if(usersinserver[i].user.username.toLocaleLowerCase().includes(args.toLocaleLowerCase()) || usersinserver[i].displayName.toLocaleLowerCase().includes(args.toLocaleLowerCase())) {
					person = usersinserver[i];
				}
			}
		}
		
		if(person == undefined || person == null){
			person = message.guild.member(message.author);
		}
		
		// sorting the roles properly because discordjs doesn't do it
		let rolePosition = 0;
		let lastRole;
		let roleColour;
		
		for(let i = 0; i < person.roles.array().length; i++) {
			lastRole = person.roles.array()[i];
			
			// assigning the role colour based on the users top role/name colour
			if(lastRole.position > rolePosition && lastRole.hexColor !== "#000000") {
				rolePosition = lastRole.position;
				roleColour = lastRole.hexColor;
			}
		}
		
		// get the author and their nickname if they have one
		const avatarholder = person.nickname ? person.user.tag + " (" + person.nickname + ")" : person.user.tag;
		
		// and then finally, make the embed
		const embed = new Discord.RichEmbed()
		.setTitle(person.user.username + "'s avatar").setURL(person.user.displayAvatarURL)
		.setAuthor(avatarholder, person.user.displayAvatarURL)
		.setColor(roleColour)
		.setImage(person.user.displayAvatarURL);
		message.channel.send({embed});
	}

  if (message.content.startsWith(prefix + 'math')) {
    var args = message.content
      .split(' ')
      .splice(1)
      .join(' ');

    var problem = args
      .replace('Fahrenheit', 'fahrenheit')
      .replace('arenheit', 'ahrenheit')
      .replace('arhenheit', 'ahrenheit')
      .replace('Celsius', 'celsius')
      .replace('elcius', 'elsius');

    for (var i = 0; i < keywords.length; ++i) {
      if (problem.includes(keywords[i]))
        return void message.reply(rejectMessage);
    }

    try {
      message.reply(math.eval(problem).toString());
    } catch (error) {
      message.reply(rejectMessage);
    }
  }

  if (message.content === prefix + 'ping') {
    const m = await message.channel.send('Ping?');
    m.edit(
      `Pong! Latency is ${m.createdTimestamp -
        message.createdTimestamp}ms. API Latency is ${Math.round(
        client.ping
      )}ms`
    );
  }

  if (
    message.content.startsWith(prefix + 'username') &&
    message.author.id == config.owner
  ) {
    var username = message.content.substr(11);

    if (username) {
      client.user
        .setUsername(username)
        .then(function() {
          message.reply('Successfully changed username.');
        })
        .catch(function() {
          message.reply('Failed to set username. Try again later.');
        });
    } else {
      message.reply('Usage: ``!setusername NAME``');
    }
  }

  if (
    message.content.startsWith(prefix + 'poll') &&
    checkContains(message.content, ['minute', 'second', 'hour']) &&
    /\d/.test(message.content) &&
    !message.content.includes('@everyone') &&
    !message.content.includes('@here') &&
    message.author.id === config.owner
  ) {
    var pollentries = message.content.split(",");
    var timeset = 5000;
   
    var thumbsupreact = 0;
    var thumbsdownreact = 0;
    var pollquestion = pollentries[0].substr(7).toLowerCase();
   
    if(pollentries[1].includes("second")) {
        timeset = convertTime('seconds', parseInt(pollentries[1].match(/\d+/)[0]));
    } else if(pollentries[1].includes("minute")) {
        timeset = convertTime('minutes', parseInt(pollentries[1].match(/\d+/)[0]));
    } else if(pollentries[1].includes("hour")) {
        timeset = convertTime('hours', parseInt(pollentries[1].match(/\d+/)[0]));
    }
   
    if(timeset <= 604800000) {
        message.channel.send("**" + message.author + " started a poll:** " + pollquestion).then(message => {
        message.react('👍').then(() => message.react('👎'));
       
        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id !== config.bot;
        };
 
        message.awaitReactions(filter, {time: timeset})
            .then(collected => {
                thumbsupreact = message.reactions.find(reaction => reaction.emoji.name === `👍`).count - 1;
                thumbsdownreact = message.reactions.find(reaction => reaction.emoji.name === `👎`).count - 1;
                message.delete();
               
                var result_firsthalf = "When asked **" + pollquestion + "**, people voted:\n" + thumbsupreact + " :thumbsup:\n" + thumbsdownreact + " :thumbsdown:";
                if(thumbsupreact > thumbsdownreact) {
                    thumbsupreact = "**" + thumbsupreact + "**";
                    var result_final = result_firsthalf + "\nmeaning the vote won in favour of **Yes**.";
                } else if(thumbsupreact < thumbsdownreact) {
                    thumbsdownreact = "**" + thumbsdownreact + "**";
                    var result_final = result_firsthalf + "\nmeaning the vote won in favour of **No**.";
                } else if(thumbsupreact === thumbsdownreact) {
                    var result_final = result_firsthalf + "\nmeaning the vote has **tied**.";
                } else {
                    var result_final = "Error!";
                }
               
                message.channel.send(result_final);
            })
        })
        .catch(collected => {
            console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
            message.reply('you didn\'t react with neither a thumbs up, nor a thumbs down.');
        });
    } else {
        message.channel.send("Error: The time interval was too long. The maximum poll time allowed is 7 days.");
    }
  }

  if (message.content.startsWith(prefix + 'pick ')) {
    let choices = message.content.substr(7).split('|');
    message.reply(
      'I pick **' +
        choices[Math.abs(Math.round(Math.random() * choices.length - 1))] +
        '**.'
    );
  }

  if (
    message.content.startsWith(prefix + 'owo') &&
    message.author.id !== config.bot
  ) {
    var owo = message.content.substr(5);
    var endowo = ['owo', 'uwu', 'OwO', 'OWO', 'UwU', 'UWU'];
    var squiggle = ['', '~', '~~', '~~~'];
    owo = owo.replace(/[rl]/g, 'w');
    owo = owo.replace(/[n]/g, 'ny');
    owo = owo.replace(/[RL]/g, 'W');
    owo = owo.replace(/[N]/g, 'NY');
    owo = owo.replace('life', 'laifu');
    owo = owo.replace('wife', 'waifu');
    owo = owo.replace('LIFE', 'LAIFU');
    owo = owo.replace('WIFE', 'WAIFU');
    owo = owo.replace('yy', 'y');
    owo = owo.replace('nyg', 'ng');
    owo = owo.replace('nyt', 'nt');
    owo = owo.replace('nye', 'ne');
    owo = owo.replace('nyk', 'ny');
    owo = owo.replace('iny', 'ing');
    owo = owo.replace('nyny', 'ny');
    owo = owo.replace("ny'ny", 'nyny');
    owo = owo.replace(' iny ', ' in ');
    owo = owo.replace("y't", "'t");
    owo = owo.replace('iony', 'ion');
    owo = owo.replace('YY', 'Y');
    owo = owo.replace('NYG', 'NG');
    owo = owo.replace('NYT', 'NT');
    owo = owo.replace('NYE', 'NR');
    owo = owo.replace('ANY', 'AN');
    owo = owo.replace('NYNY', 'NK');
    owo = owo.replace(' INY ', ' IN ');
    owo = owo.replace("Y'T", "'T");
    owo = owo.replace("NY'NY", 'NYNY');
    owo = owo.replace('IONY', 'ION');
    message.channel.send(
      owo +
        squiggle[math.abs(math.round(math.random() * squiggle.length - 1))] +
        ' ' +
        endowo[math.abs(math.round(math.random() * endowo.length - 1))]
    );
  }
  
	// markov generator
	if(
		message.content.startsWith(prefix + "grab") &&
		message.author.id === config.owner
	) {
		let args = parseInt(message.content.split(' ').splice(1).join(' '));
		let messages;
		
		if(isNaN(args)) {
			args = 50;
		}
		
		message.channel.fetchMessages({ limit: args }).then(m => {
				let markov = new Markov();
				messages = m.map(x => x.cleanContent);
				markov.addStates(messages);
				markov.train(100);
				let markovString = markov.generateRandom() + " ";
				function getRandomArbitrary(min, max) {
					return Math.floor(Math.random() * (max - min) + min);
				}
				for(let i = 0; i < getRandomArbitrary(0, 1000); i++) {
					markovString += markov.generateRandom() + " ";
				}
				message.channel.send(markovString.replace(/\b<@[a-zA-Z]*/,""));
			}
		)
	}
	
	if(message.content.startsWith(prefix + "purge") && message.author.id === config.owner) {
		let deleteCount = parseInt(message.content.split(' ').splice(1).join(' '));
		
		if(!deleteCount || deleteCount < 2 || deleteCount > 100) {
			message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
		} else {
			const fetched = await message.channel.fetchMessages({limit: deleteCount});
			message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
		}
	}

  // useful command for checking the status of a minecraft server
  if (
    message.content === prefix + 'minecraft' &&
    minecraft.minecraft_discordserver.includes(message.guild.id)
  ) {
    let url =
      'http://mcapi.us/server/status?ip=' +
      minecraft.mcIP +
      '&port=' +
      minecraft.mcPort;
    request(url, function(err, response, body) {
      if (err || minecraft.mcIP === '') {
        return message.reply('Error getting Minecraft server status');
      }

      body = JSON.parse(body);
      let status =
        ':x: **' +
        minecraft.mcIP +
        ':' +
        minecraft.mcPort +
        '** | *Minecraft server is currently offline*';

      if (body.online) {
        status =
          ':white_check_mark: **' +
          minecraft.mcIP +
          ':' +
          minecraft.mcPort +
          '** | The server is **online**  -  ';
        if (body.players.now) {
          status += '**' + body.players.now + '** people are playing!';
        } else {
          status += '*Nobody is playing!*';
        }
      }
      message.reply(status);
    });
  }

  // the holy grail; the
  if (message.content === prefix + 'birb') {
    var url = 'http://random.birb.pw/tweet.json/';

    request(url, function(err, response, body) {
      if (err) {
        console.log(err);
        return message.reply('Error getting bird image!');
      }

      body = JSON.parse(body);

      if (body) {
        let embed = new Discord.RichEmbed().setImage(
          'https://random.birb.pw/img/' + body.file
        );
        message.reply({ embed });
      }
    });
  }

	if((message.content.startsWith("!eval") || message.content.startsWith("!evalr")) && config.owner === message.author.id && !message.content.includes("console") && !message.content.includes("exec") && !message.content.includes("@everyone") && !message.content.includes("@here")) {    
		try {
			let evalData = eval(message.content.substr(6));
        
			if(message.content.charAt(5) === "r")
				message.reply("``" + evalData + "``");
		} catch(err) {
			message.reply("```javascript" + "\n" + err + "```");
		}
	}

  // the orbs
  if (message.content.startsWith(prefix + 'orbs')) {
    var orbanswerone =
      orbanswers[Math.round(Math.random() * (orbanswers.length - 1))];
    var orbanswertwo =
      orbanswers[Math.round(Math.random() * (orbanswers.length - 1))];
    var orbanswerthree =
      orbanswers[Math.round(Math.random() * (orbanswers.length - 1))];
    message.channel.send(
      ':black_circle:: ' +
        orbanswerone +
        '\n:black_circle:: ' +
        orbanswertwo +
        '\n:black_circle:: ' +
        orbanswerthree
    );
  }

  // This is for adding and removing channels from the spam, nsfw and stream commands, as well as toggling the stream command.
  if (
    message.content === prefix + 'addchannel spam' &&
    message.author.id == config.owner
  ) {
    channels.added.push(message.channel.id);
    writeToChannels('added', JSON.stringify(channels.added));
    message.reply('successfully added channel.');
  }

  if (
    message.content === prefix + 'removechannel spam' &&
    message.author.id == config.owner
  ) {
    remove(channels.added, message.channel.id);
    writeToChannels('added', JSON.stringify(channels.added));
    message.reply('successfully removed channel.');
  }

  if (
    message.content === prefix + 'addchannel nsfw' &&
    message.author.id == config.owner
  ) {
    channels.nsfw.push(message.channel.id);
    writeToChannels('nsfw', JSON.stringify(channels.nsfw));
    message.reply('successfully added channel to nsfw.');
  } else if (
    message.content === prefix + 'removechannel nsfw' &&
    message.author.id == config.owner
  ) {
    channels.nsfw.splice(message.channel.id);
    writeToChannels('nsfw', JSON.stringify(channels.nsfw));
    message.reply('successfully removed channel from nsfw.');
  }

  if (
    message.content === prefix + 'addchannel twitter' &&
    message.author.id == config.owner
  ) {
    channels.twitter.channel = message.channel.id;
    writeToChannels('twitter', JSON.stringify(channels.twitterchannel));
    console.log(JSON.stringify(channels.twitter.channel));
    message.reply('successfully made this the stream channel.');
  } else if (
    message.content === prefix + 'stream removechannel' &&
    message.author.id == config.owner
  ) {
    channels.twitter.channel = '';
    writeToChannels('twitter', JSON.stringify(channels.twitter.channel));
    console.log(JSON.stringify(channels.twitter));
    message.reply('successfully stopped this being the stream channel.');
  }

  // command for viewing and leaving servers
  if (
    message.content.startsWith(prefix + 'servers') &&
    message.author.id === config.owner
  ) {
    let args = message.content
      .split(' ')
      .splice(1)
      .join(' ');
    let server_array = client.guilds.array();

    // the listing part
    if (args.startsWith('list')) {
      let list = '';
      // runs through the array of servers the bot's currently in and
      // appends them to the output variable
      server_array.forEach(server => {
        list +=
          (server_array.indexOf(server) + 1).toString() + ') ' + server + '\n';
      });
      // then we send that output variable
      message.channel.send('```' + list + '```');
    }

    // the leaving part
    if (args.startsWith('leave ')) {
      // get the indexed server from the message and parse it as an int
      let serverindx = parseInt(args.substr(6));
      // check if the index isn't negative or bigger than the array
      if (serverindx > 0 && serverindx <= server_array.length) {
        serverindx -= 1;
        // leave the server
        server_array[serverindx].leave();
      }
    }
  }

  if (
    message.content === prefix + 'stream enable' &&
    message.author.id == config.owner
  ) {
    channels.twitter.enabled = true;
    writeToChannels('twitter', JSON.stringify(channels.twitter.enabled));
    message.reply('successfully enabled the streaming service.');
  } else if (
    message.content === prefix + 'stream disable' &&
    message.author.id == config.owner
  ) {
    channels.twitter.enabled = false;
    writeToChannels('twitter', JSON.stringify(channels.twitter.enabled));
    message.reply('successfully disabled the streaming service.');
  }

  if (message.content === prefix + 'stream') {
    var streamstatusreply = '';
    channels.twitter.enabled === true
      ? (streamstatusreply += 'streaming is enabled, ')
      : (streamstatusreply += 'streaming is disabled, ');
      channels.twitter.enabled === ''
      ? (streamstatusreply += 'but the stream channel is currently not set.')
      : (streamstatusreply +=
          'stream channel is currently set to <#' +
          channels.twitter.enabled +
          '>');
    message.reply(streamstatusreply);
  }

  if (
    message.content.startsWith(prefix + 'pa') &&
    message.author.id == config.owner &&
    !piper.includes(message.content.substring(5))
  ) {
    message.delete();
    piper.push(message.content.substring(5));
    fs.writeFileSync('./data/piper.json', JSON.stringify(piper));
    message.reply('successfully added piper.');
  }

  // this is the code for adding/removing them. it's so God Damn Short !
  if (
    message.content === prefix + 'addchannel talk' &&
    message.author.id === config.owner &&
    !channels.talk.includes(message.channel.id)
  ) {
    channels.talk.push(message.channel.id);
    writeToChannels('talk', JSON.stringify(channels.talk));
    message.reply('successfully added channel to talk.');
  } else if (
    message.content === prefix + 'removechannel talk' &&
    message.author.id === config.owner &&
    channels.talk.includes(message.channel.id)
  ) {
    channels.talk.splice(message.channel.id);
    writeToChannels('talk', JSON.stringify(channels.talk));
    message.reply('successfully removed channel from talk.');
  } else if (
    message.content === prefix + 'resetchannels talk' &&
    message.author.id === config.owner
  ) {
    for (var k = 0; k <= channels.talk; k++) {
      channels.talk.splice[k];
    }
    writeToChannels('talk', JSON.stringify(channels.talk));
    message.reply('successfully removed every channel from talk.');
  }
  
  
  // SPAM COMMANDS - uses addedchannels.json to store channel ids
  if (channels.added.includes(message.channel.id)) {
    if (
      input.includes('PIPER') &&
      message.author.id !== config.bot &&
      !message.content.includes(prefix + 'piper')
    ) {
      message.channel.send('piper');
    }

    if (message.content === prefix + 'piper')
      message.reply(piper[Math.floor(Math.random() * piper.length)]);

    if (
      message.content
        .toUpperCase()
        .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, '') === 'E' &&
      message.author.id !== config.bot
    ) {
      message.channel.send(message.content);
      var ranchanse = Math.floor(Math.random() * 500);
      if (ranchanse === 25) {
        message.channel.send('https://www.youtube.com/watch?v=6QctvvOQcTw');
      }
    }
  }

  // NSFW COMMANDS - uses nsfw.json to store channels ids
  if (channels.nsfw.includes(message.channel.id)) {
    if (message.content.startsWith(prefix + 'touhou')) {
      function shuffle(sourceArray) {
        for (var i = 0; i < sourceArray.length - 1; i++) {
          var j = i + Math.floor(Math.random() * (sourceArray.length - i));

          var temp = sourceArray[j];
          sourceArray[j] = sourceArray[i];
          sourceArray[i] = temp;
        }
        return sourceArray;
      }

      var options = {
        url:
          'https://danbooru.donmai.us/posts.json?tags=touhou+rating:safe&random=false&limit=1',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Yoshi-Bot/1.0; +http://github.com/MarioGraceZ22/Yoshi-Bot)'
        }
      };

      request(options, function(error, response, body, dest, dest2, callback) {
        if (!error && response.statusCode == 200) {
          if (body) {
            var estoThing = JSON.parse(body);
            var randomImage = shuffle(estoThing);
            var dest =
              randomImage[Math.floor(Math.random() * estoThing.length)]
                .file_url;

            message.reply(dest);
          } else {
            console.log("Couldn't find anything!");
          }
        } else {
          console.log(
            'error: ' + error + '\nStatus code:' + response.statusCode
          );
        }
      });
    }
  }
});

process.on('uncaughtException', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

client
  .login(config.authkey)
  .then(function() {
    console.log('successfully logged in');
  })
  .catch(function(error) {
    console.log(error);
  });

client.on('error', error => {
  console.error(new Date() + ' Discord Client encountered an error');
  console.error(error);
});