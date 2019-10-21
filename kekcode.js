/*jshint esversion: 6 */

const Discord = require('discord.js');
const bot = new Discord.Client();
const morse = require("morse-code-converter");
const download = require('image-downloader');
const kekid = "220637968463822848"
const fs = require('fs');
let token;
fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    token = data;
});


replaceAll = function (string, search, replacement) {
    return string.replace(new RegExp(search, 'g'), replacement);
};

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.toLowerCase().startsWith("kek")) {
        const kekcode = msg.content.substr(4);
        if (kekcode.replace(/ /g, "") === "") return;

        if (msg.author.id === kekid && msg.content === "kekkek") {
            if (msg.member.voiceChannel) {
                msg.member.voiceChannel.join().then(connection => {
                    const dispatcher = connection.playFile(__dirname + '/kek.mp3');

                    dispatcher.on('end', () => {
                        msg.member.voiceChannel.leave();
                    });

                    dispatcher.setVolume(0.5); // Set the volume to 50%
                    dispatcher.on('error', e => {
                        // Catch any errors that may arise
                        console.log(e);
                    });
                }).catch(function (e) {
                    console.error(e);
                });
            }
        } else if (msg.author.id === kekid && msg.channel.type !== "dm") {
            console.log("Kek is back at it again");
            if (msg.content.length <= 15) return;
            return decodeKek(msg.content, msg);
        } else if (kekcode.toLowerCase().startsWith("kek")) {
            console.log("Is it kekcode?");
            kekarray = kekcode.toLowerCase().split("kek");
            let filtered = kekarray.filter(function (value, index, arr) {
                return value.indexOf("kek") === -1;
            });

            filtered = filtered.join("");
            filtered = filtered.replace(/ /g, "");

            if (filtered === "") {
                console.log("It is kekcode!");
                return decodeKek(kekcode, msg);
            } else if (kekcode.replace(/ /g, "") !== "") {
                console.log("It is not kekcode!");
                return encodeKek(kekcode, msg);
            }

        } else if (!kekcode.toLowerCase().startsWith("kek")) {
            return encodeKek(kekcode, msg);
        }
    }

    cmd = msg.content;
    const resource = cmd.split(' ')[1];

    if (msg.author.id !== kekid && msg.author.id !== "105640584470937600") return;
    if (cmd.startsWith('pic') || cmd.startsWith('picture') || cmd.startsWith('avatar')) {

        let filename;
        if (String(resource).includes('.jpg')) filename = 'avatar.jpg';
        else filename = 'avatar.png';

        const options = {
            url: resource,
            dest: filename,
            followAllRedirects: 'true'
        }

        download.image(options)
            .then(({
                filename,
                image
            }) => {
                bot.user.setAvatar(filename).then(() => {
                    msg.reply("Avatar has been updated!");
                });
            }).catch((err) => {
                throw err;
            });
    }
});

function decodeKek(kekcode, msg) {
    console.log("Kekcode detected attempting to translate");
    let text = kekcode.replace(/kek/g, ".").replace(/KEK/g, "-");
    text = morse.morseToText(text).toLowerCase();
    console.log("Translation successful... sending message");
    msg.channel.send("Here is the decoded kek \n**" + text + "**");
}

function encodeKek(kekcode, msg) {
    if (msg.channel.type !== "dm") return msg.reply("Please use the encoding feature in a Direct Message (DM) with the bot.");
    console.log("English detected attempting to translate");
    const morsecode = morse.textToMorse(kekcode);
    const translated = morsecode.replace(/-/g, "KEK").replace(/\./g, "kek");
    console.log("Translation successful... sending message");
    msg.channel.send("Here is your kek code \n**" + translated + "**");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

bot.login(token);