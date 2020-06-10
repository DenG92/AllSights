const ObjectId = require('mongodb').ObjectID;

module.exports = (app) => {

    let localizedRegions = {};

    app.all('/api/settlements', function(req, res, next) {
        app.locals.database.collection('administrativeRegions')
            .find({})
            .toArray()
            .then(function (regions) {
                localizedRegions = regions.reduce((result, region) => {
                    result[region._id] = region.localization;
                    return result;
                }, {});
                next()
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    app.route('/api/settlements')
        .all(function (req, res, next) {
            app.locals.collection = app.locals.database.collection('settlements');
            next();
        })
        .get(function (req, res) {
            app.locals.collection
                .find({})
                .toArray()
                .then(function (settlements) {
                    settlements.forEach(settlement => {
                        settlement.regions.forEach((reg, index) => {
                            settlement.regions[index].localization = localizedRegions[reg.region];
                        });
                    });
                    res.send(settlements);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .post(function (req, res) {
            const {title, description, language, area, population, regions} = req.body;
            const settlement = {
                localization: { [language]: {title, description} },
                area: area,
                population: population.reduce((acc, pop) => {
                    acc[pop.year] = pop.quantity;
                    return acc;
                }, {}),
                regions: regions.map(region => { return {region: ObjectId(region.region), period: {from: region.from, to: region.to}} })
            };

            app.locals.collection
                .insertOne(settlement)
                .then(function () {
                    if (settlement.regions.length) {
                        settlement.regions.forEach(set => {
                            app.locals.database.collection('administrativeRegions')
                                .updateOne({_id: set.region}, {$push: {settlements: {settlement: settlement._id, period: set.period}}})
                        });
                    }
                    res.send(settlement);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    app.get('/api/settlements/options', function(req, res) {
        const language = req.query['language'];
        app.locals.database.collection('settlements')
            .find({})
            .toArray()
            .then(function (data) {
                const options = data
                    .filter(item => item.localization.hasOwnProperty(language))
                    .map(item => { return {label: item.localization[language].title, value: item._id} });
                res.send(options);
            })
            .catch(function (err) {
                console.log(err);
            });

    });

    app.route('/api/settlements/:id')
        .all(function (req, res, next) {
            app.locals.collection = app.locals.database.collection('settlements');
            next();
        })
        .get(function (req, res) {
            const id = ObjectId(req.params.id);
            app.locals.collection
                .findOne({_id: id})
                .then(function (settlement) {
                    settlement.regions.forEach((reg, index) => {
                        settlement.regions[index].localization = localizedRegions[reg.region];
                    });
                    res.send(settlement);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .put(function (req, res) {
            const id = ObjectId(req.params.id);
            console.log(req.body);

            /*app.locals.collection
                .findOneAndUpdate({_id: id}, {$set: {}}, {returnOriginal: false})
                .then(function (result) {
                    const settlement = result.value;
                    res.send(settlement);
                })
                .catch(function (err) {
                    console.log(err);
                });*/
        })
        .delete(function (req, res) {
            const id = new ObjectId(req.params.id);
            app.locals.collection
                .findOneAndDelete({_id: id})
                .then(function(result){
                    const settlement = result.value;
                    if (settlement.regions.length) {
                        const ids = settlement.regions.map(reg => reg.region);
                        app.locals.collection
                            .updateMany({_id: {$in: ids}}, {$pull: {settlements: {settlement: settlement._id}}})
                            .then();
                    }
                    res.send(settlement);
                })
                .catch(function(err){
                    console.log(err);
                });
        });
};