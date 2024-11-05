class PotentialAction {
    constructor(name, target) {
        this["@context"] = "http://schema.org";
        this["@type"] = "ViewAction";
        this.name = name;
        this.target = target;
    }
}

class Fact {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class CardSection {
    constructor() {
        this.activityTitle = "";
        this.activitySubtitle = "";
        this.activityImage = "";
        this.activityText = undefined;
        this.facts = undefined;
        this.potentialAction = undefined;
    }
}

class WebhookBody {
    constructor() {
        this.summary = "Github Actions CI";
        this.text = undefined;
        this.themeColor = "FFF49C";
        this.sections = [];
    }
}

module.exports = {
    PotentialAction,
    Fact,
    CardSection,
    WebhookBody
};
