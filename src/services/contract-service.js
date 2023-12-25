const { Op } = require("sequelize");

const findContrcatById = async (id, profile, Contract) => {
    const column = profile.type === 'client' ? 'ClientId' : 'ContractorId';

    const contract = await Contract.findOne(
        {
            where: {
                [Op.and]: [
                    { id },
                    {
                        [column]: profile.id
                    }
                ]
            }
        }
    );

    if (!contract) {
        throw new Error('Sorry, you do not have such contract.');
    }

    return contract;
};

const findAllActiveContracts = async (profile, Contract) => {
    const column = profile.type === 'client' ? 'ClientId' : 'ContractorId';
    return await Contract.findAll(
        {
            where: {
                [Op.and]: [
                    { 
                        [Op.not]: [{ status: 'terminated' }]
                    },
                    {
                        [column]: profile.id
                    }
                ]
            }
        }
    );
};

module.exports = {
    findContrcatById,
    findAllActiveContracts
};