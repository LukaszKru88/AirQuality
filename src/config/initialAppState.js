const suggestions = [
    { name: "Poland", code: "PL" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
    { name: "Spain", code: "ES" }];

const searchLimit = 100;
const pollutionParameter = "pm10";

function getSuggestions() {
    return suggestions;
}

function getSearchLimit() {
    return searchLimit;
}

function getPollutionParameter() {
    return pollutionParameter;
}

function getCitiesFromCookies(props) {
    const { cookies } = props;
    if (cookies.get("pollutedCities") && cookies.get("pollutedCities").length !== 0) {
        return cookies.get("pollutedCities");
    }
}

function getCountryFromCookies(props) {
    const { cookies } = props;
    if (cookies.get("country")) {
        return cookies.get("country");
    }
}

module.exports = {
    getSuggestions,
    getSearchLimit,
    getPollutionParameter,
    getCitiesFromCookies,
    getCountryFromCookies,
}