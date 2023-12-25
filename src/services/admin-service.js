const { sequelize } = require('../model');
const { Op } = require("sequelize");

const findBestProffesion = (start, end, models) => {
    const { Profile, Contract, Job } = models;

    return Job.findAll({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('price')), 'totalEarned'],
            [sequelize.fn('MAX', sequelize.col('Contract.Contractor.profession')), 'profession']
        ],
        include: [
            {
                model: Contract,
                include: [
                    {
                        model: Profile,
                        as: 'Contractor',
                        where: {
                            type: 'contractor'
                        }
                    }
                ]
            }
        ],
        where: {
            createdAt: {
                [Op.gte]: new Date(start)
            },
            paymentDate: {
                [Op.lte]: new Date(end)
            },
            paid: true
        },
        group: ['Contract.Contractor.profession'],
        order: [[sequelize.literal('totalEarned'), 'DESC']],
        limit: 1
    });
};

const findBestClient = (start, end, limit, models) => {
    const { Profile, Contract, Job } = models;

    return Job.findAll({
        attributes: [
            [sequelize.col('Contract.Client.id'), 'id'],
            [sequelize.col('Contract.Client.lastName'), 'fullName'],
            [sequelize.fn('SUM', sequelize.col('price')), 'total']
        ],
        include: [
            {
                model: Contract,
                include: [
                    {
                        model: Profile,
                        as: 'Client',
                        where: {
                            type: 'client'
                        }
                    }
                ]
            }
        ],
        where: {
            createdAt: {
                [Op.gte]: new Date(start)
            },
            paymentDate: {
                [Op.lte]: new Date(end)
            },
            paid: true
        },
        order: [[sequelize.literal('total'), 'DESC']],
        limit: limit
    });
};

module.exports = { findBestProffesion, findBestClient }