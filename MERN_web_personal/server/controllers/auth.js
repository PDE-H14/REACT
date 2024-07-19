const bcrypt = require("bcryptjs")
const User = require("../models/user")
const jwt = require("../utils/jwt")

function register(req, res) {
    
    const { firstname, lastname, email, password } = req.body;

    if (!email) res.status(400).send({msg: "El email es obligatorio."})
    if (!password) res.status(400).send({msg: "La contraseña es obligatoria."})
    
    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active: false
    });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    user.save((error, userStorage) => {
        if (error){
            res.status(400).send({msg: "Error al registrar usuario."})
        } else {
            res.status(200).send(userStorage)
        }
    });
}

function login(req, res){
    const { email, password} =req.body
    if (!email) res.status(400).send({msg: "El email es obligatorio."})
    if (!password) res.status(400).send({msg: "La contraseña es obligatoria."})
        
    const emailLowerCase = email.toLowerCase()

    User.findOne({email: emailLowerCase}, (error, userStorage) => {
        if(error){
            res.status(500).send({msg: "Error del servidor."})
        } else {
            bcrypt.compare(password, userStorage.password, (bcryptError, check) => {
                if (bcryptError){
                    res.status(500).send({msg: "Error en el servidor"})
                } else if (!check) {
                    res.status(400).send({msg: "Correo o contraseña incorrectos"})
                } else if (!userStorage.active) {
                    res.status(401).send({msg: "Usuario no autorizado o no activo"})
                } else {
                    res.status(200).send({
                        acces: jwt.createAccesToken(userStorage),
                        refresh : jwt.createRefreshToken(userStorage)
                    });
                }
            });
        }
    });
}

function refreshAccessToken(req, res){
    const { token } = req.body;

    if (!token) res.status(400).send({msg: "Token requerido."})
    else {
        const { user_id } = jwt.decoded(token);

        User.findOne({_id: user_id}, (error, userStorage) => {
            if (error) {
                res.status(500).send({msg: "Error del servidor"})
            } else {
                res.status(200).send({
                    accessToken: jwt.createAccesToken(userStorage)
                });
            }
        });
    }
}

module.exports = {
    register,
    login,
    refreshAccessToken
}