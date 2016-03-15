// scraper for the very high skill bracket
// data is pushed to very_high.json

//set the scrapers config to log errors and other messages to stdout
//data is in json format to play nice with mongo
pjs.config({
    log: 'stdout',
    format: 'json',
    writer: 'file',
    outFile: 'very_high.json'
});

pjs.addSuite({
    url: 'http://www.dotamax.com/hero/played/?skill=vh',
    scraper: function () {
        //collect every row on the table and make it into an array
        return $('tbody tr').slice(0).map(function () {
            //uses the DOM to find the necessary information to create the score
            var name = $('td:nth-child(1)', this).text(),
                pickRate = $('td:nth-child(2)', this).text(),
                winRate =  $('td:nth-child(3)', this).text(),
                score = 0,
                winRateCont = 0,
                pickRateCont = 0;
            pickRate = pickRate.split(',').join("");
            pickRate = parseFloat(pickRate);
            winRate = winRate.split('%').join("");
            winRate = parseFloat(winRate);
            //Win Rate Contribution is scored as a quadratic function with a 1.6 weight out of a total of 2.4
            winRateCont = 1.6 * 0.01 * Math.pow(winRate, 2);
            //Pick Rate Contribution is scored as a Gompertz function with a .8 weight out of total of 2.4
            pickRateCont = 0.8 * (100 * Math.exp(-5.5 * Math.exp(-0.00000392 * pickRate)) - 1.5);
            score = pickRateCont + winRateCont;
            score = score.toFixed(2);
            return {
                Hero: name,
                "Very High": {
                    "Pick Rate": pickRate,
                    "Win Rate": winRate,
                    Score: score
                }
            };
        }).toArray();
    }
});