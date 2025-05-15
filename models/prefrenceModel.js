module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
      "prefrence",
      {
        ...require("./cors")(Sequelize, DataTypes),
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue:"",  
        },
  
      },
      {
        timestamps: true,
        tableName: "prefrence",
      }
    );
  };
  