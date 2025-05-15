const Model = require('../models/index');
const helper = require('../helpers/helper');
const bcrypt = require("bcrypt");
const { Validator } = require('node-input-validator');

const { Sequelize } = require("sequelize");
Model.eventModel.belongsTo(Model.userModel, {
  foreignKey: "userId",
  as: "user",
});
Model.eventModel.belongsTo(Model.categoryModel, {
  foreignKey: "categoryId",
  as: "category",
});
Model.eventModel.hasMany(Model.eventImagesModel, {
  foreignKey: "eventId",
  as: "eventimages",
});
Model.eventImagesModel.belongsTo(Model.eventModel, {
  foreignKey: 'eventId',
  as: 'event',
});

Model.userModel.belongsToMany(Model.interestModel, {
  through: Model.userInterestModel,
  foreignKey: "userId",
  otherKey: "interestId",
  as: "interests"
});
Model.interestModel.belongsToMany(Model.userModel, {
  through: Model.userInterestModel,
  foreignKey: "interestId",
  otherKey: "userId",
  as: "users"
});
Model.userModel.belongsToMany(Model.prefrenceModel, {
  through: Model.userPrefrenceModel,
  foreignKey: "userId",
  otherKey: "prefrenceId",
  as: "prefrence"
});
Model.prefrenceModel.belongsToMany(Model.userModel, {
  through: Model.userPrefrenceModel,
  foreignKey: "prefrenceId",
  otherKey: "userId",
  as: "userss"
});

Model.reviewModel.belongsTo(Model.userModel, {
  foreignKey: "userTo",
  as: "userr",
});

Model.reviewModel.belongsTo(Model.userModel, {
  foreignKey: "userBy",
  as: "userrBy",
});

Model.giveawayModel.belongsTo(Model.userModel, { as: "sender", foreignKey: "senderId" });
Model.giveawayModel.belongsTo(Model.userModel, { as: "receiver", foreignKey: "recieverId" });
Model.giveawayModel.belongsTo(Model.eventModel, { as: "event", foreignKey: "eventId" });



module.exports = {


  dashboard: async (req, res) => {
    try {
      const users = await Model.userModel.count({ where: { role: "1" } });
      const contact = await Model.contactUsModel.count({});
      const provider = await Model.userModel.count({ where: { role: "2" } });
      const interest = await Model.interestModel.count({});
      const prefrence = await Model.prefrenceModel.count({});
      const category = await Model.categoryModel.count({});
      const event = await Model.eventModel.count({});
      const faq = await Model.faqModel.count({});
      const contacts = await Model.contactUsModel.count({});
      const review = await Model.reviewModel.count({})



      const usersByMonth = await Model.userModel.findAll({
        where: { role: ["1"] },
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
        ],
        group: ["month"],
        order: [[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"]],
        raw: true,
      });

      const chartData = Array(12).fill(0);
      usersByMonth.forEach((item) => {
        chartData[item.month - 1] = parseInt(item.count, 10);
      });

      res.render("dashboard", {
        session: req.session.admin,
        title: 'Dashboard',
        chartData,
        users,
        contact,
        provider,
        category,
        interest,
        prefrence,
        event,
        faq,
        contacts,
        review
      });
    } catch (error) {
      throw error ;

    }
  },
  login: async (req, res) => {
    try {
      res.render("login")
    } catch (error) {
      req.flash("error", "Something went wrong, please try again");
      return res.redirect("/login");
    }
  },
  loginpost: async (req, res) => {
    try {
      const { email, password } = req.body;
      const find_user = await Model.userModel.findOne({ where: { email, role: "0" } });
      if (!find_user) {
        req.flash("error", "Invalid Email");
        return res.redirect("/login");
      }
      const is_password = await bcrypt.compare(password, find_user.password);
      if (!is_password) {
        req.flash("error", "Invalid Password");
        return res.redirect("/login");
      }
      req.session.admin = find_user;
      req.flash("success", "You are logged in successfully");
      return res.redirect("/dashboard");
    } catch (error) {
      req.flash("error", "Something went wrong, please try again");
      return res.redirect("/login");
    }
  },
  profile: async (req, res) => {
    try {
      const profile = await Model.userModel.findOne({
        where: { email: req.session.admin.email },
      });

      res.render("admin/profile.ejs", {
        session: req.session.admin,
        profile,
        title: "Profile",
      });
    } catch (error) {
      throw error;
    }
  },
  editProfile: async (req, res) => {
    try {
      let updatedata = { ...req.body };
      let folder = "admin";
      if (req.files && req.files.profilePicture) {
        let images = await helper.fileUpload(req.files.profilePicture, folder);
        updatedata.profilePicture = images;
      }
      const profile = await Model.userModel.update(updatedata, {
        where: {
          id: req.session.admin.id,
        },
      });
      const find_data = await Model.userModel.findOne({
        where: {
          id: req.session.admin.id,
        },
      });
      req.session.admin = find_data;
      req.flash("success", " Update Profile succesfully ");
      res.redirect("/profile");
    } catch (error) {
      throw error;
    }
  },
  password: async (req, res) => {
    try {
      res.render("admin/password", {
        session: req.session.admin,
        title: "Change Password",
      });
    } catch (error) {
      throw error;
    }
  },
  updatepassword: async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (newPassword !== confirmPassword) {
        req.flash("error", "New password and confirm password do not match");
        return res.status(400).json({ message: "New password and confirm password do not match" });
      }
      const user = await Model.userModel.findOne({
        where: { id: req.session.admin.id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        req.flash("error", "Old password is incorrect");
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        req.flash("error", "New password cannot be the same as the old password");
        return res.status(400).json({ message: "New password cannot be the same as the old password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      req.session.admin.password = hashedPassword;
      req.flash("success", "Password updated successfully");
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      throw error;

    }
  },
  logout: async (req, res) => {
    try {
      req.flash('success', 'Logged out successfully');
      delete req.session.admin;
      res.redirect("/login");
    } catch (error) {
      throw error;
    }
  },
  providerList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Model.userModel.findAndCountAll({
        where: {
          role: "2",
        },
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("provider/providerlist.ejs", {
        title: "Providers",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error;
    }
  },
  providerDetails: async (req, res) => {
    try {
      const userDetail = await Model.userModel.findOne({
        where: { id: req.params.id },

      });
      res.render("provider/providerview.ejs", {
        session: req.session.admin,
        userDetail,
        title: "Provider Details"
      });
    } catch (error) {
      throw error;
    }
  },
  userList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Model.userModel.findAndCountAll({
        where: {
          role: "1",
        },
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("user/userlist.ejs", {
        title: "Users",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error;
    }
  },
  userDetails: async (req, res) => {
    try {
      const userDetail = await Model.userModel.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Model.interestModel,
            as: 'interests',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Model.prefrenceModel,
            as: 'prefrence',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }
        ]
      });
      res.render("user/userview.ejs", {
        session: req.session.admin,
        userDetail,
        title: "User Details"
      });
    } catch (error) {
      throw error;

    }
  },
  userDelete: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await Model.userModel.finModelyPk(userId);
      await Model.userModel.destroy({ where: { id: userId } });
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
  userStatus: async (req, res) => {
    try {
      const result = await Model.userModel.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      if (result[0] === 1) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Status change failed" });
      }
    } catch (error) {
      throw error;
    }
  },
  addInterest: async (req, res) => {
    try {
      res.render("interest/interestadd", {
        session: req.session.admin,
        title: "Add Interest",
      });
    } catch (error) {
      throw error;
    }
  },
  createInterest: async (req, res, next) => {
    try {
      const data = await Model.interestModel.create({
        name: req.body.name,
        status: '1'
      });

      req.flash("success", "Interest added successfully");
      res.redirect("/interestlist");
    } catch (error) {
      next(error);
    }
  },
  interestList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Model.interestModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("interest/interestlist.ejs", {
        title: "Interests",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error
    }
  },
  interestStatus: async (req, res) => {
    try {
      const result = await Model.interestModel.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      if (result[0] === 1) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Status change failed" });
      }
    } catch (error) {
      throw error;
    }
  },
  interestDelete: async (req, res) => {
    try {
      const userId = req.params.id;
      const interest = await Model.interestModel.findByPk(userId);
      await Model.interestModel.destroy({ where: { id: userId } });
      res.json({ success: true, message: "interests deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
  interestEditPage: async (req, res) => {
    try {
      const data = await Model.interestModel.findOne({ where: { id: req.params.id } });
      res.render("interest/interestedit.ejs", {
        session: req.session.admin,
        title: "Edit Interest",
        data,
      });
    } catch (error) {
      throw error;
    }
  },
  editInterest: async (req, res) => {
    try {
      await Model.interestModel.update(
        {
          name: req.body.name,
        },
        {
          where: { id: req.params.id },
        }
      );
      req.flash("success", "Interest updated successfully");
      res.redirect("/interestlist");
    } catch (error) {
      throw error;
    }
  },
  addPrefrence: async (req, res) => {
    try {
      res.render("prefrence/prefrenceadd", {
        session: req.session.admin,
        title: "Add Prefrence",
      });
    } catch (error) {
      throw error;
    }
  },
  createPrefrence: async (req, res, next) => {
    try {
      const data = await Model.prefrenceModel.create({
        name: req.body.name,
        status: '1'
      });

      req.flash("success", "Prefrence added successfully");
      res.redirect("/prefrencelist");
    } catch (error) {
      next(error);
    }
  },
  prefrenceList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Model.prefrenceModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("prefrence/prefrencelist.ejs", {
        title: "Prefrence",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error
    }
  },
  prefrenceStatus: async (req, res) => {
    try {
      const result = await Model.prefrenceModel.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      if (result[0] === 1) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Status change failed" });
      }
    } catch (error) {
      throw error;
    }
  },
  prefrenceDelete: async (req, res) => {
    try {
      const userId = req.params.id;
      const prefrence = await Model.prefrenceModel.findByPk(userId);
      await Model.prefrenceModel.destroy({ where: { id: userId } });
      res.json({ success: true, message: "prefrence deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
  prefrenceEditPage: async (req, res) => {
    try {
      const data = await Model.prefrenceModel.findOne({ where: { id: req.params.id } });
      res.render("prefrence/prefrenceedit.ejs", {
        session: req.session.admin,
        title: "Edit Prefrence",
        data,
      });
    } catch (error) {
      throw error;
    }
  },
  prefrenceEdit: async (req, res) => {
    try {
      await Model.prefrenceModel.update(
        {
          name: req.body.name,
        },
        {
          where: { id: req.params.id },
        }
      );
      req.flash("success", "Prefrence updated successfully");
      res.redirect("/prefrencelist");
    } catch (error) {
      throw error;
    }
  },
  getcontacts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Model.contactUsModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("contacts/contactlist.ejs", {
        title: "Contact Us",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error
    }
  },
  deletecontact: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ success: false, message: "contact ID is required" });
      }
      const contact = await Model.contactUsModel.findByPk(req.params.id);
      await Model.contactUsModel.destroy({ where: { id: req.params.id } });
      return res.json({ success: true, message: "contact deleted successfully" });
    } catch (error) {
      throw error
    }
  },
  contactview: async (req, res) => {
    try {
      const data = await Model.contactUsModel.findOne({
        where: { id: req.params.id }
      });
      res.render("contacts/contactview", {
        title: "Contact Details",
        data,
        session: req.session.admin,
      });
    } catch (error) {
      throw error
    }
  },
  privacy: async (req, res) => {
    try {
      const privacy = await Model.cmsModel.findOne({
        where: { type: '1' },
      });
      res.render("cms/privacypolicy", {
        title: "Privacy Policy",
        session: req.session.admin,
        privacy,
      });
    } catch (error) {
      throw error
    }
  },
  privacy_update: async (req, res) => {
    try {
      let data = await Model.cmsModel.update(req.body, {
        where: {
          type: '1',
        }, raw: true
      })
      req.flash("success", "Privacy & Policy updated successfully");
      res.redirect(`back`);
    } catch (error) {
      throw error
    }
  },
  aboutus: async (req, res) => {
    try {
      const privacy = await Model.cmsModel.findOne({
        where: { type: "2" },
      });
      res.render("cms/aboutus", {
        title: "About Us",
        session: req.session.admin,
        privacy,
      });
    } catch (error) {
      throw error
    }
  },
  aboutusupdate: async (req, res) => {
    try {
      let data = await Model.cmsModel.update(req.body, {
        where: {
          type: "2",
        }, raw: true,
      })
      req.flash("success", "About us updated successfully");
      res.redirect(`back`);
    } catch (error) {
      throw error
    }
  },
  term: async (req, res) => {
    try {
      const privacy = await Model.cmsModel.findOne({
        where: { type: '3' },
      });
      res.render("cms/terms&conditions", {
        title: "Terms & Conditions",
        session: req.session.admin,
        privacy,
      });
    } catch (error) {
      throw error
    }
  },
  terms: async (req, res) => {
    try {
      let data = await Model.cmsModel.update(req.body, {
        where: {
          type: '3',
        }, raw: true
      })
      req.flash("success", "Terms & Conditions updated successfully");
      res.redirect(`back`);
    } catch (error) {
      throw error
    }
  },
  addCategory: async (req, res) => {
    try {
      res.render("category/categoryadd", {
        session: req.session.admin,
        title: "Add Category",
      });
    } catch (error) {
      throw error;
    }
  },
  createCategory: async (req, res, next) => {
    try {
      const v = new Validator(req.body, {
        name: "required",
        image: "string",

      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error(res, errorsResponse);
      }
      if (req.files && req.files.image) {
        let images = await helper.fileUpload(req.files.image);
        req.body.image = images;
      }
      const newService = await Model.categoryModel.create({
        name: req.body.name,
        image: req.body.image,
        status: "1",

      });
      req.flash("success", "Add category successfully");
      res.redirect('/categorylist');
    } catch (error) {
      throw error
    }
  },
  categoryList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Model.categoryModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("category/categorylist.ejs", {
        title: "Categories",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error
    }
  },
  categoryEditPage: async (req, res) => {
    try {
      const data = await Model.categoryModel.findOne({ where: { id: req.params.id } });
      res.render("category/categoryedit.ejs", {
        session: req.session.admin,
        title: "Edit Category",
        data,
      });
    } catch (error) {
      throw error;
    }
  },
  categoryEdit: async (req, res) => {
    try {
      let folder = "admin";
      const updatedata = {
        name: req.body.name,
      };

      if (req.files && req.files.image) {
        let image = await helper.fileUpload(req.files.image, folder);
        updatedata.image = image;
      }

      await Model.categoryModel.update(updatedata, {
        where: { id: req.params.id },
      });

      req.flash("success", "Preference updated successfully");
      res.redirect("/categorylist");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  categoryDetails: async (req, res) => {
    try {
      const data = await Model.categoryModel.findOne({
        where: { id: req.params.id },

      });

      res.render("category/categoryview.ejs", {
        session: req.session.admin,
        data,
        title: 'Category Details',
      });
    } catch (error) {
      throw error
    }
  },
  category_status: async (req, res) => {
    try {
      const result = await Model.categoryModel.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      if (result[0] === 1) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Status change failed" });
      }
    } catch (error) {
      throw error;
    }
  },
  deletecategory: async (req, res) => {
    try {
      const userId = req.params.id;
      const category = await Model.categoryModel.findByPk(userId);
      await Model.categoryModel.destroy({ where: { id: userId } });
      res.json({ success: true, message: "category deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
  addEvent: async (req, res) => {
    try {
      const category = await Model.categoryModel.findAll();
      const user = await Model.userModel.findAll({
        where: { role: '2' }
      });

      res.render("event/eventadd", {
        session: req.session.admin,
        title: "Add Event",
        category,
        user
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (req, res, next) => {
    try {
      const data = await Model.eventModel.create({
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        eventTime: req.body.eventTime,
        eventDate: req.body.eventDate,
        categoryId: req.body.categoryId,
        userId: req.body.userId,
      });

      const eventId = data.id;
      if (req.files && req.files.images) {
        let imagePaths = [];
        if (Array.isArray(req.files.images)) {
          imagePaths = await helper.fileUploads(req.files.images);
        } else {
          imagePaths = await helper.fileUploads([req.files.images]);
        }
        const imageData = imagePaths.map((filepath) => ({
          eventId: eventId,
          image: filepath,
        }));
        await Model.eventImagesModel.bulkCreate(imageData);
      }
      req.flash("success", "Event added successfully");
      res.redirect("/eventlist");
    } catch (error) {
      throw error
    }
  },
  eventList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Model.eventModel.findAndCountAll({
        include: [{ model: Model.userModel, as: 'user' }],
        include: [{ model: Model.categoryModel, as: 'category' }],
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("event/eventlist.ejs", {
        title: "Events",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error;
    }
  },
  eventView: async (req, res) => {
    try {
      const eventDetails = await Model.eventModel.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Model.userModel,
            as: 'user',
            where: { role: "2" },
          },
          {
            model: Model.categoryModel,
            as: 'category'
          },
          {
            model: Model.eventImagesModel,
            as: 'eventimages'
          }
        ]
      });

      res.render("event/eventview.ejs", {
        session: req.session.admin,
        eventDetails,
        title: 'Event Details',
      });
    } catch (error) {
      throw error
    }
  },
  eventStatus: async (req, res) => {
    try {
      const data = await Model.eventModel.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      if (data[0] > 0) {
        return res.status(200).json({ success: true, message: "Status updated successfully" });
      }
    } catch (error) {
      throw error
    }
  },
  eventDelete: async (req, res) => {
    try {
      const userId = req.params.id;
      const event = await Model.eventModel.findByPk(userId);
      await Model.eventModel.destroy({ where: { id: userId } });
      res.json({ success: true, message: "event deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
  createFaq: async (req, res, next) => {
    try {
      const data = await Model.faqModel.create({
        question: req.body.question,
        answer: req.body.answer,
        status: '1'
      });

      req.flash("success", "Prompt added successfully");
      res.redirect("/faqlist");
    } catch (error) {
      next(error);
    }
  },
  faqList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Model.faqModel.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("FAQ/faqlist.ejs", {
        title: "FAQ",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error
    }
  },
  faqAdd: async (req, res) => {
    try {
      res.render("FAQ/faqadd", {
        session: req.session.admin,
        title: "Add FAQ",
      });
    } catch (error) {
      throw error;
    }
  },
  faqEditPage: async (req, res) => {
    try {
      const data = await Model.faqModel.findOne({ where: { id: req.params.id } });
      res.render("FAQ/faqedit.ejs", {
        session: req.session.admin,
        title: "Edit FAQ",
        data,
      });
    } catch (error) {
      throw error;
    }
  },
  faqEdit: async (req, res) => {
    try {
      await Model.faqModel.update(
        {
          question: req.body.question,
          answer: req.body.answer,
        },
        {
          where: { id: req.params.id },
        }
      );
      req.flash("success", "Prefrence updated successfully");
      res.redirect("/faqlist");
    } catch (error) {
      throw error;
    }
  },
  faqStatus: async (req, res) => {
    try {
      const result = await Model.faqModel.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      if (result[0] === 1) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Status change failed" });
      }
    } catch (error) {
      throw error;
    }
  },
  faqDelete: async (req, res) => {
    try {
      const userId = req.params.id;
      const category = await Model.faqModel.findByPk(userId);
      await Model.faqModel.destroy({ where: { id: userId } });
      res.json({ success: true, message: "faq deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
  reviewList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Model.reviewModel.findAndCountAll({
        limit,
        offset,
        order: [["id", "DESC"]],
        include: [
          { model: Model.userModel, as: "userr", attributes: ["firstName", "lastName"] },
          { model: Model.userModel, as: "userrBy", attributes: ["firstName", "lastName"] },
        ],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("review/reviewlist.ejs", {
        title: "Reviews",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error;
 
    }
  },
  reviewStatus: async (req, res) => {
    try {
      const data = await Model.reviewModel.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      if (data[0] > 0) {
        return res.status(200).json({ success: true, message: "Status updated successfully" });
      }
    } catch (error) {
      throw error
    }

  },
  reviewDelete: async (req, res) => {
    try {
      const userId = req.params.id;
      const review = await Model.reviewModel.findByPk(userId);
      await Model.reviewModel.destroy({ where: { id: userId } });
      res.json({ success: true, message: "review deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
  reviewDetails: async (req, res) => {
    try {
      const data = await Model.reviewModel.findOne({
        where: { id: req.params.id },
        include: [
          { model: Model.userModel, as: "userr", attributes: ["firstName", "lastName"] },
          { model: Model.userModel, as: "userrBy", attributes: ["firstName", "lastName"] },
        ],
      });

      if (!data) {
        return res.status(404).render("404", { message: "Review not found" });
      }

      res.render("review/reviewview.ejs", {
        title: "Review Details",
        data,
        session: req.session.admin,
      });
    } catch (error) {
      console.error("Error in reviewDetails:", error);
      res.status(500).render("500", { message: "Internal Server Error" });
    }
  },
  giveawayList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      const { count, rows } = await Model.giveawayModel.findAndCountAll({
        limit,
        offset,
        order: [["id", "DESC"]],
        include: [
          {
            model: Model.userModel,
            as: "sender",
           
          },
          {
            model: Model.userModel,
            as: "receiver",
           
          },
          {
            model: Model.eventModel,
            as: "event",
        
          },
        ],
      });
  
      const totalPages = Math.ceil(count / limit);
  
      res.render("giveaway/giveawaylist.ejs", {
        title: "Giveaways",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      throw error;
    }
  },
  giveawayDelete: async (req, res) => {
    try {
      const userId = req.params.id;
      const giveaway = await Model.giveawayModel.findByPk(userId);
      await Model.giveawayModel.destroy({ where: { id: userId } });
      res.json({ success: true, message: "giveaway deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
 
};

















