const ObjectId = require('mongodb').ObjectID;

module.exports = (app) => {

    let allRegions = {};
    const getAllRegions = (req, res, next) => {
        app.locals.database.collection('administrativeRegions')
            .find({})
            .toArray()
            .then(function (regions) {
                allRegions = regions.reduce((result, region) => {
                    result[region._id] = region;
                    return result;
                }, {});
                next()
            })
            .catch(function (err) {
                console.log(err);
            });
    };
    let allSettlements = {};
    const getAllSettlements = (req, res, next) => {
        app.locals.database.collection('settlements')
            .find({})
            .toArray()
            .then(function (settlements) {
                allSettlements = settlements.reduce((result, settlement) => {
                    result[settlement._id] = settlement;
                    return result;
                }, {});
                next()
            })
            .catch(function (err) {
                console.log(err);
            });
    };
    const recursiveArea = (region) => {
        let total = 0;
        if (region.settlements.length) {
            total += region.settlements.reduce((area, settlement) => {
                area += allSettlements[settlement.settlement].area;
                return area;
            }, 0);
        }
        if (region.subdivisions.length) {
            region.subdivisions.forEach(subdivision => {
                total += recursiveArea(allRegions[subdivision.region]);
            })
        }
        return total;
    };

    app.route('/api/regions/administrative')
        .all(function (req, res, next) {
            app.locals.collection = app.locals.database.collection('administrativeRegions');
            next()
        })
        .get(getAllRegions)
        .get(getAllSettlements)
        .get(function (req, res) {
            app.locals.collection
                .find({})
                .toArray()
                .then(function (regions) {
                    console.time('Час перетворення');
                    regions.forEach(region => {
                        region.regions.forEach((reg, index) => {
                            region.regions[index].localization = allRegions[reg.region].localization;
                        });
                        region.subdivisions.forEach((reg, index) => {
                            region.subdivisions[index].localization = allRegions[reg.region].localization;
                        });
                        region.settlements.forEach((set, index) => {
                            region.settlements[index].localization = allSettlements[set.settlement].localization;
                        });
                        region.area = recursiveArea(region);
                    });
                    console.timeEnd('Час перетворення');
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
                population: population.reduce((acc, pop) => {
                    acc[pop.year] = pop.quantity;
                    return acc;
                }, {}),
                regions: regions.map(region => { return {region: ObjectId(region.region), period: {from: region.from, to: region.to}} }),
                subdivisions: subdivisions.map(region => { return {region: ObjectId(region.region), period: {from: region.from, to: region.to}} }),
                settlements: settlements.map(settlement => { return {settlement: ObjectId(settlement.settlement), period: {from: settlement.from, to: settlement.to}} }),
                ...rest
            };

            app.locals.collection
                .insertOne(region)
                .then(function () {
                    console.time('Оновлення');
                    if (region.regions.length) {
                        region.regions.forEach(reg => {
                            app.locals.collection.updateOne({_id: reg.region}, {$push: {subdivisions: {region: region._id, period: reg.period}}})
                        });
                    }
                    if (region.subdivisions.length) {
                        region.subdivisions.forEach(reg => {
                            app.locals.collection.updateOne({_id: reg.region}, {$push: {regions: {region: region._id, period: reg.period}}})
                        });
                    }
                    if (region.settlements.length) {
                        region.settlements.forEach(reg => {
                            app.locals.database.collection('settlements').updateOne({_id: reg.region}, {$push: {regions: {region: region._id, period: reg.period}}})
                        });
                    }
                    console.timeEnd('Оновлення');
                    res.send(region);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    app.get('/api/regions/administrative/options', function(req, res) {
        const language = req.query['language'];
        app.locals.database.collection('administrativeRegions')
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
            app.locals.collection = app.locals.database.collection('administrativeRegions');
            next();
        })
        .get(getAllRegions)
        .get(getAllSettlements)
        .get(function (req, res) {
            const id = ObjectId(req.params.id);
            app.locals.collection
                .findOne({_id: id})
                .then(function (region) {
                    region.regions.forEach((reg, index) => {
                        region.regions[index].localization = allRegions[reg.region].localization;
                    });
                    region.subdivisions.forEach((reg, index) => {
                        region.subdivisions[index].localization = allRegions[reg.region].localization;
                    });
                    region.settlements.forEach((set, index) => {
                        region.settlements[index].localization = allSettlements[set.settlement].localization;
                    });
                    region.area = recursiveArea(region);
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

    app.route('/api/regions/administrative/:id/localization/:lang')
        .all(function (req, res, next) {
            app.locals.collection = app.locals.database.collection('administrativeRegions');
            next();
        })
        .put(function (req, res) {
            const id = ObjectId(req.params.id);
            const update = { $set: {[`localization.${req.params.lang}`]: {title: req.body.title, description: req.body.description}} };
            app.locals.collection
                .findOneAndUpdate({_id: id}, update, {returnOriginal: false})
                .then(function (region) {
                    res.send(region.value);
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .delete(function (req, res) {
            const id = ObjectId(req.params.id);
            const update = { $unset: {[`localization.${req.params.lang}`]: ''} };
            app.locals.collection
                .findOneAndUpdate({_id: id}, update, {returnOriginal: false})
                .then(function (region) {
                    res.send(region.value);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    app.route('/api/regions/administrative/:id/region/:region')
        .all(function (req, res, next) {
            app.locals.collection = app.locals.database.collection('administrativeRegions');
            next();
        })
        .put(function (req, res) {
            const id = ObjectId(req.params.id);
            const regionId = ObjectId(req.params.region);
            const arr = {
                parent: req.body.parent,
                child: req.body.child
            };
            let find = { _id: id, [`${arr.parent}.region`]: regionId };
            let update = { $set: {[`${arr.parent}.$.period`]: req.body.period} };
            app.locals.collection
                .findOneAndUpdate(find, update, {returnOriginal: false})
                .then(function (region) {
                    find = { _id: regionId, [`${arr.child}.region`]: id };
                    update = { $set: {[`${arr.child}.$.period`]: req.body.period} };
                    app.locals.collection
                        .updateOne(find, update)
                        .then(function () {
                            res.send(region.value);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .delete(function (req, res) {
            const id = ObjectId(req.params.id);
            const regionId = ObjectId(req.params.region);
            const arr = {
                parent: req.query.parent,
                child: req.query.child
            };
            let update = { $pull: {[`${arr.parent}`]: {region: regionId}} };
            console.log(update);
            app.locals.collection
                .findOneAndUpdate({_id: id}, update, {returnOriginal: false})
                .then(function (region) {
                    console.log(region);
                    update = { $pull: {[`${arr.child}`]: {region: id}} };
                    console.log(update);
                    app.locals.collection
                        .findOneAndUpdate({_id: regionId}, update, {returnOriginal: false})
                        .then(function (reg) {
                            console.log(reg);
                            res.send(region.value);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
};