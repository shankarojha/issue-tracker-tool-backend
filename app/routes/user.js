const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const issueController = require("./../../app/controllers/issueController");
const commentController = require("./../controllers/commentController");
const watcherController = require("./../controllers/watcherController");
const notificationController = require("./../controllers/notificationController")
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')
const multerLib = require('./../multer/multer')
const passport = require('passport')
const mongoose = require('mongoose')
const UserModel = mongoose.model('User')


module.exports.setRouter = (app, passport) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.


    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {number} mobileNumber mobileNumber of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User created or updated",
            "status": 200,
            "data": {
                "userId": "dKaoliVLi",
                "firstName": "ram",
                "lastName": "hilton",
                "userName": "ram@gmail.com",
                "email": "ram@gmail.com",
                "mobileNumber": 7992202173,
                "socialLoginFlag": false,
                "localLoginFlag": true,
                "_id": "6d85a519bf182d249c3eb598",
                "__v": 0
            }
        }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "ulkhbasjkadI1NiIsInR5cCI6IkpXVCJ9.ghjik3RpZCI6IlVPS2duMnVtNyIsImlhdCI6MTU2Mzk5MzYyNTg1MSwiZXhwIjoxNTY0MDgwMDI1ODUxLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZC1wMS1Jc3N1ZVRyYWNrZXJUb29sIiwiZGF0YSI6eyJ1c2VySWQiOiJzTmF6T3VWTGkiLCJmaXJzdE5hbWUiOiJyaWNrZXkiLCJsYXN0TmFtZSI6InBvaW50aW5nIiwidXNlck5hbWUiOoPugWNrZXlAZ21haWwuY29tIiwiZW1haWwiOiJyaWNrKLOAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjo5ODAwOTc4OTU2LCJzb2NpYWxMb2dpbkZsYWciOmZhbHNlLCJsb2NhbExvZ2ohyrtnZyI6dHJ1ZX19.wnokKu5unc-8l2JyLloJfggi5axij-kjhee85HVlJr0",
                "userDetails": {
                    "userId": "dKaoliVLi",
                    "firstName": "ram",
                    "lastName": "hilton",
                    "userName": "ram@gmail.com",
                    "email": "ram@gmail.com",
                    "mobileNumber": 7992202173,
                    "socialLoginFlag": false,
                    "localLoginFlag": true
                }
            }
        }
    */

    // auth token params: userId.
    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null
        }
    */

    app.get(`${baseUrl}/view/allUsers`, auth.isAuthorized, userController.getAllUsers);

    /**
     * 
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/view/allUsers to get all users on the system.
     * @apiParam {string} authToken authToken of the loggedin user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": " user Found on system",
            "status": 200,
            "data": [
                {
                    "userId": "vgia1t1JF",
                    "firstName": "harry",
                    "lastName": "mehra",
                    "userName": "harry@gmail.com",
                    "password": "6974c6c0e5e98d1beeaf7d7b398cuo65",
                    "email": "harry@gmail.com",
                    "mobileNumber": 9794848220,
                    "socialLoginFlag": false,
                    "localLoginFlag": true,
                    "_id": "5d231354a97bbc5efd7dc2c6",
                    "__v": 0
                },
                {
                    "userId": "bkofKy-cdo",
                    "firstName": "tom",
                    "lastName": "dubey",
                    "userName": "tom@gmail.com",
                    "password": "6974c6c0e5e98d1beeaf7d7b398cuo65",
                    "email": "tom@gmail.com",
                    "mobileNumber": 8598071964,
                    "socialLoginFlag": false,
                    "localLoginFlag": true,
                    "_id": "8h6o394e587eeb715071c635",
                    "__v": 0
                },
                {
                    "userId": "dKaoliVLi",
                    "firstName": "ram",
                    "lastName": "hilton",
                    "userName": "ram@gmail.com",
                    "password": "75a73343e7ee24d83a3c4d6b53377d28",
                    "email": "ram@gmail.com",
                    "mobileNumber": 7992202173,
                    "socialLoginFlag": false,
                    "localLoginFlag": true,
                    "_id": "5d38a519bf182d249c3eb588",
                    "__v": 0
                }
            ]
        }
    */

    //params: userId,authToken.
    app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);

    /**
     * 
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/:userId/details to get user details.
     * 
     * @apiParam {string} userId userId of the user. (query params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * 
     * {
            "error": false,
            "message": " User Details Found",
            "status": 200,
            "data": {
                "userId": "bkofKy-cdo",
                "firstName": "tom",
                "lastName": "dubey",
                "userName": "tom@gmail.com",
                "email": "tom@gmail.com",
                "mobileNumber": 8598071964,
                "socialLoginFlag": false,
                "localLoginFlag": true
            }
        }
     *
     *
     */


    //params: authToken.
    app.get(`${baseUrl}/get/Details/full`, userController.getInfoForToken);

    /**
     * 
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/get/Details/full to get user details via authToken.
     * 
     * @apiParam {string} authToken authToken of the user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * 
     * {
            "error": false,
            "message": "get User Details",
            "status": 200,
            "data": {
                "jwtid": "7Thif7kMp",
                "iat": 1564037969781,
                "exp": 1564124369781,
                "sub": "authToken",
                "iss": "ed-p1-IssueTrackerTool",
                "data": {
                    "userId": "dKaoliVLi",
                    "firstName": "ram",
                    "lastName": "hilton",
                    "userName": "ram@gmail.com",
                    "email": "ram@gmail.com",
                    "mobileNumber": 7992202173,
                    "socialLoginFlag": false,
                    "localLoginFlag": true
                }
            }
        }
     *
     *
     */

    // _______________ route for issue. _______________________________.


    //params: status,title,description,reporterName,assigneeName,reporterEmail,assigneeEmail,image.
    app.post(`${baseUrl}/create/issue`, auth.isAuthorized, multerLib.upload.single('image'), issueController.createNewIssue);

    /**
     * 
     * @apiGroup issues
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/create/issue to create new issue.
     * 
     * @apiParam {string} status status of the issue. (body params(form-data)) (required).
     * @apiParam {string} title title of the issue. (body params(form-data)) (required).
     * @apiParam {string} description description of the issue. (body params(form-data)) (required).
     * @apiParam {string} reporterName reporterName of the issue. (body params(form-data)) (required).
     * @apiParam {string} reporterEmail reporterEmail of the issue. (body params(form-data)) (required).
     * @apiParam {string} assigneeName assigneeName of the issue. (body params(form-data)) (required).
     * @apiParam {string} assigneeEmail assigneeEmail of the issue. (body params(form-data)) (required).
     * @apiParam {file} image image of the issue. (body params(form-data)) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "new issue created successfully",
            "status": 200,
            "data": {
                "issueId": "KGoTmDswx",
                "title": "test tiltle again1234",
                "description": "test description 234542",
                "screenshotName": "2568895_Screenshot from 2021-06-01 16-27-32.jpeg",
                "screenshotPath": "uploads/2568895_Screenshot from 2021-06-01 16-27-32.jpeg",
                "_id": "5d395492bf182d249c3eb58a",
                "reporterEmail": "tom@gmail.com",
                "assigneeEmail": "harry@gmail.com",
                "reporterName": "Tom",
                "assigneeName": "harry",
                "status": "done1",
                "creationDate": "2021-06-02T07:04:50.000Z",
                "lastestModificationDate": "2021-06-02T07:04:50.000Z",
                "__v": 0
            }
        }
     * 
     */

    //params: authToken.
    app.get(`${baseUrl}/get/allIssues`, auth.isAuthorized, issueController.getAllIssueOnSystem);

    /**
     * 
     * @apiGroup issues
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/get/allIssues to get all issues on the system.
     * 
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "All issue details found",
            "status": 200,
            "data": [
                {
                    "issueId": "A",
                    "title": "test title1",
                    "description": "<p>uophjl</p>",
                    "screenshotName": "1563908630599_test1.jpeg",
                    "screenshotPath": "uploads/1563908630599_test1.jpeg",
                    "reporterEmail": "tom@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "tom dubey",
                    "assigneeName": "tom dubey",
                    "status": "In-BackLog",
                    "creationDate": "2021-06-03T19:03:50.000Z",
                    "lastestModificationDate": "2021-06-03T19:03:50.000Z"
                },
                {
                    "issueId": "GMZZzdrGP",
                    "title": "tttle",
                    "description": "<p>hgjuik</p>",
                    "screenshotName": "1563882115633_test1.jpeg",
                    "screenshotPath": "uploads/1563882115633_test1.jpeg",
                    "reporterEmail": "tom@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "tom dubey",
                    "assigneeName": "tom dubey",
                    "status": "Done",
                    "creationDate": "2021-06-03T11:41:56.000Z",
                    "lastestModificationDate": "2021-06-03T11:41:56.000Z"
                },
                {
                    "issueId": "VLbHBQHNK",
                    "title": "totle",
                    "description": "<p>kjifkf</p>",
                    "screenshotName": "1563733678893_test1.jpeg",
                    "screenshotPath": "uploads/1563733678893_test1.jpeg",
                    "reporterEmail": "tom@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "tom dubey",
                    "assigneeName": "tomdubey",
                    "status": "In-BackLog",
                    "creationDate": "2021-06-02T18:27:59.000Z",
                    "lastestModificationDate": "2021-06-02T18:27:59.000Z"
                },
                {
                    "issueId": "kzDinp_ij",
                    "title": "title23",
                    "description": "<p>klikk</p>",
                    "screenshotName": "1563733606176_test1.jpeg",
                    "screenshotPath": "uploads/1563733606176_test1.jpeg",
                    "reporterEmail": "tom@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "tom dubey",
                    "assigneeName": "tomdubey",
                    "status": "In-BackLog",
                    "creationDate": "2021-06-02T18:26:47.000Z",
                    "lastestModificationDate": "2021-06-02T18:26:47.000Z"
                }
            ]
        }
     * 
     */


    //params: email,authToken.
    app.get(`${baseUrl}/userIssues/:email`, auth.isAuthorized, issueController.getAllAssingedIssueOfAUser);

    /**
     * 
     * @apiGroup issues
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/userIssues/:email to get issues assigned to the user.
     * 
     * @apiParam {string} email email of the user. (query params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "Issues  Found",
            "status": 200,
            "data": [
                {
                    "issueId": "uo32hbGHJk",
                    "title": "test 1234huhifh",
                    "description": "<p>dvfbh gj</p>",
                    "screenshotName": "1563965971627_Screenshot from 2021-06-01 16-27-32.jpeg",
                    "screenshotPath": "uploads/1563965971627_Screenshot from 2021-06-01 16-27-32.jpeg",
                    "reporterEmail": "harry@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "harry mehra",
                    "assigneeName": "tom dubey",
                    "status": "In-BackLog",
                    "creationDate": "2021-06-03T10:59:31.000Z",
                    "lastestModificationDate": "2021-06-03T10:59:31.000Z"
                },
                {
                    "issueId": "m-Y6f2S8A",
                    "title": "test title1",
                    "description": "<p>asdfgh</p>",
                    "screenshotName": "1563908630599_test1.jpeg",
                    "screenshotPath": "uploads/1563908630599_test1.jpeg",
                    "reporterEmail": "tom@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "tom dubey",
                    "assigneeName": "tom dubey",
                    "status": "In-BackLog",
                    "creationDate": "2021-06-03T19:03:50.000Z",
                    "lastestModificationDate": "2021-06-03T19:03:50.000Z"
                }
            ]
        }
     * 
     */

    //params: issueId,authToken.
    app.get(`${baseUrl}/issueDetails/:issueId`, auth.isAuthorized, issueController.getSingleIssueDetails);

    /**
     * 
     * @apiGroup issues
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/issueDetails/:issueId to get issue details of an issue.
     * 
     * @apiParam {string} issueId issueId of an issue. (query params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "Issue details found",
            "status": 200,
            "data": {
                "issueId": "kzDinp_ij",
                "title": "title23",
                "description": "<p>sdfgh</p>",
                "screenshotName": "1563733606176_test1.jpeg",
                "screenshotPath": "uploads/1563733606176_test1.jpeg",
                "reporterEmail": "tom@gmail.com",
                "assigneeEmail": "tom@gmail.com",
                "reporterName": "tom dubey",
                "assigneeName": "tomdubey",
                "status": "In-BackLog",
                "creationDate": "2021-06-02T18:26:47.000Z",
                "lastestModificationDate": "2021-06-02T18:26:47.000Z"
            }
        }
     * 
     */

    //params: issueId,authToken
    app.put(`${baseUrl}/editIssue/:issueId`, auth.isAuthorized, multerLib.upload.single('image'), issueController.editAnExistingIssue);

    /**
     * 
     * @apiGroup issues
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/editIssue/:issueId to edit an issue .
     * 
     * @apiParam {string} issueId issueId of the issue. (query params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "Issue details edited",
            "status": 200,
            "data": {
                "n": 1,
                "nModified": 1,
                "ok": 1
            }
        }
     * 
     */


    // _______________________route for comment. ________________________.

    //params: issueId,comment,commenter,commenterEmail,authToken.
    app.post(`${baseUrl}/create/comment`, auth.isAuthorized, commentController.createNewComment);

    /**
     * 
     * @apiGroup comment
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/create/comment to comment on an issue .
     * 
     * @apiParam {string} issueId issueId of an issue. (body params) (required).
     * @apiParam {string} comment comment on an issue. (body params) (required).
     * @apiParam {string} commenter commenter of an issue. (body params) (required).
     * @apiParam {string} commenterEmail commenterEmail of an issue. (body params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "Commented created&saved successfully",
            "status": 200,
            "data": {
                "commentId": "q-_9bfJ4N",
                "relatedIssuesId": "hdxVRXUpB",
                "comment": "new comment",
                "commenter": "harry mehra",
                "commenterEmailId": "harry@gmail.com",
                "createdOn": "2021-06-02T07:38:18.000Z",
                "_id": "5d395c6abf182d249c3eb58e",
                "__v": 0
            }
        }
     * 
     */


    //params: issueId,authToken
    app.get(`${baseUrl}/:issueId/view/comment`, auth.isAuthorized, commentController.readComment);

    /**
     * 
     * @apiGroup comment
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/:issueId/view/comment to view comments of an issue .
     * 
     * @apiParam {string} issueId issueId of the issue. (query params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "Commented created&saved successfully",
            "status": 200,
            "data": {
                "commentId": "q-_9bfJ4N",
                "relatedIssuesId": "hdxVRXUpB",
                "comment": "new comment",
                "commenter": "harry mehra",
                "commenterEmailId": "harry@gmail.com",
                "createdOn": "2021-06-02T07:38:18.000Z",
                "_id": "5d395c6abf182d249c3eb58e",
                "__v": 0
            }
        }
     * 
     */


    // _______________________route for watcher. _________________________.



    //params: issueId,watcherEmail,authToken
    app.post(`${baseUrl}/add/as/watcher`, auth.isAuthorized, watcherController.addWatcherToAnIssue);

    /**
     * 
     * @apiGroup watcher
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/add/as/watcher to add as a watcher for an issue .
     * 
     * @apiParam {string} issueId issueId of the issue. (body params) (required).
     * @apiParam {string} watcherEmail watcherEmail of the user to add as watcher. (body params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "watcher Added",
            "status": 200,
            "data": {
                "watcherId": "t8mFdZJc0",
                "issueId": "hdxVRXUpB",
                "watcherEmail": "tom@gmail.com",
                "createdOn": "2021-06-02T08:08:49.000Z",
                "_id": "5d396391bf182d249c3eb592",
                "__v": 0
            }
        }
     * 
     */



    //params: issueId,authToken.
    app.get(`${baseUrl}/:issueId/get/watcherList`, auth.isAuthorized, watcherController.getAllWatchersOfAnIssue);

    /**
     * 
     * @apiGroup watcher
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/:issueId/get/watcherList to get watcherList of an issue .
     * 
     * @apiParam {string} issueId issueId of the issue. (query params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "All Watcher Found Successfully",
            "status": 200,
            "data": [
                {
                    "watcherId": "cir-CpcA4",
                    "issueId": "hdxVRXUpB",
                    "watcherEmail": "harry@gmail.com",
                    "createdOn": "2021-06-02T11:37:22.000Z"
                },
                {
                    "watcherId": "t8mFdZJc0",
                    "issueId": "hdxVRXUpB",
                    "watcherEmail": "tom@gmail.com",
                    "createdOn": "2021-06-02T08:08:49.000Z"
                }
            ]
        }
     * 
     */


    // _______________________ route for search. ___________________________.



    //params: text,authToken
    app.get(`${baseUrl}/issue/:text/search`, auth.isAuthorized, issueController.searchIssue);

    /**
     * 
     * @apiGroup searchIssue
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/issue/:text/search to search for issues for the give text .
     * 
     * @apiParam {string} text text for search. (query params) (required).
     * @apiParam {string} authToken authToken of the loggedIn user. (query params) (required).
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "issues present by this search text",
            "status": 200,
            "data": [
                {
                    "issueId": "GMZZzdrGP",
                    "title": "tttle",
                    "description": "<p>sdgh</p>",
                    "screenshotName": "1563882115633_test1.jpeg",
                    "screenshotPath": "uploads/1563882115633_test1.jpeg",
                    "_id": "5d36f284d5e6ae4f77d58057",
                    "reporterEmail": "tom@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "tom dubey",
                    "assigneeName": "tom dubey",
                    "status": "Done",
                    "creationDate": "2021-06-03T11:41:56.000Z",
                    "lastestModificationDate": "2021-06-03T11:41:56.000Z",
                    "__v": 0
                },
                {
                    "issueId": "hEME6iNP8",
                    "title": "title 31",
                    "description": "<p>dfghdhgj</p>",
                    "screenshotName": "1563731840433_test1.jpeg",
                    "screenshotPath": "uploads/1563731840433_test1.jpeg",
                    "_id": "5d34a7809308c919fad51cc1",
                    "reporterEmail": "tom@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "tom dubey",
                    "assigneeName": "tom dubey",
                    "status": "Done",
                    "creationDate": "2021-06-02T17:57:20.000Z",
                    "lastestModificationDate": "2021-06-02T17:57:20.000Z",
                    "__v": 0
                }
            ]
        }
     * 
     */




    //params: notificationId,authToken
    app.get(`${baseUrl}/mark/notification/seen`, auth.isAuthorized, notificationController.markNotificationAsSeen);

    /**
     * 
     * 
     * @apiGroup notification
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/mark/notification/seen to mark notification as seen.
     *
     * @apiParam {string} notificationId notificationId of the user. (Send notificationId as query parameter) (required)
     * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "Marked As Seen",
            "status": 200,
            "data": {
                "notificationId": "Ie5imZG8ol",
                "notificationStatus": "un-seen",
                "userEmailToSendNotification": "tom@gmail.com",
                "_id": "5d396823bf182d249c3eb594",
                "notificationIssueData": {
                    "issueId": "-UWgkhljG",
                    "title": "test 3",
                    "description": "test description 234542",
                    "screenshotName": "1564043299230_jeep_n.jpg",
                    "screenshotPath": "uploads/1564043299230_jeep_n.jpg",
                    "_id": "5d396823bf182d249c3eb593",
                    "reporterEmail": "tom@gmail.com",
                    "assigneeEmail": "tom@gmail.com",
                    "reporterName": "Tom",
                    "assigneeName": "tom",
                    "status": "done1",
                    "creationDate": "2021-06-02T08:28:19.000Z",
                    "lastestModificationDate": "2021-06-02T08:28:19.000Z",
                    "__v": 0
                },
                "notificationMessage": "hey a new issue is created with IssueId-UWgkhajG by Tom",
                "notificationPurpose": "create",
                "__v": 0
            }
        }
     * 
     */





    


    

// _______________________ route for social login. ___________________________.


    app.get('/login/facebook',
        passport.authenticate('facebook', { scope: ['email'] }
        ));

    // handle the callback after facebook has authenticated the user
    app.get('/login/facebook/callback',
        passport.authenticate('facebook', {
            // successRedirect : '/',
            // failureRedirect: '/home'
        }), userController.socialLogin
    );

    

    app.get('/api/logout', (req, res) => {
        // req.logout();
        // res.redirect('/');
        res.send(req.logout());

    })

}
