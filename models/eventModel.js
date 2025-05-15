module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
        "event",
        {
            ...require("./cors")(Sequelize, DataTypes),
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",  
            },
            location: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",  
            },
            longitude: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",  
            },
            latitude: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",  
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: "",  
            },
            eventTime: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",  
            },
            eventDate: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",  
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
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },
        {
            timestamps: true,
            tableName: "event",
        }
    );
};