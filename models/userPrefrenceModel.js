module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "userPrefrence",
    {
      ...require("./cors")(Sequelize, DataTypes),
      prefrenceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "prefrence",
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
      tableName: "userPrefrence",
    }
  );
};
