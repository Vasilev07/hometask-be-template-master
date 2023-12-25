const { findBestProffesion, findBestClient } = require("../services/admin-service");

const init = (app, models) => {
    app.get('/admin/best-profession', async (req, res) => {
        const { start, end } = req.query;
    
        const result = await findBestProffesion(start, end, models);
    
        res.json(result);
    });
    
    app.get('/admin/best-clients', async (req, res) => {
        const { start, end, limit } = req.query;
    
        const result = await findBestClient(start, end, limit, models)
    
        res.json(result);
    });
};

module.exports = { init };

