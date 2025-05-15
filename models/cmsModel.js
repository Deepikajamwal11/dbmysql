module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
      "cms",
      {
        ...require("./cors")(Sequelize, DataTypes),
        type: {
            type: DataTypes.ENUM('1','2','3'),
            allowNull: false,
            defaultValue: "1",
          },
          title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "",

          },
          description: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue:"",  
            
          }
      },
      {
        timestamps: true,
        tableName: "cms",
      }
    );
  };
  