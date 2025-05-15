module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "permotion",
    {
      ...require("./cors")(Sequelize, DataTypes),

      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:"",  
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:"",  
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue:"",  
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
      tableName: "permotion",
    }
  );
};
