module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
        "business",
        {
            ...require("./cors")(Sequelize, DataTypes),
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue:"",  
            },
            image: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue:"",  

            },

            categoryId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "category",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },

        {
            timestamps: true,
            tableName: "business",
        }
    );
};
