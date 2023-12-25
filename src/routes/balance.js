const { deposit } = require("../services/balance-service");

const init = (app, models) => {
    app.post('/balances/deposit/:userId', async (req, res) => {
        const { userId } = req.params;
    
        try {
            await deposit(userId, models);
    
            res.send(200).end();
        } catch (e) {
            console.error(e);
            res.sendStatus(501).end();
        }
    });
};

module.exports = { init };