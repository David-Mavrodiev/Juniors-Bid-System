let cachedAuctions = null;
let data = null;

function getNewCatcheFromDatabase() {
    cachedAuctions = data.getAllAuctions()
        .then(auctions => {
            cachedAuctions = auctions;
        })
}

module.exports = function(dataObj) {
    data = dataObj;

    setInterval(() => {
        if (!cachedAuctions) {
            cachedAuctions = data.getAllAuctions()
                .then(auctions => {
                    cachedAuctions = auctions;
                })
        } else {
            for (let i = 0; i < cachedAuctions.length; i += 1) {
                if (cachedAuctions[i].endDate <= new Date()) {

                    data.removeAuctionById(cachedAuctions[i]._id);
                    cachedAuctions.splice(i, 1);
                }
            }
        }
    }, 5000);

    //6 minutes
    setInterval(getNewCatcheFromDatabase, 600000);
}