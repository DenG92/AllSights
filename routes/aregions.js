const ObjectId = require('mongodb').ObjectID;

module.exports = (app) => {

    let localizedRegions = {};
    let localizedSettlements = {};

    app.all('/api/regions/administrative', function(req, res, next) {
        app.locals.collection = app.locals.database.collection('administrativeRegions');
        app.locals.collection
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

    app.all('/api/regions/administrative', function(req, res, next) {
        app.locals.database.collection('settlements')
            .find({})
            .toArray()
            .then(function (settlements) {
                localizedSettlements = settlements.reduce((result, settlement) => {
                    result[settlement._id] = {_id: settlement._id, localization: settlement.localization};
                    return result;
                }, {});
                next()
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    app.route('/api/regions/administrative')
        .get(function (req, res) {
            app.locals.collection
                .find({})
                .toArray()
                .then(function (regions) {
                    regions.forEach(region => {
                        region.regions.forEach((reg, index) => {
                            region.regions[index].localization = localizedRegions[reg.region];
                        });
                        region.subdivisions.forEach((reg, index) => {
                            region.subdivisions[index].localization = localizedRegions[reg.region];
                        });
                        region.settlements.forEach((set, index) => {
                            region.settlements[index].localization = localizedSettlements[set.settlement];
                        });
                    });
                    res.send(regions);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .post(function (req, res) {
            const {title, description, language, population, regions, subdivisions, settlements, ...rest} = req.body;
            const region = {
                localization: { [language]: {title, description} },
                population: { [population.year]: population.quantity },
                regions: regions.map(region => { return {region: ObjectId(region), period: region.period || null} }),
                subdivisions: subdivisions.map(region => { return {region: ObjectId(region), period: region.period || null} }),
                settlements: settlements.map(settlement => { return {settlement: ObjectId(settlement), period: settlement.period || null} }),
                ...rest
            };

            app.locals.collection
                .insertOne(region)
                .then(function () {
                    if (region.regions.length) {
                        region.regions.forEach(reg => {
                            app.locals.collection.updateOne({_id: reg.region}, {$push: {subdivisions: {region: region._id, period: reg.period}}})
                        });
                        /*app.locals.collection
                            .updateMany({_id: {$in: region.regions.map(el => el.region)}}, {$push: {subdivisions: region._id}})
                            .then();*/
                    }
                    if (region.subdivisions.length) {
                        region.subdivisions.forEach(reg => {
                            app.locals.collection.updateOne({_id: reg.region}, {$push: {regions: {region: region._id, period: reg.period}}})
                        });
                        /*app.locals.collection
                            .updateMany({_id: {$in: region.subdivisions.map(el => el.region)}}, {$push: {regions: region._id}})
                            .then();*/
                    }
                    if (region.settlements.length) {
                        region.settlements.forEach(reg => {
                            app.locals.collection.updateOne({_id: reg.region}, {$push: {regions: {region: region._id, period: reg.period}}})
                        });
                        /*app.locals.database.collection('settlements')
                            .updateMany({_id: {$in: region.settlements.map(el => el.settlement)}}, {$push: {regions: region._id}})
                            .then();*/
                    }
                    res.send(region);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    app.get('/api/regions/administrative/options', function(req, res) {
        const type = req.query['type'];
        const language = req.query['language'];
        app.locals.database.collection(type === 'regions' ? 'administrativeRegions' : 'settlements')
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

    app.route('/api/regions/administrative/:id')
        .all(function (req, res, next) {
            if(!req.body) return res.sendStatus(400);
            next();
        })
        .get(function (req, res) {
            const id = ObjectId(req.params.id);
            app.locals.collection
                .findOne({_id: id})
                .then(function (region) {
                    region.regions.forEach((reg, index) => {
                        region.regions[index].localization = localizedRegions[reg.region];
                    });
                    region.subdivisions.forEach((reg, index) => {
                        region.subdivisions[index].localization = localizedRegions[reg.region];
                    });
                    region.settlements.forEach((set, index) => {
                        region.settlements[index].localization = localizedSettlements[set.settlement];
                    });
                    res.send(region);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .put(function (req, res) {
            const id = ObjectId(req.params.id);

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
            const id = new ObjectId(req.params.id);
            app.locals.collection
                .findOneAndDelete({_id: id})
                .then(function(result){
                    const region = result.value;
                    if (region.regions.length) {
                        const ids = region.regions.map(reg => reg.region);
                        app.locals.collection
                            .updateMany({_id: {$in: ids}}, {$pull: {subdivisions: {region: region._id}}})
                            .then();
                    }
                    if (region.subdivisions.length) {
                        const ids = region.subdivisions.map(reg => reg.region);
                        app.locals.collection
                            .updateMany({_id: {$in: ids}}, {$pull: {regions: {region: region._id}}})
                            .then();
                    }
                    if (region.settlements.length) {
                        const ids = region.settlements.map(reg => reg.settlement);
                        app.locals.database.collection('settlements')
                            .updateMany({_id: {$in: ids}}, {$pull: {regions: {region: region._id}}})
                            .then();
                    }
                    res.send(region);
                })
                .catch(function(err){
                    console.log(err);
                });
        });

};