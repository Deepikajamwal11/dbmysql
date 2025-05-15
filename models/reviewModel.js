module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
      "reviewModel",
      {
        ...require("./cors")(Sequelize, DataTypes),
        userTo: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        userBy: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        messege: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue:"",  
          },
          rating: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
          }, 
      },
      {
        timestamps: true,
        tableName: "reviewModel",
      }
    );
  };
  