const { MongoClient, ObjectId } = require("mongodb");
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
    let data = {};
    await client.connect();
    const cursor = await client.db("planners-directory").collection("users").find({ "email": email });
    await cursor.forEach(async (item) => {
        let user = item;
        await bcrypt.compare(password, user.password, async function (err, result) {
            if (result) {
                const accessToken = await jwt.sign({ email: user.email, type: user.userRole, store: user.storeName }, accessTokenSecret);
                data = { "success": true, "token": `Bearer ${accessToken}` };
                try{
                    res.send(data).end();
                } catch(e) {}
            } else {
                data = { "password": "Password incorrect" };
                try{
                    res.status(401).send(data).end();
                } catch(e) {}
                
            }
        });
    });

    cursor.count(function (err, count) {
        if (!count) {
            try{
                res.status(401).send({ email: "User not found" }).end();
            } catch(e) {}
        }
    });
}

module.exports.getProfile = async (email, res) => {
    await client.connect();
    const cursor = await client.db("planners-directory").collection("profile").find({ "user.email": email });
    await cursor.forEach((item) => {
        try{
            res.send(item).end();
        } catch(e){}
    });
    cursor.count(function (err, count) {
        if (!count) {
            try {
                res.send(null).end();
            } catch(e){}
        }
    });
}

module.exports.getPackages = async (email, res) => {
    await client.connect();
    const profile = await client.db("planners-directory").collection("profile").find({ "user.email": email });
    await profile.forEach(async (item) => {
        const packages = await client.db("planners-directory").collection("packages").find({ "user": item.user._id });
        await packages.forEach(package => {
            try{
                res.send(package).end();
            } catch(err) {}

        })
        try{
            res.send({}).end();
        } catch (e) {}
    });
}

module.exports.getCountries = async (continent, res) => {
    await client.connect();
    continent = continent.charAt(0).toUpperCase() + continent.slice(1);
    const countries = await client.db("planners-directory").collection("countries").find({ "continent": continent });
    let data = [];
    await countries.forEach(country => data.push(country));
    try{
        res.send(data).end();    
    } catch(err) {}
}

module.exports.getContinents = async (res, isBlocked) => {
    await client.connect();
    if (isBlocked === true || isBlocked === false) {
        const continents = await client.db("planners-directory").collection("continents").find({ isBlocked });
        let data = [];
        await continents.forEach(continent => data.push(continent));
        try{
            res.send(data).end();
        } catch(e) {}

    } else {
        const continents = await client.db("planners-directory").collection("continents").find({});
        let data = [];
        await continents.forEach(continent => data.push(continent));
        try {
            res.send(data).end();            
        } catch (error) {
        }

    }

}

module.exports.updateContinents = async (res, data, isBlocked) => {
    await client.connect();
    await client.db("planners-directory").collection("continents").updateOne({ continent: data.continent }, { $set: { isBlocked } });
    const continents = await client.db("planners-directory").collection("continents").find({});
    let res_data = [];
    await continents.forEach(continent => res_data.push(continent));
    try {
        res.send(res_data).end();        
    } catch (error) {
        
    }
}

module.exports.getCountriesByStatus = async (res, isBlocked) => {
    await client.connect();
    const countries = await client.db("planners-directory").collection("countries").find({ isBlocked: isBlocked });
    let data = [];
    await countries.forEach(country => data.push(country));
    try {
        res.send(data).end();        
    } catch (error) {
        
    }
}

module.exports.blockCountry = async (data, res, isBlocked) => {
    await client.connect();
    await client.db("planners-directory").collection("countries").updateOne({ sortname: data.country }, { $set: { isBlocked } });
    if (isBlocked) {
        try {
            res.send({ message: "Successfully Blocked the Country" }).end();            
        } catch (error) {
            
        }
    } else {
        try {
            res.send({ message: "Successfully Unblocked the Country" }).end();            
        } catch (error) {
            
        }

    }

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
    try {
        res.send(data).end();        
    } catch (error) {
        
    }
}

module.exports.getCities = async (state_id, res) => {
    await client.connect();
    const cities = await client.db("planners-directory").collection("cities").find({ "state_id": state_id });
    let data = [];
    await cities.forEach(city => data.push(city));
    try {
        res.send(data).end();        
    } catch (error) {
        
    }

}

module.exports.registerUser = async (data, res) => {
    await client.connect();

    let password = data.password;
    if (data.password !== data.password2) {
        res.send({ password2: "Passwords must match" }).end();
        return;
    }

    const usersExists = await client.db("planners-directory").collection("users").countDocuments({ "email": data.email });

    if (usersExists) {
        res.status(400).send({ "email": "Email already exists" }).end();
        return;
    }

    await bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (err) {
            try {
                res.status(500).send({}).end();                
            } catch (error) {
                
            }
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
            try {
                res.send(item).end();                
            } catch (error) {
                
            }
        })
        try {
            res.status(500).send({}).end();            
        } catch (error) {
            
        }
    });
}

module.exports.registerPlanner = async (data, email, res) => {
    await client.connect();
    if (!data.city || !data.firstName || !data.lastName || !data.phoneNo1 || !data.streetAdress1) {
        res.status(400).send({ "firstName": "First Name is Required", "lastName": "Last Name is Required", "phoneno1": "Phone is Required", "streetAdress1": "Street Adress 1 is Required", "city": "City is Required" }).end();
        return;
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
            try {
                res.send({ "message": "Successfully Created Profile and Update User" }).end();                
            } catch (error) {
                
            }
        } else {
            try {
                res.status(500).send({}).end();                
            } catch (error) {
                
            }
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
    await result.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }
    }).end();
    try {
        res.status(500).send({}).end();        
    } catch (error) {
        
    }
}

module.exports.getNoticeBoard = async (res) => {
    await client.connect();
    const noticeboard = await client.db("planners-directory").collection("noticeboard").find({});
    let data = [];
    await noticeboard.forEach(item => data.push(item));
    try {
        res.send(data).end();        
    } catch (error) {
        
    }

}

module.exports.addPackages = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    await profiles.forEach(async profile => {
        data.user = profile.user._id;
        const existingPackage = await client.db("planners-directory").collection("packages").find({ user: data.user });
        existingPackage.count(async (e, t) => {
            if (!t) {
                await client.db("planners-directory").collection("packages").insertOne(data);
                const package_c = await client.db("planners-directory").collection("packages").find({ user: data.user });
                let package = {};
                await package_c.forEach(async item => {
                    package = item;
                    profile.packages = package;
                    profile.liveProfile = true;
                    profile.user.liveProfile = true;
                    profile.user.featuresCompleted = true;
                    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                    await client.db("planners-directory").collection("users").updateOne({ "email": email }, { $set: { liveProfile: true, featuresCompleted: true } }, { upsert: false });
                    try {
                        res.send(profile).end();                        
                    } catch (error) {
                        
                    }
                });
                package_c.count((err, t) => {
                    if (!t) {
                        try {
                            res.send({}).end();                            
                        } catch (error) {
                            
                        }
                    }
                });
            } else {
                await existingPackage.forEach(async package => {
                    package = { ...package, ...data };
                    await client.db("planners-directory").collection("packages").replaceOne({ user: data.user }, package, { upsert: true });
                    profile.packages = package;
                    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                    try {
                        res.send(profile).end();                        
                    } catch (error) {
                        
                    }
                });
            }
        });

    });
    profiles.count((err, t) => {
        if (!t) {
            try {
                res.send({}).end();                
            } catch (error) {
                
            }
        }
    });

}

module.exports.addImages = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    await profiles.forEach(profile => {
        profile.images = { ...profile.images, ...data };
        client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
        try {
            res.send(profile).end();            
        } catch (error) {
            
        }
    })
    profiles.count((err, t) => {
        if (!t) {
            try {
                res.send({}).end();                
            } catch (error) {
                
            }
        }
    });
}

module.exports.updateKeywords = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    await profiles.forEach(profile => {
        profile.keywords = data.tags;
        client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
        try {
            res.send(profile);            
        } catch (error) {
            
        }

    })
    profiles.count((err, t) => {
        if (!t) {
            try {
                res.send({});                
            } catch (error) {
                
            }
        }
    });
}

module.exports.updateOffice = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    if (Number(data.st)) {
        const states = await client.db("planners-directory").collection("states").find({ "id": data.st });
        states.forEach(async st => {
            data.st = st.name;
            await profiles.forEach(profile => {
                profile = { ...profile, ...data };
                client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                try {
                    res.send(profile);                    
                } catch (error) {
                    
                }

            });
            profiles.count((err, t) => {
                try {
                    if (!t) {
                        res.send({});
                    }                    
                } catch (error) {
                    
                }

            });
        })
    } else {
        await profiles.forEach(profile => {
            profile = { ...profile, ...data };
            for (let i = 1; i < 4; i++) {
                if (!data["branchOffice" + i] && profile["branchOffice" + i]) {
                    profile["branchOffice" + i] = false;
                    delete profile["branchOfficeData" + i];
                }
            }
            client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
            try {
                res.send(profile);                
            } catch (error) {
                
            }

        });
        profiles.count((err, t) => {
            if (!t) {
                try {
                    res.send({});                    
                } catch (error) {
                    
                }
            }
        });
    }

}

module.exports.resetPassword = async (data, email, res) => {
    await client.connect();

    let password = data.newPass;
    if (password !== data.newPass2) {
        res.send({ password2: "Passwords must match" });
        return;
    }

    const userCur = await client.db("planners-directory").collection("users").find({ "email": email });

    userCur.forEach(async user => {
        await bcrypt.compare(data.oldPass, user.password, async function (err, result) {
            console.log(data.oldPass, user.password, result, err);
            if (result) {
                await bcrypt.hash(password, saltRounds, async function (err, hash) {
                    if (err) {
                        try {
                            res.status(500).send({});                            
                        } catch (error) {
                            
                        }
                    }
                    user.password = hash;
                    await client.db("planners-directory").collection("users").replaceOne({ "email": user.email }, user, { upsert: false });
                    await client.db("planners-directory").collection("profile").updateOne({ "email": user.email }, { $set: { "user.password": hash } }, { upsert: false });
                    try {
                        res.send({ message: "Successfully Updated the Password" });                        
                    } catch (error) {
                        
                    }
                });
            } else {
                data = { "password": "Password incorrect" };
                try {
                    res.status(401).send(data);                    
                } catch (error) {
                    
                }

            }
        });
    })

    await userCur.count((err, t) => {
        if (!t) {
            try {
                res.status(400).send({ "email": "Email don't exists" });                
            } catch (error) {
                
            }
            return;
        }
    })
}

module.exports.addServices = async (data, email, res) => {
    await client.connect();
    const profiles = await client.db("planners-directory").collection("profile").find({ "email": email });
    await profiles.forEach(async profile => {
        data.user = profile.user._id;
        const existingServices = await client.db("planners-directory").collection("services").find({ user: data.user });
        existingServices.count(async (e, t) => {
            if (!t) {
                await client.db("planners-directory").collection("services").insertOne(data);
                const services_c = await client.db("planners-directory").collection("services").find({ user: data.user });
                let services = {};
                await services_c.forEach(async item => {
                    services = item;
                    profile.services = services;
                    profile.liveProfile = true;
                    profile.user.liveProfile = true;
                    profile.user.featuresCompleted = true;
                    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                    await client.db("planners-directory").collection("users").updateOne({ "email": email }, { $set: { liveProfile: true, featuresCompleted: true } }, { upsert: false });
                    try {
                        res.send({ services, vendor: { ...profile } });                        
                    } catch (error) {
                        
                    }

                });
                services_c.count((err, t) => {
                    if (!t) {
                        try {
                            res.send({});
                        } catch (error) {
                            
                        }
                    }
                });
            } else {
                await existingServices.forEach(async services => {
                    services = { ...services, ...data };
                    await client.db("planners-directory").collection("services").replaceOne({ user: data.user }, services, { upsert: true });
                    profile.services = services;
                    await client.db("planners-directory").collection("profile").replaceOne({ "email": email }, profile, { upsert: true });
                    try {
                        res.send({ services, vendor: { ...profile } });                        
                    } catch (error) {
                        
                    }

                });
            }
        });

    });
    profiles.count((err, t) => {
        if (!t) {
            try {
                res.send({});                
            } catch (error) {
                
            }

        }
    });

}

module.exports.getServices = async (email, res) => {
    await client.connect();
    const profile = await client.db("planners-directory").collection("profile").find({ "user.email": email });
    await profile.forEach(async (item) => {
        const services = await client.db("planners-directory").collection("services").find({ "user": item.user._id });
        await services.forEach(service => {
            try {
                res.send(service);                
            } catch (error) {
                
            }
        })
        try {
            res.send({});            
        } catch (error) {
            
        }

    });
}

module.exports.addNoticeBoard = async (data, res) => {
    await client.connect();
    data.date = new Date().toISOString()
    data.description = data.desc;
    delete data["desc"];
    await client.db("planners-directory").collection("noticeboard").insertOne(data);
    try {
        res.send({ status: "Noticeboard added successfully" });        
    } catch (error) {
        
    }

}

module.exports.updateAdminPackages = async (data, res) => {
    await client.connect();
    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $set: { packages: { ...data } } });
    res.send({ message: "Succcessfully Updated Packages" });
}

module.exports.addCategories = async (data, res) => {
    await client.connect();

    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $push: { categories: { _id: ObjectId(), label: data.category } } });
    const adminData = client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }
    });
}

module.exports.removeCategories = async (data, res) => {
    await client.connect();
    const _id = ObjectId(data.id);
    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $pull: { categories: { _id } } });
    const adminData = await client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => { 
        try {
            res.send(item)            
        } catch (error) {
            
        }
    });
}

module.exports.addEventType = async (data, res) => {
    await client.connect();

    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $push: { eventTypes: { _id: ObjectId(), label: data.eventType } } });
    const adminData = client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }

    });
}

module.exports.removeEventType = async (data, res) => {
    await client.connect();
    const _id = ObjectId(data.id);
    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $pull: { eventTypes: { _id } } });
    const adminData = await client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }
    });
}

module.exports.addCatering = async (data, res) => {
    await client.connect();

    add_catering = {};
    add_catering.label = data.label;
    add_catering.value = Number(data.catering);
    add_catering._id = ObjectId();

    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $push: { catering: add_catering } });
    const adminData = client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }
    });
}

module.exports.removeCatering = async (data, res) => {
    await client.connect();
    const _id = ObjectId(data.id);
    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $pull: { catering: { _id } } });
    const adminData = await client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }
    });
}

module.exports.updateAboutUs = async (data, res) => {
    await client.connect();
    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $set: { aboutUs: data.content } });
    const adminData = await client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }

    });
}

module.exports.updateTnC = async (data, res) => {
    await client.connect();
    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $set: { terms: data.content } });
    const adminData = await client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }

    });
}

module.exports.updatePP = async (data, res) => {
    await client.connect();
    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $set: { pp: data.content } });
    const adminData = await client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }
    });
}

module.exports.updateWebsiteBg = async (data, res) => {
    await client.connect();
    await client.db("planners-directory").collection("admin").updateOne({ _id: "5cecf2ad4b3d503a2ccb7d40" }, { $set: { ...data } });
    const adminData = await client.db("planners-directory").collection("admin").find({ _id: "5cecf2ad4b3d503a2ccb7d40" });
    adminData.forEach(item => {
        try {
            res.send(item)            
        } catch (error) {
            
        }

    });
}

module.exports.totalUsers = async (res) => {
    await client.connect();
    const users = await client.db("planners-directory").collection("users").find({});
    users.count((e, t) => {
        try {
            res.status(200).send(t.toString());            
        } catch (error) {
            
        }
    });
}

module.exports.totalPlanners = async (res) => {
    await client.connect();
    const users = await client.db("planners-directory").collection("users").find({ userRole: "planner" });
    users.count((e, t) => {
        try {
            res.status(200).send(t.toString());            
        } catch (error) {
            
        }
    });
}

module.exports.totalBlockedPlanners = async (res) => {
    await client.connect();
    const users = await client.db("planners-directory").collection("users").find({ userRole: "planner", liveProfile: false });
    users.count((e, t) => {
        try {
            res.status(200).send(t.toString());            
        } catch (error) {
            
        }
    });
}

module.exports.totalBlockedVendors = async (res) => {
    await client.connect();
    const users = await client.db("planners-directory").collection("users").find({ userRole: "vendor", liveProfile: false });
    users.count((e, t) => {
        try {
            res.status(200).send(t.toString());            
        } catch (error) {
            
        }
    });
}

module.exports.findUsers = async (data, res) => {
    await client.connect();
    const query = new RegExp(data.searchQuery);
    if (data.filterBy === "both") {
        const profiles = await client.db("planners-directory").collection("profile").find({ "user.storeName": { $regex: query } });
        let result = [];
        await profiles.forEach(profile => result.push(profile))
        res.send(result);
    } else if (data.filterBy === "vendor") {
        const profiles = await client.db("planners-directory").collection("profile").find({ "user.userRole": "vendor", "user.storeName": { $regex: query } });
        let result = [];
        await profiles.forEach(profile => result.push(profile))
        res.send(result);
    } else if (data.filterBy === "planner") {
        const profiles = await client.db("planners-directory").collection("profile").find({ "user.userRole": "planner", "user.storeName": { $regex: query } });
        let result = [];
        await profiles.forEach(profile => result.push(profile))
        res.send(result);
    }
}

module.exports.updateMarketType = async (data, res) => {
    await client.connect();
    await client.db("planners-directory").collection("profile").updateOne({ _id: ObjectId(data.id) }, { $set: { targetMarket: data.targetMarket } });
    res.send({ "message": "Successfully Updated Target Market" });
}

module.exports.blockProfile = async (data, block, res) => {
    await client.connect();
    const profile_cur = await client.db("planners-directory").collection("profile").find({ _id: ObjectId(data.id) });
    await profile_cur.forEach(profile => {
        client.db("planners-directory").collection("users").updateOne({ _id: ObjectId(profile.user._id) }, { $set: { liveProfile: block } });
    })
    await client.db("planners-directory").collection("profile").updateOne({ _id: ObjectId(data.id) }, { $set: { liveProfile: block, "user.liveProfile": block } });
    if (block) {
        res.send({ "message": "Successfully Blocked" });
    } else {
        res.send({ "message": "Successfully UnBlocked" });
    }

}

module.exports.deleteProfile = async (data, res) => {
    await client.connect();

    client.db("planners-directory").collection("users").deleteOne({ _id: ObjectId(data.id) });
    if (data.role == "planner") {
        client.db("planners-directory").collection("packages").deleteOne({ "user": ObjectId(data.id) });
    } else {
        client.db("planners-directory").collection("services").deleteOne({ "user": ObjectId(data.id) });
    }

    await client.db("planners-directory").collection("profile").deleteOne({ "user._id": ObjectId(data.id) });
    res.send({ "message": "Successfully Deleted" });
}