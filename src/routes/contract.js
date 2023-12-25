const { findContrcatById, findAllActiveContracts } = require("../services/contract-service");
const { getProfile } = require("../middleware/getProfile");

const init = (app, models) => {
    
    app.get('/contracts/:id', getProfile, async (req, res) => {
        const { Contract } = models;
        const { id } = req.params;
        const profile = req.profile;

        try {
            const contract = await findContrcatById(id, profile, Contract);

            if (!contract) {
                return res.status(404).end()
            };

            res.json(contract);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    });

    app.get('/contracts', getProfile, async (req, res) => {
        const { Contract } = models;
        const profile = req.profile;

        const contracts = await findAllActiveContracts(profile, Contract);

        if (!contracts) {
            return res.status(404).end()
        };

        res.json(contracts);
    });
};

module.exports = { init };