const { findAllUnpaidJobs } = require('../services/jobs-service');
const { sequelize } = require("../model");

const deposit = async (userId, models) => {
    const { Profile } = models;

    return sequelize.transaction(async (t) => {
        const profile = await Profile.findOne({ where: { id: userId } }, { transaction: t });

        if (profile.type !== 'client') {
            const errorMessage = "You should be logged as client to be able to deposit money!";
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        const jobsToPay = await findAllUnpaidJobs(profile, models);

        const totalPayment = jobsToPay.flatMap(e => e).reduce((accumulator, b) => {
            return accumulator + b.price;
        }, 0);

        const maxAllowedMoneyToDeposit = totalPayment * 25 / 100;

        await Profile.update(
            {
                balance: sequelize.literal(`balance + ${maxAllowedMoneyToDeposit}`)
            },
            { where: { id: userId } },
            { transaction: t });
    });
}

module.exports = { deposit };