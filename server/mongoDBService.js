const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: axios } = require("axios");
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
    let data = {};
    await client.connect();
    const cursor = await client.db("planners-directory").collection("users").find({ "email": email });
    await cursor.forEach(async (item) => {
        let user = item;
        await bcrypt.compare(password, user.password, async function (err, result) {
            if (result) {
                const accessToken = await jwt.sign({ email: user.email, type: user.userRole, store: user.storeName }, accessTokenSecret);
                data = { "success": true, "token": `Bearer ${accessToken}` };
                res.send(data);
            } else {
                data = { "password": "Password incorrect" };
                res.status(401).send(data);
            }
        });
    });

    cursor.count(function (err, count) {
        if (!count) {
            res.status(401).send({ email: "User not found" });
        }
    });
}

module.exports.getProfile = async (email, res) => {
    await client.connect();
    const cursor = await client.db("planners-directory").collection("profile").find({ "user.email": email });
    await cursor.forEach((item) => {
        res.send(item);
    });
    cursor.count(function (err, count) {
        if (!count) {
            res.send(null);
        }
    });
}

module.exports.getPackages = async (email, res) => {
    await client.connect();
    const profile = await client.db("planners-directory").collection("profile").find({ "user.email": email });
    await profile.forEach(async (item) => {
        const packages = await client.db("planners-directory").collection("packages").find({ "user": item.user._id });
        await packages.forEach(package => {
            res.send(package);
        })
        res.send({});
    });
}

module.exports.getCountries = async (continent, res) => {
    await client.connect();
    continent = continent.charAt(0).toUpperCase() + continent.slice(1);
    const countries = await client.db("planners-directory").collection("countries").find({ "continent": continent });
    let data = [];
    await countries.forEach(country => data.push(country));
    res.send(data);
}

module.exports.getContinents = async (res) => {
    await client.connect();
    const continents = await client.db("planners-directory").collection("continents").find({});
    let data = [];
    await continents.forEach(continent => data.push(continent));
    res.send(data);
}

module.exports.getStates = async (code, res) => {
    await client.connect();
    let id = "";
    const cursor = await client.db("planners-directory").collection("countries").find({ "sortname": code });
    await cursor.forEach(item => {
        id = `${item.id}`;
    })

    const states = await client.db("planners-directory").collection("states").find({ "country_id": id });
    let data = [];
    await states.forEach(state => data.push(state));
    res.send(data);
}

module.exports.getCities = async (state_id, res) => {
    await client.connect();
    const cities = await client.db("planners-directory").collection("cities").find({ "state_id": state_id });
    let data = [];
    await cities.forEach(city => data.push(city));
    res.send(data);
}

module.exports.registerUser = async (data, res) => {
    await client.connect();

    let password = data.password;
    if (data.password !== data.password2) {
        res.send({ password2: "Passwords must match" });
    }

    const usersExists = await client.db("planners-directory").collection("users").countDocuments({ "email": data.email });

    if (usersExists) {
        res.status(400).send({ "email": "Email already exists" });
        return;
    }

    await bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (err) {
            res.status(500).send({});
        }

        let user = {
            "profileCreated": true,
            "profileCompleted": false,
            "featuresCompleted": false,
            "liveProfile": false,
            "email": data.email,
            "password": hash,
            "storeName": data.store,
            "userRole": data.type,
            "date": new Date().toISOString()
        };

        await client.db("planners-directory").collection("users").insertOne(user);
        const users = await client.db("planners-directory").collection("users").find({ "email": user.email });
        await users.forEach(item => {
            res.send(item);
        })
        res.status(500).send({});
    });
}

module.exports.registerPlanner = async (data, email, res) => {
    await client.connect();
    if (!data.city || !data.firstName || !data.lastName || !data.phoneNo1 || !data.streetAdress1) {
        res.status(400).send({ "firstName": "First Name is Required", "lastName": "Last Name is Required", "phoneno1": "Phone is Required", "streetAdress1": "Street Adress 1 is Required", "city": "City is Required" });
    } else {
        const users = await client.db("planners-directory").collection("users").find({ "email": email });
        let user = {};
        await users.forEach(item => user = item);
        let profile = {
            "images": {
                "image1": "",
                "image2": "",
                "image3": "",
                "image4": "",
                "image5": ""
            },
            "branchOffice": false,
            "branchOffice1": false,
            "branchOffice2": false,
            "branchOffice3": false,
            "keywords": [],
            "liveProfile": false,
            "user": user,
            "storeName": user.storeName,
            "email": user.email,
            "date": new Date().toISOString(),
            "categories": [],
            "eventTypes": [],
            "businessTitle": "",
            "description": "",
            "targetMarket": "",
            "title": ""
        };

        profile = { ...data, ...profile };
        const result = await client.db("planners-directory").collection("profile").insertOne(profile);
        if (result.insertedCount) {
            res.send({ "message": "Successfully Created Profile and Update User" });
        } else {
            res.status(500).send({});
        }
    }
}

module.exports.updateProfile = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email })
    let profile = {};
    await profiles.forEach(item => profile = item);
    profile.user.profileCompleted = true;
    profile = { ...profile, ...data };
    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
    const result = await client.db("planners-directory").collection("profile").find({ "email": email });
    await client.db("planners-directory").collection("users").updateOne({ "email": email }, { $set: { profileCompleted: true } }, { upsert: false });
    await result.forEach(item => res.send(item));
    res.status(500).send({});
}

module.exports.getNoticeBoard = async (res) => {
    await client.connect();
    const noticeboard = await client.db("planners-directory").collection("noticeboard").find({});
    let data = [];
    await noticeboard.forEach(item => data.push(item));
    res.send(data);
}

module.exports.addPackages = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    await profiles.forEach(async profile => {
        data.user = profile.user._id;
        const existingPackage = await client.db("planners-directory").collection("packages").find({user: data.user});
        existingPackage.count(async (e, t) => {
            if(!t) {
                await client.db("planners-directory").collection("packages").insertOne(data);
                const package_c = await client.db("planners-directory").collection("packages").find({user: data.user});
                let package = {};
                await package_c.forEach(async item => {
                    package = item;
                    profile.packages = package;
                    profile.liveProfile = true;
                    profile.user.liveProfile = true;
                    profile.user.featuresCompleted = true;
                    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                    await client.db("planners-directory").collection("users").updateOne({ "email": email }, {$set: {liveProfile: true, featuresCompleted: true}}, { upsert: false });
                    res.send(profile);
                });
                package_c.count((err, t) => {
                    if(!t) {
                        res.send({});
                    }
                });
            } else {
                await existingPackage.forEach(async package => {
                    package = {...package, ...data};
                    await client.db("planners-directory").collection("packages").replaceOne({user: data.user}, package, { upsert: true });
                    profile.packages = package;
                    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                    res.send(profile);
                });
            }
        });
 
    });
    profiles.count((err, t) => {
        if(!t) {
            res.send({});
        }
    });

}

module.exports.addImages = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    await profiles.forEach(profile => {
        profile.images = { ...profile.images, ...data };
        client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
        res.send(profile);
    })
    profiles.count((err, t) => {
        if(!t) {
            res.send({});
        }
    });
}

module.exports.updateKeywords = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    await profiles.forEach(profile => {
        profile.keywords = data.tags;
        client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
        res.send(profile);
    })
    profiles.count((err, t) => {
        if(!t) {
            res.send({});
        }
    });
}

module.exports.updateOffice = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    if(Number(data.st)) {
        const states = await client.db("planners-directory").collection("states").find({ "id": data.st });
        states.forEach(async st => {
            data.st = st.name;
            await profiles.forEach(profile => {
                profile = { ...profile, ...data };
                client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                res.send(profile);
            });
            profiles.count((err, t) => {
                if(!t) {
                    res.send({});
                }
            });
        })
    } else {
        await profiles.forEach(profile => {
            profile = { ...profile, ...data };
            for(let i = 1; i < 4; i++) {
                if(!data["branchOffice"+i] && profile["branchOffice"+i]) {
                    profile["branchOffice"+i] = false;
                    delete profile["branchOfficeData"+i];
                }
            }
            client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
            res.send(profile);
        });
        profiles.count((err, t) => {
            if(!t) {
                res.send({});
            }
        });
    }

}

module.exports.resetPassword = async (data, email, res) => {
    await client.connect();

    let password = data.newPass;
    if (password !== data.newPass2) {
        res.send({ password2: "Passwords must match" });
    }

    const userCur = await client.db("planners-directory").collection("users").find({ "email": email });

    userCur.forEach(async user => {
        await bcrypt.compare(data.oldPass, user.password, async function (err, result) {
            console.log(data.oldPass, user.password, result, err);
            if (result) {
                await bcrypt.hash(password, saltRounds, async function (err, hash) {
                    if (err) {
                        res.status(500).send({});
                    }
                    user.password = hash;
                    await client.db("planners-directory").collection("users").replaceOne({ "email": user.email }, user, {upsert: false});
                    await client.db("planners-directory").collection("profile").updateOne({"email": user.email}, {$set: {"user.password" : hash}}, {upsert: false});
                    res.send({message: "Successfully Updated the Password"});
                });
            } else {
                data = { "password": "Password incorrect" };
                res.status(401).send(data);
            }
        });
    })

    await user.count((err, t) => {
        if (!t) {
            res.status(400).send({ "email": "Email don't exists" });
            return;
        }
    })
}

module.exports.addServices = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    await profiles.forEach(async profile => {
        data.user = profile.user._id;
        const existingServices = await client.db("planners-directory").collection("services").find({user: data.user});
        existingServices.count(async (e, t) => {
            if(!t) {
                await client.db("planners-directory").collection("services").insertOne(data);
                const services_c = await client.db("planners-directory").collection("services").find({user: data.user});
                let services = {};
                await services_c.forEach(async item => {
                    services = item;
                    profile.services = services;
                    profile.liveProfile = true;
                    profile.user.liveProfile = true;
                    profile.user.featuresCompleted = true;
                    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                    await client.db("planners-directory").collection("users").updateOne({ "email": email }, {$set: {liveProfile: true, featuresCompleted: true}}, { upsert: false });
                    res.send({services, vendor: {...profile}});
                });
                services_c.count((err, t) => {
                    if(!t) {
                        res.send({});
                    }
                });
            } else {
                await existingServices.forEach(async services => {
                    services = {...services, ...data};
                    await client.db("planners-directory").collection("services").replaceOne({user: data.user}, services, { upsert: true });
                    profile.services = services;
                    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                    res.send({services, vendor: {...profile}});
                });
            }
        });
 
    });
    profiles.count((err, t) => {
        if(!t) {
            res.send({});
        }
    });

}

module.exports.getServices = async (email, res) => {
    await client.connect();
    const profile = await client.db("planners-directory").collection("profile").find({ "user.email": email });
    await profile.forEach(async (item) => {
        const services = await client.db("planners-directory").collection("services").find({ "user": item.user._id });
        await services.forEach(service => {
            res.send(service);
        })
        res.send({});
    });
}