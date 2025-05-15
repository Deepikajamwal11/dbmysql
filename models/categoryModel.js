module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
      "category",
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
  
      },
      {
        timestamps: true,
        tableName: "category",
      }
    );
  };
  