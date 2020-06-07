const objectId = require('mongodb').ObjectID;

module.exports = (app) => {

    app.route('/api/regions/historical')
        .all(function (req, res, next) {
            if(!req.body) return res.sendStatus(400);
            app.locals.collection = app.locals.database.collection('historicalRegions');
            next();
        })
        .get(function (req, res) {
            app.locals.collection
                .find({})
                .toArray()
                .then(function (regions) {
                    res.send(regions);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .post(function (req, res) {
            const title = req.body.title;
            const description = req.body.description;
            const language = req.body.language;
            const region = {};

            app.locals.collection
                .insertOne(region)
                .then(function () {
                    res.send(region);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    app.route('/api/regions/historical/:id')
        .all(function (req, res, next) {
            if(!req.body) return res.sendStatus(400);
            app.locals.collection = app.locals.database.collection('historicalRegions');
            next();
        })
        .get(function (req, res) {
            const id = new objectId(req.params.id);
            app.locals.collection
                .findOne({_id: id})
                .then(function (region) {
                    res.send(region);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .put(function (req, res) {
            const id = new objectId(req.params.id);

            app.locals.collection
                .findOneAndUpdate({_id: id}, {$set: {}}, {returnOriginal: false})
                .then(function (result) {
                    const region = result.value;
                    res.send(region);
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
                    const region = result.value;
                    res.send(region);
                })
                .catch(function(err){
                    console.log(err);
                });
        });

};