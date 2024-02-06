const UserProfile = require('../../schemas/UserProfile');

const dailyAmount = 500;

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'this command can only be run in MY server retawd :3',
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            let userProfile = await UserProfile.findOne({
                userId: interaction.member.id,
            });

            if (userProfile) {
                const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    interaction.editReply('u already did that silly :P')
                    return;
                }
            } else {
                userProfile = new UserProfile({
                    userId: interaction.member.id,

                })
            }

            userProfile.balance += dailyAmount;
            userProfile.lastDailyCollected = new Date();

            await userProfile.save();

            interaction.editReply(
                `${dailyAmount} was given to you :3.\nnew balance of ${userProfile.balance}`
            )
        } catch (error) {
            console.log(`error handling ur thingy: ${error}`)
        }
    },

    data: {
        name: 'daily',
        description: 'collect daily currency',
    },
}