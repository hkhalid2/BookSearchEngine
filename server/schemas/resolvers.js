const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');



const resolvers = {
    Query: {
        me: async (parent, {email, password}, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id });
                return userData
            };
            throw new AuthenticationError("Please log in!")

        }
    },

    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return {token, user};
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({email});
            if (!user) {
                throw new AuthenticationError('No user found of this name.');
            }

            const passwordCheck = await user.isCorrectPassword(password);

            if(!passwordCheck) {
                throw new AuthenticationError("Incorrect Password, Try Again!")
            }

        },
    },
};

module.exports = resolvers;