const { Op } = require("sequelize");
const { findAllActiveContracts } = require("./contract-service");
const { sequelize } = require('../model');
// const { clientBalanceCheck } = require('../services/balance-service');

const clientBalanceCheck = (balance, price) => {
    if (balance < price) {
        const errorMessage = 'No sufficient balance for requested transaction';

        console.error(errorMessage);

        // this should rollback the transaction
        throw new Error(errorMessage);
    }
};

const findAllUnpaidJobs = async (profile, models) => {
    const { Contract, Job } = models;

    const contracts = await findAllActiveContracts(profile, Contract);

    const jobsPromises = contracts.map(contract => {
        return Job.findAll(
            {
                where: { paid: { [Op.eq]: null }, contractId: contract.id },
                required: false
            }
        );
    });

    return Promise.all(jobsPromises);
};

const pay = async(job_id, models) => {
    const { Job, Profile, Contract } = models;

    const result = await sequelize.transaction(async (t) => {
        const jobToPayFor = await Job.findOne(
            {
                where: { id: job_id },
                include: {
                    model: Contract,
                    required: true,
                    include: [
                        {
                            model: Profile,
                            as: 'Client',
                        },
                        {
                            model: Profile,
                            as: 'Contractor'
                        }
                    ]
                }
            }, { transaction: t }
        );

        const client = jobToPayFor.Contract.Client;
        const contractor = jobToPayFor.Contract.Contractor;

        clientBalanceCheck(client.balance, jobToPayFor.price);

        // Here we have version set, which leads to Optimistic locking
        // that should guard us agains overlapping transactions
        await Profile.update(
            {
                balance: sequelize.literal(`balance - ${jobToPayFor.price}`)
            },
            {
                where: {
                    id: client.id
                }
            },
            { transaction: t }
        );

        await Profile.update(
            {
                balance: sequelize.literal(`balance + ${jobToPayFor.price}`)
            },
            {
                where: {
                    id: contractor.id
                }
            },
            { transaction: t }
        )

        await Job.update(
            {
                paid: 1,
                paymentDate: new Date()
            },
            {
                where: {
                    id: job_id
                }
            },
            { transaction: t }
        )
    });

    return result;
};

module.exports = {
    findAllUnpaidJobs,
    pay
};