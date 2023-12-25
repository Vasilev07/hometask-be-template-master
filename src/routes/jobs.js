const { findAllUnpaidJobs } = require("../services/jobs-service");
const { getProfile } = require("../middleware/getProfile");
const { pay } = require('../services/jobs-service');

const init = (app, models) => {
    app.get('/jobs/unpaid', getProfile, async (req, res) => {
        const profile = req.profile;
    
        const jobs = await findAllUnpaidJobs(profile, models);
       
        if (!jobs) {
            return res.status(404).end()
        };
    
        res.json(jobs.flatMap((el) => el));
    });
    
    app.post('/jobs/:job_id/pay', async (req, res) => {
        try {
            const { job_id } = req.params;
    
            const result = await pay(job_id, models);
    
            res.json(result);
        } catch (error) {
            console.error(error);
            res.send(501);
        }
    });
};

module.exports = { init };