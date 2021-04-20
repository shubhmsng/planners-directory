const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const accessTokenSecret = process.env.JWT_SECRET;

const MongoURL = `mongodb+srv://admin:${process.env.MDB_PASSWORD}@cluster1.ngl5t.mongodb.net/?authMechanism=DEFAULT`;

const client = new MongoClient(MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports.getAdminData = async () => {
    let data = {};
    await client.connect();
    const cursor = await client.db("planners-directory").collection("admin").find({});
    await cursor.forEach(item => {
        data = item;
    });
    return data;
};

module.exports.getUser = async (email, password, res) => {
    let  data = {};
    await client.connect();
    const cursor = await client.db("planners-directory").collection("profile").find({"user.email" : email});
    await cursor.forEach(async (item) => {
        let user = item.user;
        await bcrypt.compare(password, user.password, async function(err, result) {
            if(result) {
                const accessToken = await jwt.sign({ email: user.email }, accessTokenSecret);
                data = {"success":true,"token":`Bearer ${accessToken}`};
                res.status(200).send(data);
            } else {
                data = {"password":"Password incorrect"};
                res.status(400).send(data);
            }
        });
    });
}

module.exports.getProfile = async (email, res) => {
    let  data = {};
    await client.connect();
    const cursor = await client.db("planners-directory").collection("profile").find({"user.email" : email});
    await cursor.forEach(async (item) => {
        res.send(item);
    });
    res.status(400);
}

module.exports.getPackages = async (email, res) => {
    await client.connect();
    const profile = await client.db("planners-directory").collection("profile").find({"user.email" : email});
    await profile.forEach(async (item) => {
        const packages = await client.db("planners-directory").collection("packages").find({"user" : item.user._id});
        await packages.forEach(package => {
            res.send(package);
        })
        res.send({});
    });
}
