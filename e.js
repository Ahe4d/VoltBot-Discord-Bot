const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect:true});
var authfile = require("./auth.json");
var piper = require("./data/piper.json");
var addedchannels = require("./channel_permissions/addedchannels.json");
var nsfw = require("././channel_permissions/nsfwchannels.json");
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
var randomCat = require('random-cat');
var req = require('req-fast');
var Twitter = require('twitter');
var twclient = new Twitter({
	consumer_key: authfile.consumer_key,
	consumer_secret: authfile.consumer_secret,
	access_token_key: authfile.access_token_key,
	access_token_secret: authfile.access_token_secret
});
var stream = twclient.stream('statuses/filter', {follow: '169201749'});

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

client.on("message", function(message) {
	var input = message.content.toUpperCase();
	
	// SPAM COMMANDS - uses addedchannels.json to store channel ids
	if(addedchannels.includes(message.channel.id)) {
		if(input.includes("PIPER") && message.author.id !== authfile.bot && !message.content.includes(prefix + "piper")) {
			message.channel.send("piper");
		}
		
		if(message.content === prefix + "piper") {
		message.reply(piper[Math.floor(Math.random() * piper.length)]);
		}
		
		if(message.content.toUpperCase().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "") === "E" && message.author.id !== authfile.bot) {
			message.channel.send(message.content);
			var ranchanse = Math.floor(Math.random() * 500);
			if(ranchanse === 25) {
				message.channel.send("https://www.youtube.com/watch?v=6QctvvOQcTw")
			}
		}
	}
	//
	
	// NSFW COMMANDS - uses nsfw.json to store channels ids
	if(nsfw.includes(message.channel.id)) {
		if(message.content.startsWith(prefix + "cat")) {
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
				url: "https://danbooru.donmai.us/posts.json?tags=cat_ears%20rating:safe%20score:%3E10&random=true&limit=1",
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
		} else if(message.content.startsWith(prefix + "cat") && !nsfw.includes(message.channel.id)) {
			message.reply("This channel is not marked as nsfw!")
		}
	}
	//
	
	// EVERYTHING ELSE
	if(message.content.startsWith(prefix + "help")) {
		read('help.txt', function(err, data) {
			if(err) {
				console.log(err);
			} else {
				message.reply(data);
			}
		});
	}
	
	if(message.content === "/o/" && message.author.id !== authfile.bot) {
		message.channel.send("\\o\\");
	} else if(message.content === "\\o\\" && message.author.id !== authfile.bot) {
		message.channel.send("/o/");
	}
	
	if(message.content === "q" && message.author.id === authfile.owner) {
		message.channel.send("Emergency shutdown initiated");
		process.exit();
	}
	
	if(message.content.startsWith(prefix + "av")) {
	var mmentioned = message.mentions.users.array();
		if(mmentioned.length === 0){
			message.reply(message.author.avatarURL.replace("jpg", "png").replace("gif?size=2048", "gif").replace("gif?size=1024", "gif").replace("gif?size=512", "gif"));
		} else if(mmentioned.length > 0) {
			message.reply(mmentioned[0].avatarURL.replace("jpg", "png").replace("gif?size=2048", "gif").replace("gif?size=1024", "gif").replace("gif?size=512", "gif"));
		}
	}
	
	if(message.content.startsWith(prefix + "math")) {            
		var problem = message.content.substr(7).replace("Fahrenheit", "fahrenheit").replace("arenheit", "ahrenheit").replace("arhenheit", "ahrenheit").replace("Celsius", "celsius").replace("elcius", "elsius");
		
		for(var i = 0; i < keywords.length; ++i) {
			if(problem.includes(keywords[i]))
				return void message.reply(rejectMessage);
		}

		try {
			let mathanswer = math.round(math.eval(problem), 10);
			message.reply(math.eval(mathanswer).toString());
		} catch(error) {
			message.reply(rejectMessage);
		}
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
	
	if(message.content === prefix + "time") {
		message.channel.send(Date());
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
			message.react("👍");
			
			setTimeout(() => {
			message.react("👎");
			},250);
			
			setTimeout(() => {
			thumbsupreact = message.reactions.find(reaction => reaction.emoji.name === "👍").count - 1;
			thumbsdownreact = message.reactions.find(reaction => reaction.emoji.name === "👎").count - 1;
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
	
	if(message.content.includes("STAR PLATINUM") && message.author.id === authfile.owner) {
		message.channel.send("https://vignette3.wikia.nocookie.net/jjba/images/9/9b/SPTW_Key_Art.png/revision/latest?cb=20160515054430");
	}
	
	if(message.content === "ORA" && message.author.id === authfile.owner) {
		message.channel.send("https://i.imgur.com/1wb4XCj.gif");
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
		owo = owo.replace("any",'an');
		owo = owo.replace("nyny", "ny");
		owo = owo.replace("ny'ny", "nyny");
		owo = owo.replace("y't", "'t");
		owo = owo.replace("iony", "iony");
		owo = owo.replace("YY",'Y');
		owo = owo.replace("NYG",'NG');
		owo = owo.replace("NYT",'NT');
		owo = owo.replace("NYE",'NR');
		owo = owo.replace("ANY",'AN');
		owo = owo.replace("NYNY", "NK");
		owo = owo.replace("Y'T", "'T");
		owo = owo.replace("NYK", "NY");
		owo = owo.replace("NY'NY", "NYNY");
		owo = owo.replace("IONY", "ION");
		message.channel.send(owo + squiggle[math.abs(math.round(math.random() * squiggle.length - 1))] + " " + endowo[math.abs(math.round(math.random() * endowo.length - 1))]);
	}
	
	// useful command for checking the status of a minecraft server
	if (message.content === (prefix + "server")) {
        var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;
        request(url, function(err, response, body) {
            if(err) {
                console.log(err);
                return message.reply('Error getting Minecraft server status...');
            }
            body = JSON.parse(body);
            var status = ':x: **' + mcIP + ':' + mcPort + '** | *Minecraft server is currently offline*';
            if(body.online) {
                status = ':white_check_mark: **' + mcIP + ':' + mcPort + '** | **Minecraft** server is **online**  -  ';
                if(body.players.now) {
                    status += '**' + body.players.now + '** people are playing!';
                } else {
                    status += '*Nobody is playing!*';
                }
            }
            message.reply(status);
        });
    }
	//
	
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
				message.reply("https://random.birb.pw/img/" + body.file);
            }
        });
    }
	//
	
	if(message.content === prefix + "meow") {
		req("http://random.cat/meow", (err, resp) => {
			if(err) return void console.error(err + "\n" + message.content);
			message.channel.send(resp.body);
		});
	}
	
	if(message.content === "ZA WARUDO" && message.author.id == authfile.owner) {
		message.channel.send(":stopwatch: Time has been stopped. :stopwatch:")
		setTimeout(function(){ message.channel.send(":fast_forward: Time has begun to move again. :fast_forward:"); }, 11000);
	}
	
	if(message.content.startsWith(prefix + "pa") && message.author.id == authfile.owner && !piper.includes(message.content.substring(5))) {
		message.delete();
		piper.push(message.content.substring(5));
		fs.writeFileSync("piper.json", JSON.stringify(piper));
		message.reply("successfully added piper.");
	}
	
	if((message.content.startsWith("!eval") || message.content.startsWith("!evalr")) && authfile.includes(message.author.id) && !message.content.includes("console") && !message.content.includes("exec") && !message.content.includes("@everyone") && !message.content.includes("@here")) {    
		try {
			let evalData = eval(message.content.substr(6));
        
			if(message.content.charAt(5) === "r")
				message.reply("``" + evalData + "``");
		} catch(err) {
			message.reply("```javascript" + "\n" + err + "```");
		}
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
	
	if(message.content === prefix + "stream enable" && message.author.id == authfile.owner) {
		streamchannels.enabled = true;
		fs.writeFile('streamchannels.json', JSON.stringify(streamchannels), function (err) {
			if (err) return console.log(err);
			message.reply("successfully enabled the streaming service.");
		});
	} else if(message.content === prefix + "stream disable" && message.author.id == authfile.owner) {
		streamchannels.enabled = false;
		fs.writeFile('streamchannels.json', JSON.stringify(streamchannels), function (err) {
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
	//
});

// STREAM EVENTS - uses streamchannels.json to store a channel id
stream.on('data', event => {
	if(streamchannels.enabled === true) {
		if(!event.extended_entities.media[0].media_url.includes("video") && event.extended_entities !== undefined) {
			try {
				client.channels.get(streamchannels.channel).send(event.extended_entities.media[0].media_url + ":orig");
			} catch(er) {
				console.log(er);
			}
		}
	}
});
//

process.on('uncaughtException', function (err) {
	var d = new Date(); // for now
	d.getHours();
	d.getMinutes();
	console.log('Caught exception: ' + err + ' at ' + d);
});

client.login(authfile.authkey).then(function() {
	console.log("successfully logged in");
}).catch(function (error) {
	console.log(error);
});