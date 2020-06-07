class Localization {

    constructor(title, description) {
        this.title = title;
        this.description = description;
    }

}

class Period {

    constructor(from, to) {
        this.from = new Date(from);
        this.to = new Date(to);
    }

    get difference() {
        return this.to.getFullYear() - this.from.getFullYear();
    }

}

module.exports = class Region {

    constructor({id, title, desc, period}) {
        this.id = id;
        this.title = title;
        this.description = desc;
        this.period = new Period(period.from, period.to);
    }

};