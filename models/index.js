const Sequelize = require("sequelize");
const giveawayModel = require("./giveawayModel");
const sequelize = require("../dbConnection").sequelize;

module.exports = {
  userModel: require("./userModel")(Sequelize, sequelize, Sequelize.DataTypes),
  interestModel: require("./interestModel")(Sequelize, sequelize, Sequelize.DataTypes),
  prefrenceModel: require("./prefrenceModel")(Sequelize, sequelize, Sequelize.DataTypes),
  categoryModel: require("./categoryModel")(Sequelize, sequelize, Sequelize.DataTypes),
  cmsModel: require("./cmsModel")(Sequelize, sequelize, Sequelize.DataTypes),
  notificationModel: require("./notificationModel")(Sequelize, sequelize, Sequelize.DataTypes),
  contactUsModel: require("./contactusModel")(Sequelize, sequelize, Sequelize.DataTypes),
  faqModel: require("./faqModel")(Sequelize, sequelize, Sequelize.DataTypes),
  userPrefrenceModel: require("./userPrefrenceModel")(Sequelize, sequelize, Sequelize.DataTypes),
  userInterestModel: require("./userInterestModel")(Sequelize, sequelize, Sequelize.DataTypes),
  eventModel: require("./eventModel")(Sequelize, sequelize, Sequelize.DataTypes),
  eventImagesModel: require("./eventImagesModel")(Sequelize, sequelize, Sequelize.DataTypes),
  permotionModel: require("./permotionModel")(Sequelize, sequelize, Sequelize.DataTypes),
  businessModel: require("./businessModel")(Sequelize, sequelize, Sequelize.DataTypes),
  businessAvailabilityModel: require("./businessAvailabilityModel")(Sequelize, sequelize, Sequelize.DataTypes),
  reviewModel: require("./reviewModel")(Sequelize, sequelize, Sequelize.DataTypes),
  giveawayModel: require("./giveawayModel") (Sequelize, sequelize, Sequelize.DataTypes),
};
