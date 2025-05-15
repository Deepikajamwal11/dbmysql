
module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
        "businessAvailability",
        {
            ...require("./cors")(Sequelize, DataTypes),

            businessId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "business",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            day: {
                type: DataTypes.STRING(50), 
                allowNull: false,
                defaultValue: "",

              },
            openingTime: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "",
            },
            closingTime: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "",
            },
        },

        {
            timestamps: true,
            tableName: "businessAvailability",
        }
    );
};
