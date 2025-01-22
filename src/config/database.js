const mongoose = require('mongoose');

const connectDb = async () => {
await mongoose.connect('mongodb+srv://harshitbrijwasi:fCB8m38kerrr5RZy@namastenodejs.dbvln.mongodb.net/devTinder');
}
module.exports = connectDb;