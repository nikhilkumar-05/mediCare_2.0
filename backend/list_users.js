const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const UserSchema = new mongoose.Schema({ email: String, role: String });
        const User = mongoose.model('User', UserSchema);
        const users = await User.find({}, 'email role');
        console.log(users);
        process.exit(0);
    });
