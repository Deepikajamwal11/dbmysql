module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      ...require("./cors")(Sequelize, DataTypes),
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue:"",  
      },
      role: {
        type: DataTypes.ENUM('0','1','2',),
        allowNull: false,
        defaultValue: "1",
        
      },

      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue:"",  
      },

      email: {
        type: DataTypes.STRING(255),
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
        allowNull: true,
        defaultValue:"",  
       },
       location: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue:"",  
       },

      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue:"",  
      },

      profilePicture: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue:"",    
      },

      resetToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue:null,     
       },

      resetTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue:null,    
      },

      deviceToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue:"",  
      },

      deviceType: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue:"",     
       },

      otpVerify: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:"0",  
      },
      language:{
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue:"",  
      }
    },
    {
      timestamps: true,
      tableName: "users",
    }
  );
};
