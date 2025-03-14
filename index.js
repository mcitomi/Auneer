import portAudio, { getDevices, AudioIO, SampleFormat16Bit } from "naudiodon"; // https://github.com/Streampunk/naudiodon
import fs from "fs";
import Speaker from "speaker";
import ytdl from "@distube/ytdl-core";
import ffmpeg from "fluent-ffmpeg";

console.log(getDevices());

// Audio recorder

// Create an instance of AudioIO with inOptions (defaults are as below), which will return a ReadableStream
// var ai = new AudioIO({
//     inOptions: {
//         maxQueue: 1,
//         channelCount: 2,
//         sampleFormat: portAudio.SampleFormat16Bit,
//         sampleRate: 44100,
//         // deviceId: 3, // Use -1 or omit the deviceId to select the default device -- stereomix
//         deviceId: 6, // Use -1 or omit the deviceId to select the default device -- cable output
//         closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
//     }
// });


// Audio outputs

// var ao = new portAudio.AudioIO({
//     outOptions: {
//         maxQueue: 1,
//         channelCount: 2,
//         sampleFormat: portAudio.SampleFormat16Bit,
//         sampleRate: 44100,
//         deviceId: -1, // Use -1 or omit the deviceId to select the default device
//         closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
//     }
// });

const speaker = new Speaker({
    channels: 2,          // 2 channels
    bitDepth: 16,         // 16-bit samples
    sampleRate: 44100,     // 44,100 Hz sample rate
});

// ao.start();
// ai.start();

// //Start streaming
// ai.pipe(speaker);

// ai.on('data', buf => console.log(buf.timestamp));

const stream = ytdl("https://www.youtube.com/watch?v=db2uW32fkVM", {
    quality: 'highestaudio',
    filter: 'audioonly',
    highWaterMark: 1 << 27,  // 128mb buffer
    timeout: 60000          
});

// stream.pipe(fs.createWriteStream("writed.mp4"));


ffmpeg(stream)
    .audioCodec('pcm_s16le')  // Decode as 16-bit PCM
    .format('s16le')           // Format as raw PCM
    .pipe(speaker, { end: false }); // Pipe the raw PCM data to the speaker

console.log("started");


// setTimeout(() => {
//     ai.quit();
//     console.log("stopped");

// }, 10000);