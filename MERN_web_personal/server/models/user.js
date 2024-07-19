const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    role: String,
    active: Boolean,
    avatar: String
});

module.exports = mongoose.model("User", UserSchema)

/*
{
    "firstname": "Porfirio",
    "lastname": "Escamilla",
    "email": "escamilla.huerta.porfirio@gmail.com",
    "password": "1234",
    "role": "admin",
    "active": false,
    "avatar": "PDE-H14"
}
*/