const Discord = require("discord.js");
var client = new Discord.Client({autoReconnect:true});
var authfile = require("./auth.json");
var piper = require("./data/piper.json");
var addedchannels = require("./channel_permissions/addedchannels.json");
var nsfw = require("./channel_permissions/nsfwchannels.json");
var streamchannels = require("./channel_permissions/streamchannels.json");
var fs = require("fs");
const math = require("mathjs"),
    keywords = [
        "constructor",
        "prototype",
        "function",
        "()=>",
        "() =>",
        "return",
        "global",
        "eval",
        "fs",
        "require"
    ],
    rejectMessage = "Invalid equation.";
var prefix = "m!";
var request = require('request');
var mcIP = ''; // Your MC server IP
var mcPort = 25565; // Your MC server port
var minecraft_discordserver = [""];
var req = require('req-fast');
/*var Twitter = require('twitter');
var twclient = new Twitter({
	consumer_key: authfile.consumer_key,
	consumer_secret: authfile.consumer_secret,
	access_token_key: authfile.access_token_key,
	access_token_secret: authfile.access_token_secret
});
var stream = twclient.stream('statuses/filter', {follow: ''});*/
const util = require('util');
const orbanswers = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no", "Outlook not so good.", "Very doubtful."];
var talkchannels = require('./channel_permissions/talkchannels.json');

// functions that do stuff
function checkContains(check_string, check_array) {
	var length = check_array.length
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

client.on("message", async message => {
	var input = message.content.toUpperCase();
	
	// SPAM COMMANDS - uses addedchannels.json to store channel ids
	if(addedchannels.includes(message.channel.id)) {
		if(input.includes("PIPER") && message.author.id !== authfile.bot && !message.content.includes(prefix + "piper")) {
			message.channel.send("piper");
		}
		
        if(message.content === prefix + "piper") 
            message.reply(piper[Math.floor(Math.random() * piper.length)]);
		
		if(message.content.toUpperCase().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "") === "E" && message.author.id !== authfile.bot) {
			message.channel.send(message.content);
			var ranchanse = Math.floor(Math.random() * 500);
			if(ranchanse === 25) {
				message.channel.send("https://www.youtube.com/watch?v=6QctvvOQcTw")
			}
		}
	}
	
	// NSFW COMMANDS - uses nsfw.json to store channels ids
	if(nsfw.includes(message.channel.id)) {
		if(message.content.startsWith(prefix + "touhou")) {
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
				url: "https://danbooru.donmai.us/posts.json?tags=touhou+rating:safe&random=false&limit=1",
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; Yoshi-Bot/1.0; +http://github.com/MarioGraceZ22/Yoshi-Bot)'
				}
			};

			request(options, function (error, response, body, dest, dest2, callback) {
				if (!error && response.statusCode == 200) {
					if (body) {
						var estoThing = JSON.parse(body);
						var randomImage = shuffle(estoThing);
						var dest = randomImage[Math.floor(Math.random() * estoThing.length)].file_url;
						
						message.reply(dest);
					} else {
						console.log("Couldn't find anything!");
					}
				} else {
					console.log("error: " + error + "\nStatus code:" + response.statusCode);
				}
			});
		}
	}
	
	// EVERYTHING ELSE
	if(message.content === "q" && message.author.id === authfile.owner) {
		message.channel.send("Emergency shutdown initiated");process.exit();
	}
	
	if(message.content === prefix + "time") message.channel.send(Date());
	
	if(message.content.includes("STAR PLATINUM") && message.author.id === authfile.owner) message.channel.send("https://vignette3.wikia.nocookie.net/jjba/images/9/9b/SPTW_Key_Art.png/revision/latest?cb=20160515054430");
	
	if(message.content === "ORA" && message.author.id === authfile.owner) message.channel.send("https://i.imgur.com/1wb4XCj.gif");
	
	if(message.content === "ZA WARUDO" && message.author.id == authfile.owner) {
		message.channel.send(":stopwatch: Time has been stopped. :stopwatch:");
		setTimeout(function(){ message.channel.send(":fast_forward: Time has begun to move again. :fast_forward:"); }, 11000);
	}
	
	if(message.content.startsWith(prefix + "help")) {
		read('help.txt', function(err, data) {
			if(err) {
				console.log(err);
			} else {
				message.reply(data);
			}
		});
	}
	
	if(message.content === prefix + "icon") {
		message.channel.send("`" + message.guild.name + "`'s icon:" + message.guild.iconURL + "?size=2048");
	}
	
	if(message.content === "/o/" && message.author.id !== authfile.bot) {
		message.channel.send("\\o\\");
	} else if(message.content === "\\o\\" && message.author.id !== authfile.bot) {
		message.channel.send("/o/");
	}
	
	if(message.content.startsWith(prefix + "av")) {
		var args = message.content.split(" ").splice(1).join(" ");
		
		// try to find the person by nickname; then username; then mentioned; and finally if all else fails, default to the message author
		var person = message.guild.members.find(member => member.user.username.toLocaleLowerCase() === args.toLocaleLowerCase())
		if (person === null) {
			var person = message.guild.members.find(member => member.displayName.toLocaleLowerCase() === args.toLocaleLowerCase())
			if (person === null) {
				var person = message.guild.member(message.mentions.users.first())
				if(person === null && args) {
					var usersinserver = message.guild.members.array().map(people => people);
					for(var i = 0; i < usersinserver.length; i++) {
						if(usersinserver[i].user.username.toLocaleLowerCase().includes(args.toLocaleLowerCase()) || usersinserver[i].displayName.toLocaleLowerCase().includes(args.toLocaleLowerCase())) {
							var person = usersinserver[i];
						}
					}
				} if (person === null) {
					var person = message.guild.member(message.author)
				}
			}
		}
		
		// sorting the roles properly because discordjs doesn't do it
		var roleposition = 0;
		for(var i = 0; i < person.roles.array().length; i++) {
			var lastrole = person.roles.array()[i];
			
			// assigning the role colour based on the users top role/name colour
			if(lastrole.position > roleposition && lastrole.hexColor !== "#000000") {
				roleposition = lastrole.position;
				var rolecolour = lastrole.hexColor;
			}
		}
		
		// get the author and their nickname if they have one
		if(person.nickname !== null) {
			var avatarholder = person.user.tag + " (" + person.nickname + ")";
		} else {
			var avatarholder = person.user.tag;
		}
			
		// and then finally, make the embed
		var embed = new Discord.RichEmbed()
		.setTitle(person.user.username + "'s avatar").setURL(person.user.displayAvatarURL)
		.setAuthor(avatarholder, person.user.displayAvatarURL)
		.setColor(rolecolour)
		.setImage(person.user.displayAvatarURL);
		message.channel.send({embed});
	}
	
	if(message.content.startsWith(prefix + "m")) {
		var args = message.content.split(" ").splice(1).join(" ");
		
		var problem = args.replace("Fahrenheit", "fahrenheit").replace("arenheit", "ahrenheit").replace("arhenheit", "ahrenheit").replace("Celsius", "celsius").replace("elcius", "elsius");
		
		for(var i = 0; i < keywords.length; ++i) {
			if(problem.includes(keywords[i]))
				return void message.reply(rejectMessage);
		}

		try {
			message.reply(math.eval(problem).toString());
		} catch(error) {
			message.reply(rejectMessage);
		}
	}
	
	if(message.content === prefix + "ping") {
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
	}
	
	if(message.content.startsWith(prefix + "username") && message.author.id == authfile.owner) {
        var username = message.content.substr(11);
        
        if(username) {
            client.user.setUsername(username).then(function() {
                message.reply("Successfully changed username.");
            }).catch(function() {
                message.reply("Failed to set username. Try again later.");
            });
        } else {
            message.reply("Usage: ``!setusername NAME``");
        }
    }
	
	if(message.content.startsWith(prefix + "poll") && checkContains(message.content, ["minute", "second", "hour"]) && /\d/.test(message.content) && !message.content.includes("@everyone") && !message.content.includes("@here") && message.author.id == '155562672320937984') {
		var pollentries = message.content.split(",");
		var time = 5000;
		
		var thumbsupreact = 0;
		var thumbsdownreact = 0;
		var pollquestion = pollentries[0].substr(7).toLowerCase();
		
		if(pollentries[1].includes("second")) {
			time = convertTime('seconds', parseInt(pollentries[1].match(/\d+/)[0]));
		} else if(pollentries[1].includes("minute")) {
			time = convertTime('minutes', parseInt(pollentries[1].match(/\d+/)[0]));
		} else if(pollentries[1].includes("hour")) {
			time = convertTime('hours', parseInt(pollentries[1].match(/\d+/)[0]));
		}
		
		if(time <= 604800000) {
			message.channel.send("**" + message.author + " started a poll:** " + pollquestion).then(message => {
			message.react(`ðŸ‘`);
			
			setTimeout(() => {
			message.react(`ðŸ‘Ž`);
			},250);
			
			setTimeout(() => {
			thumbsupreact = message.reactions.find(reaction => reaction.emoji.name === `ðŸ‘`).count - 1;
			thumbsdownreact = message.reactions.find(reaction => reaction.emoji.name === `ðŸ‘Ž`).count - 1;
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
				var result_final = "error!";
			}
			message.channel.send(result_final);
			}, time+1000, time);
		});
		} else {
			message.channel.send("Error: The time interval was too long. The maximum poll time allowed is 7 days.");
		}
	}
	
	if(message.content.startsWith(prefix + "pick ")) {
		let choices = message.content.substr(7).split("|");
		message.reply("I pick **" + choices[Math.abs(Math.round(Math.random() * choices.length - 1))] + "**.");
	}
	
	if(message.content.startsWith(prefix + "owo") && message.author.id !== authfile.bot) {
		var owo = message.content.substr(5);
		var endowo = ["owo", "uwu", "OwO", "OWO", "UwU", "UWU"];
		var squiggle = ["", "~", "~~", "~~~"];
		owo = owo.replace(/[rl]/g,'w');
		owo = owo.replace(/[n]/g,'ny');
		owo = owo.replace(/[RL]/g,'W');
		owo = owo.replace(/[N]/g,'NY');
		owo = owo.replace("life",'laifu');
		owo = owo.replace("wife",'waifu');
		owo = owo.replace("LIFE",'LAIFU');
		owo = owo.replace("WIFE",'WAIFU');
		owo = owo.replace("yy",'y');
		owo = owo.replace("nyg",'ng');
		owo = owo.replace("nyt",'nt');
		owo = owo.replace("nye",'ne');
		owo = owo.replace("nyk",'ny');
		owo = owo.replace("iny",'ing');
		owo = owo.replace("nyny", "ny");
		owo = owo.replace("ny'ny", "nyny");
		owo = owo.replace(" iny ", " in ");
		owo = owo.replace("y't", "'t");
		owo = owo.replace("iony", "ion");
		owo = owo.replace("YY",'Y');
		owo = owo.replace("NYG",'NG');
		owo = owo.replace("NYT",'NT');
		owo = owo.replace("NYE",'NR');
		owo = owo.replace("ANY",'AN');
		owo = owo.replace("NYNY", "NK");
		owo = owo.replace(" INY ", " IN ");
		owo = owo.replace("Y'T", "'T");
		owo = owo.replace("NY'NY", "NYNY");
		owo = owo.replace("IONY", "ION");
		message.channel.send(owo + squiggle[math.abs(math.round(math.random() * squiggle.length - 1))] + " " + endowo[math.abs(math.round(math.random() * endowo.length - 1))]);
	}
	
	// useful command for checking the status of a minecraft server
	if (message.content === (prefix + "status") && minecraft_discordserver.includes(message.guild.id)) {
        var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;
        request(url, function(err, response, body) {
            if(err) {
                console.log(err);
                return message.reply('Error getting Minecraft server status...');
            }
            body = JSON.parse(body);
            var status = ':x: **' + mcIP + ':' + mcPort + '** | *Minecraft server is currently offline*';
            if(body.online) {
                status = ':white_check_mark: **' + mcIP + ':' + mcPort + '** | The server is **online**  -  ';
                if(body.players.now) {
                    status += '**' + body.players.now + '** people are playing!';
                } else {
                    status += '*Nobody is playing!*';
                }
            }
            message.reply(status);
        });
    }
	
	// the holy grail; the 
	if (message.content === (prefix + "birb")) {
        var url = 'http://random.birb.pw/tweet.json/';
		
        request(url, function(err, response, body) {
            if(err) {
                console.log(err);
                return message.reply('Error getting bird image!');
            }
			
            body = JSON.parse(body);
			
            if(body) {
				let embed = new Discord.RichEmbed()
				.setImage("https://random.birb.pw/img/" + body.file);
				message.reply({embed});
            }
        });
    }
	
	if((message.content.startsWith("!eval") || message.content.startsWith("!evalr")) && authfile.owner === message.author.id && !message.content.includes("console") && !message.content.includes("exec") && !message.content.includes("@everyone") && !message.content.includes("@here")) {    
		try {
			let evalData = eval(message.content.substr(6));
        
			if(message.content.charAt(5) === "r")
				message.reply("``" + evalData + "``");
		} catch(err) {
			message.reply("```javascript" + "\n" + err + "```");
		}
	}
	
	// the orbs
	if(message.content.startsWith(prefix + "orbs")) {
		var orbanswerone = orbanswers[Math.round(Math.random() * (orbanswers.length - 1))];
		var orbanswertwo = orbanswers[Math.round(Math.random() * (orbanswers.length - 1))];
		var orbanswerthree = orbanswers[Math.round(Math.random() * (orbanswers.length - 1))];
		message.channel.send(":black_circle:: " + orbanswerone + "\n:black_circle:: " + orbanswertwo + "\n:black_circle:: " + orbanswerthree)
	}
	
	// This is for adding and removing channels from the spam, nsfw and stream commands, as well as toggling the stream command.
	if(message.content === prefix + "addchannel spam" && message.author.id == authfile.owner) {
		addedchannels.push(message.channel.id);
		fs.writeFileSync("addedchannels.json", JSON.stringify(addedchannels));
		message.reply("successfully added channel.");
	}
	
	if(message.content === prefix + "removechannel spam" && message.author.id == authfile.owner) {
		remove(addedchannels, message.channel.id);
		fs.writeFileSync("addedchannels.json", JSON.stringify(addedchannels));
		message.reply("successfully removed channel.");
	}
	
	if(message.content === prefix + "addchannel nsfw" && message.author.id == authfile.owner) {
		nsfw.push(message.channel.id);
		fs.writeFileSync("nsfw.json", JSON.stringify(nsfw));
		message.reply("successfully added channel to nsfw.");
	} else if(message.content === prefix + "removechannel nsfw" && message.author.id == authfile.owner) {
		nsfw.splice(message.channel.id);
		fs.writeFileSync("nsfw.json", JSON.stringify(nsfw));
		message.reply("successfully removed channel from nsfw.");
	}
		
	if(message.content === prefix + "stream addchannel" && message.author.id == authfile.owner) {
		streamchannels.channel = message.channel.id;
		fs.writeFile('streamchannels.json', JSON.stringify(streamchannels), function (err) {
			if (err) return console.log(err);
			console.log(JSON.stringify(streamchannels));
			message.reply("successfully made this the stream channel.");
		});
	} else if(message.content === prefix + "stream removechannel" && message.author.id == authfile.owner) {
		streamchannels.channel = "";
		fs.writeFile('streamchannels.json', JSON.stringify(streamchannels), function (err) {
			if (err) return console.log(err);
			console.log(JSON.stringify(streamchannels));
			message.reply("successfully stopped this being the stream channel.");
		});
	}
	
	// command for viewing and leaving servers
	if(message.content.startsWith(prefix + "servers") && message.author.id === authfile.owner) {
		let args = message.content.split(" ").splice(1).join(" ");
		let server_array = client.guilds.array();
		
		// the listing part
		if(args.startsWith("list")) {
			let list = "";
			// runs through the array of servers the bot's currently in and
			// appends them to the output variable
			server_array.forEach(server => {
				list += (server_array.indexOf(server) + 1).toString() + ") " + server + "\n";
			});
			// then we send that output variable
			message.channel.send("```" + list + "```");
		}
		
		// the leaving part
		if(args.startsWith("leave ")) {
			// get the indexed server from the message and parse it as an int
			let serverindx = parseInt(args.substr(6));
			// check if the index isn't negative or bigger than the array
			if(serverindx > 0 && serverindx <= server_array.length) {
				serverindx -= 1;
				// leave the server
				server_array[serverindx].leave();
			}
		}
	}
	
	if(message.content === prefix + "stream enable" && message.author.id == authfile.owner) {
		streamchannels.enabled = true;
		fs.writeFile('streamchannels.json', JSON.stringify(streamchannels.enabled), function (err) {
			if (err) return console.log(err);
			message.reply("successfully enabled the streaming service.");
		});
	} else if(message.content === prefix + "stream disable" && message.author.id == authfile.owner) {
		streamchannels.enabled = false;
		fs.writeFile('streamchannels.json', JSON.stringify(streamchannels.enabled), function (err) {
			if (err) return console.log(err);
			message.reply("successfully disabled the streaming service.");
		});
	}
	
	if(message.content === prefix + "stream") {
		var streamstatusreply = "";
		streamchannels.enabled === true ? streamstatusreply += "streaming is enabled, ":streamstatusreply += "streaming is disabled, ";
		streamchannels.channel === "" ? streamstatusreply += "but the stream channel is currently not set.":streamstatusreply += "stream channel is currently set to <#" + streamchannels.channel + ">";
		message.reply(streamstatusreply);
	}
	
	if(message.content.startsWith(prefix + "pa") && message.author.id == authfile.owner && !piper.includes(message.content.substring(5))) {
		message.delete();
		piper.push(message.content.substring(5));
		fs.writeFileSync("piper.json", JSON.stringify(piper));
		message.reply("successfully added piper.");
	}
	//
	
	//			== DEPCRECATED TALKCHANNEL FEATURE ==
	// bit that makes the bot send messages between two discords
	// checks if the message sender is the bot. we don't want it to be. Fuck he
	/*if(message.author.id !== authfile.bot) {
		// this is the code that sends messages between channels
		if(talkchannels.includes(message.channel.id)) {
			var urlRegex = /(\b(?:(?:https?)|(?:ftp)|(?:file)):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*(?:(?:\.jpg)|(?:\.jpeg)|(?:\.png)|(?:\.gif)))/ig;
			var person = message.guild.member(message.author);
			var roleposition = 0;
			for(var i = 0; i < person.roles.array().length; i++) {
				var lastrole = person.roles.array()[i];
				
				// assigning the role colour based on the users top role/name colour
				if(lastrole.position > roleposition && lastrole.hexColor !== "#000000") {
					roleposition = lastrole.position;
					var rolecolour = lastrole.hexColor;
				}
			}

			// this part grabs an image url from the message, either from
			// attachment or the image url itself
			if(message.attachments.array().length > 0) {
				var embedurl = message.attachments.array()[0].url;
			} else if(message.cleanContent.match(urlRegex) !== null) {
				var embedurl = message.cleanContent.match(urlRegex)[0];
			} else {
				var embedurl = '';
			}
			if(person.nickname !== null) {
				var crosslinkauthor = person.user.tag + " (" + person.nickname + ")";
			} else {
				var crosslinkauthor = person.user.tag;
			}
			
			// make the message content without any duplications
			var finalmessagecontent = message.cleanContent;
			if(finalmessagecontent.includes(embedurl)) {
				finalmessagecontent = message.cleanContent;
			} else {
				finalmessagecontent = message.cleanContent + " " + embedurl;
			}
			
			var embed = new Discord.RichEmbed()
			.setAuthor(crosslinkauthor, person.user.displayAvatarURL)
			.setColor(rolecolour)
			.setDescription(finalmessagecontent)
			.setImage(embedurl)
			.setFooter("Sent from #" + message.channel.name + " in " + message.guild.name);
		
			for(var j in talkchannels) {
				if(talkchannels[j] !== message.channel.id) {
					client.channels.get(talkchannels[j]).send({embed});
				}
			}
		}
	}*/
		
	// this is the code for adding/removing them. it's so God Damn Short !
	if(message.content === prefix + "addchannel talk" && message.author.id === authfile.owner && !talkchannels.includes(message.channel.id)) {
		talkchannels.push(message.channel.id);
		fs.writeFileSync("talkchannels.json", JSON.stringify(talkchannels));
		message.reply("successfully added channel to talk.");
	} else if(message.content === prefix + "removechannel talk" && message.author.id === authfile.owner && talkchannels.includes(message.channel.id)) {
		talkchannels.splice(message.channel.id);
		fs.writeFileSync("talkchannels.json", JSON.stringify(talkchannels));
		message.reply("successfully removed channel from talk.");
	} else if(message.content === prefix + "resetchannels talk" && message.author.id === authfile.owner) {
		for(var k = 0; k <= talkchannels; k++) {
			talkchannels.splice[k];
		}
		fs.writeFileSync("talkchannels.json", JSON.stringify(talkchannels));
		message.reply("successfully removed every channel from talk.");
	}
});

// STREAM EVENTS - uses streamchannels.json to store a channel id
/*stream.on('data', event => {
	if(streamchannels.enabled === true) {
		if(!event.extended_entities.media[0].media_url.includes("video") && event.extended_entities) {
			try {
				var embed = new Discord.RichEmbed();
				embed.setColor(event.user.profile_link_color);
				embed.setAuthor(event.user.name + " (@" + event.user.screen_name + ")", event.user.profile_image_url, "https://twitter.com/" + event.user.screen_name);
				embed.setDescription(event.text);
				
				if (event.extended_entities) {
					embed.setImage(event.extended_entities.media[0].media_url);
				}
				
				embed.setTimestamp();
				client.channels.get(streamchannels.channel).send({embed});
			} catch(er) {
				console.log(er);
			}
		}
	}
});*/

process.on('uncaughtException', function (err) {
	var d = new Date(); // for now
	d.getHours();
	d.getMinutes();
	console.log(util.inspect(err));
});

client.login(authfile.authkey).then(function() {
	console.log("successfully logged in");
}).catch(function (error) {
	console.log(error);
});

client.on('error', (error) => {
	console.error(new Date() + " Discord Client encountered an error");
	console.error(error);
});
