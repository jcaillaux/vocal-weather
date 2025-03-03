const Sugar = require("./sugar-custom.js");


module.exports = function dateparser(thing, lang) {
    Sugar.Date.setLocale(lang);
    try {
        return Sugar.Date(thing)?.addHours(1).raw.toISOString();
    }
    catch(e){
        return new Date("nothing").toString()
    }
}