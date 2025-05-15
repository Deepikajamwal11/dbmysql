module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
        "notification",
        {
            ...require("./cors")(Sequelize, DataTypes),
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue:"",  
            },
            senderId:{
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            receiverId:{
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue:"",  
            },

        },
        {
            timestamps: true,
            tableName: "notification",
        }
    );
};
