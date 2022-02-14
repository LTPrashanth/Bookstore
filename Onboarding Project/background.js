const Queue = require('bull');
const redis = require('redis');
const mongoose = require('mongoose');
const Book = require('./models/books');

// const client = redis.createClient()

// client.on("error", (err) => {
//     console.log(err);
// })

const sendNotifQueue = new Queue("notif");

// const options = {
//     repeat: {
//         every: 100000
//     }
// }

// const doJob = async ()  => {
//     const books = await Book.find();
//     books.forEach(async element => {
//         if(element.stock <= 2) {
//             console.log("Restock '" + element.title + "' books");
//         }
//     });

//     console.log(Date.now());
// }

// stockUpdateQueue.add({}, options);

sendNotifQueue.process(async (job) => {
    console.log("Restock " + job.data.title + " (" + job.data.bookId + ")");
})
