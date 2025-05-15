module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
      "contactus",
      {
        ...require("./cors")(Sequelize, DataTypes),
        firstName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue:"",  
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue:"",  
          },

          email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue:"",  
          },
          countryCode:{
            type: DataTypes.STRING(25),
            allowNull: true,
            defaultValue:"",  
          },
          phoneNumber: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue:"",  
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue:"",  
          },
  
      },
      {
        timestamps: true,
        tableName: "contactus",
      }
    );
  };
  