const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');



const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id });
                return userData
            };
            throw new AuthenticationError("Please log in!")

        }
    },

    Mutation: {
        createMatchup: async (parent, args) => {
            const matchup = await Matchup.create(args);
            return matchup;
        },
        createVote: async (parent, { _id, techNum }) => {
            const vote = await Matchup.findOneAndUpdate(
                { _id },
                { $inc: { [`tech${techNum}_votes`]: 1 } },
                { new: true }
            );
            return vote;
        },
    },
};

module.exports = resolvers;