// scraper for the normal skill bracket
// data is pushed to normal.json
// refer to very_high_scraper for documentation
pjs.config({
    log: 'stdout',
    format: 'json',
    writer: 'file',
    outFile: 'normal.json'
});

pjs.addSuite({
    url: 'http://www.dotamax.com/hero/played/?skill=n',
    scraper: function () {
        return $('tbody tr').slice(0).map(function () {
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
            winRateCont = 1.6 * 0.01 * Math.pow(winRate, 2);
            pickRateCont = 0.8 * (100 * Math.exp(-10 * Math.exp(-0.0000006 * pickRate)) - 0.03);
            score = winRateCont + pickRateCont;
            score = score.toFixed(2);
            return {
                Hero: name,
                "Normal": {
                    "Pick Rate": pickRate,
                    "Win Rate": winRate,
                    Score: score
                }
            };
        }).toArray();
    }
});