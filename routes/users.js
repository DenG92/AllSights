const objectId = require('mongodb').ObjectID;

module.exports = (app) => {

    app.route('/api/users')
        .all(function (req, res, next) {
            if(!req.body) return res.sendStatus(400);
            app.locals.collection = app.locals.database.collection('users');
            next();
        })
        .get(function (req, res) {
            app.locals.collection
                .find({})
                .toArray()
                .then(function (users) {
                    res.send(users);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .post(function (req, res) {
            const name = req.body.name;
            const age = req.body.age;
            const user = {name, age};

            app.locals.collection
                .insertOne(user)
                .then(function () {
                    res.send(user);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    app.route('/api/users/:id')
        .all(function (req, res, next) {
            if(!req.body) return res.sendStatus(400);
            app.locals.collection = app.locals.database.collection('users');
            next();
        })
        .get(function (req, res) {
            const id = new objectId(req.params.id);
            app.locals.collection
                .findOne({_id: id})
                .then(function (user) {
                    res.send(user);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .put(function (req, res) {
            const id = new objectId(req.params.id);
            const name = req.body.name;
            const age = req.body.age;

            app.locals.collection
                .findOneAndUpdate({_id: id}, {$set: {name, age}}, {returnOriginal: false})
                .then(function (result) {
                    const user = result.value;
                    res.send(user);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .delete(function (req, res) {
            const id = new objectId(req.params.id);
            app.locals.collection
                .findOneAndDelete({_id: id})
                .then(function(result){
                    const user = result.value;
                    res.send(user);
                })
                .catch(function(err){
                    console.log(err);
                });
        });

};