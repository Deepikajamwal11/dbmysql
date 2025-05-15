module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
      "interest",
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
        tableName: "interest",
      }
    );
  };
  