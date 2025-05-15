module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
        "giveaway",
        {
            ...require("./cors")(Sequelize, DataTypes),

            senderId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            recieverId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            eventId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "event",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            location: {
                type: DataTypes.STRING(100),
                allowNull: true,
                defaultValue: "",
            },
        },
        {
            timestamps: true,
            tableName: "giveaway",
        }
    );
};