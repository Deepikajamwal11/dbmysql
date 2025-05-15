var express = require("express");
var router = express.Router();
const adminController = require('../controllers/adminController');
const checkAdminSession = require('../helpers/helper');

router.get('/login', adminController.login);
router.post('/loginpost', adminController.loginpost);
router.use(checkAdminSession.checkAdminSession);

router.get('/dashboard',adminController.dashboard);
router.get('/profile',adminController.profile);
router.post('/profileupdate',adminController.editProfile);
router.get('/password',adminController.password)
router.post('/updatepassword',adminController.updatepassword)
router.get('/logout',adminController.logout);

//router for users
router.get('/userlist',adminController.userList);
router.get('/userDetails/:id',adminController.userDetails);
router.post('/userDelete/:id',adminController.userDelete);
router.post('/userStatus',adminController.userStatus);

// router for interest
router.post('/createinterest', adminController.createInterest);
router.get('/interestlist',adminController.interestList);
router.post('/intereststatus',adminController.interestStatus);
router.post('/deleteinterest/:id',adminController.interestDelete);
router.get('/addinterest',adminController.addInterest);
router.get('/interestedit/:id',adminController.interestEditPage);
router.post('/interestupdate/:id',adminController.editInterest);


//router for prefrence
router.post('/createprefrence', adminController.createPrefrence);
router.get('/prefrencelist',adminController.prefrenceList);
router.post('/prefrencestatus',adminController.prefrenceStatus);
router.post('/deleteprefrence/:id',adminController.prefrenceDelete);
router.get('/addprefrence',adminController.addPrefrence);
router.get('/prefrenceedit/:id',adminController.prefrenceEditPage);
router.post('/prefrenceupdate/:id',adminController.prefrenceEdit);

//router for contact us
router.get('/contacts',adminController.getcontacts);
router.post('/deletecontact/:id',adminController.deletecontact);
router.get('/viewcontact/:id',adminController.contactview);

//router for cms
router.get('/privacypolicy', adminController.privacy);
router.post('/privacypolicy', adminController.privacy_update);
router.get('/aboutus', adminController.aboutus);
router.post('/aboutus', adminController.aboutusupdate);
router.get('/term&conditions',adminController.term);
router.post('/term&conditions', adminController.terms);

// router for category
router.post('/createcategory', adminController.createCategory);
router.get('/categorylist',adminController.categoryList);
router.get('/categoryedit/:id',adminController.categoryEditPage);
router.post('/categoryupdate/:id',adminController.categoryEdit);
router.get('/categoryDetails/:id',adminController.categoryDetails);
router.post('/categorystatus',adminController.category_status);
router.post('/deletecategory/:id',adminController.deletecategory);
router.get('/addcategory',adminController.addCategory);

// router for addEvent
router.post('/createevent',adminController.createEvent);
router.get('/eventlist',adminController.eventList);
router.get('/addevent',adminController.addEvent);
router.get('/eventDetails/:id',adminController.eventView);
router.post('/eventstatus',adminController.eventStatus)
router.post('/deleteevent/:id',adminController.eventDelete);


//router for providers
router.get('/providerlist',adminController.providerList);
router.get('/providerdetails/:id',adminController.providerDetails);

// router for faq
router.post('/createfaq',adminController.createFaq);
router.get('/faqlist',adminController.faqList);
router.get('/addfaqlist',adminController.faqAdd);
router.get('/faqedit/:id',adminController.faqEditPage);
router.post('/updatefaq/:id',adminController.faqEdit);

router.post('/faqStatus',adminController.faqStatus);
router.post('/deletefaq/:id',adminController.faqDelete);

//router for reviewlist

router.get('/reviewlist',adminController.reviewList);
router.post('/reviewstatus',adminController.reviewStatus);
router.post('/deletereview/:id',adminController.reviewDelete);
router.get('/reviewdetails/:id',adminController.reviewDetails);

// router for giveaway
router.get('/giveawaylist',adminController.giveawayList)
router.post('/deletegiveaway/:id',adminController.giveawayDelete);

module.exports = router;
