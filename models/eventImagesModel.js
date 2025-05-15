module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
      "eventImages",
      {
          ...require("./cors")(Sequelize, DataTypes),
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
          image: {
              type: DataTypes.STRING(255),
              allowNull: false,
              defaultValue: "",  
          },
      },
      {
          timestamps: true,
          tableName: "eventImages",
      }
  );
};