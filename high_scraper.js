// scraper for the high skill bracket
// data is pushed to high.json
// refer to very_high_scraper for documentation
pjs.config({
    log: 'stdout',
    format: 'json',
    writer: 'file',
    outFile: 'high.json'
});

pjs.addSuite({
    url: 'http://www.dotamax.com/hero/played/?skill=h',
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
            pickRateCont = 0.8 * (100 * Math.exp(-5.5 * Math.exp(-0.00000392 * pickRate)) - 1);
            score = winRateCont + pickRateCont;
            score = score.toFixed(2);
            return {
                Hero: name,
                "High": {
                    "Pick Rate": pickRate,
                    "Win Rate": winRate,
                    Score: score
                }
            };
        }).toArray();
    }
});