module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "userInterest",
    {
      ...require("./cors")(Sequelize, DataTypes),
      interestId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "interest",
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
      tableName: "userInterest",
    }
  );
};
