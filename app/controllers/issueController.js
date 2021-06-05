const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const events = require('events');
const eventEmitter = new events.EventEmitter();
const fs = require("fs");
/* Models */
const IssueModel = mongoose.model('Issues')

const notificationController = require('./notificationController')


let createNewIssue = (req, res) => {

    let validateIssueInput = () => {

        return new Promise((resolve, reject) => {
            if (req.body.reporterEmail && req.body.assigneeEmail) {
                if (!(validateInput.Email(req.body.reporterEmail)) || !(validateInput.Email(req.body.assigneeEmail))) {
                    let apiResponse = response.generate(true, 'Reporter\'s Email or Assignee\'s Email is not correct', 400, null)
                    reject(apiResponse)
                }
                else {
                    resolve(req)
                }
            } else {
                logger.error('Emails fields Missing During Issue Creation', 'IssueController: createNewIssue()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate event input

    let createIssue = () => {
        return new Promise((resolve, reject) => {
            let fileName = req.file.path.split('\\')[0]

            console.log('filepath', fileName)

            console.log("filein req", req.file)
            let newIssue = new IssueModel({
                issueId: shortid.generate(),
                title: req.body.title,
                reporterEmail: req.body.reporterEmail,
                assigneeEmail: req.body.assigneeEmail,
                reporterName: req.body.reporterName,
                assigneeName: req.body.assigneeName,
                status: req.body.status,
                creationDate: time.now(),
                lastestModificationDate: time.now(),
                description: req.body.description,
                screenshotName: req.file.filename,
                screenshotPath: fileName
            })

            newIssue.save((err, newIssue) => {
                if (err) {
                    console.log("error while saving new issue: ", err)
                    logger.error(err.message, 'IssueController: createIssue', 10)
                    let apiResponse = response.generate(true, 'Failed to create&save new Issue', 500, null)
                    reject(apiResponse)
                }
                else {
                    let newIssueObj = newIssue.toObject();
                    console.log("new issue created "+ newIssueObj)

                    //emitting issue creation for listening and notifiaction and finally resolving the issue object
                    eventEmitter.emit("new-issue-created & saved", newIssueObj);
                    resolve(newIssueObj)

                }
            })
        })
    }//end of create new issue


    validateIssueInput(req, res)
        .then(createIssue)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'new issue created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}    // end of createNewIssue


// on emitting the created-issue sending it to the notificationController 
eventEmitter.on("new-issue-created & saved", (issueData) => {


    notificationController.createANewNotificationObj(issueData)

})



let editAnExistingIssue = (req, res) => {

    if (req.file) {

        console.log(req.file)
        let fileName = req.file.path.split('\\')[0]

        let options = req.body;
        options.screenshotName = req.file.filename;
        options.screenshotPath = fileName
        IssueModel.updateOne({ 'issueId': req.params.issueId }, options)
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'issueController: editAnExistingIssue', 10)
                let apiResponse = response.generate(true, 'Failed', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'issueController: editAnExistingIssue')
                let apiResponse = response.generate(true, 'No Issue Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log("issue details edited");
                let apiResponse = response.generate(false, 'Issue details edited', 200, result)
                
                //emitting edited issue to notification
                eventEmitter.emit("issue-edited", req.params.issueId);

                res.send(apiResponse)
            }
        })
    }

    else {

        let options = req.body;
        options.screenshot = req.body.previous;
        IssueModel.updateOne({ 'issueId': req.params.issueId }, options)
            .exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'issueController: editIssue', 10)
                    let apiResponse = response.generate(true, 'Failed To edit issue details', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Issue Found', 'issueController: editIssue')
                    let apiResponse = response.generate(true, 'No Issues Found', 404, null)
                    res.send(apiResponse)
                } else {
                    console.log("Successfully edited the issue");
                    let apiResponse = response.generate(false, 'Issue details edited', 200, result)
                   
                    // emitting edited issue for notification
                    eventEmitter.emit("issue-edited", req.params.issueId);

                    res.send(apiResponse)
                    console.log(result);
                }
            })
    }


} //end of editIssue function.

eventEmitter.on("issue-edited", (issueData) => {

    IssueModel.findOne({ 'issueId': issueData })
        .select('-__v -_id')
        .exec((err, result) => {
            if (err) {
                console.log(err);
                logger.error(err.message, 'issueController: eventEmitter.on-> new issue created', 10)

            } else if (check.isEmpty(result)) {
                logger.info('No Issue found', 'issueController: eventEmitter.on-> new issue created')

            } else {
                logger.info('Issue found', 'issueController: eventEmitter.on-> new issue created');

                notificationController.createANewNotificationObjOnEdit(result);
            }
        })


})

let deleteAnIssue = (req, res) => {

    IssueModel.findOneAndDelete({ 'issueId': req.params.issueId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'issueController: deleteIssue', 10)
            let apiResponse = response.generate(true, 'Failed To delete issue', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Issue Found', 'issueController: deleteIssue')
            let apiResponse = response.generate(true, 'No Issue Found', 404, null)
            res.send(apiResponse)
        } else {
            console.log("result to test in delete", result)
            console.log("result screenshot to test in delete", result.screenshotPath)

            console.log("issue deleted successfully");
            let apiResponse = response.generate(false, 'Issue is deleted  successfully', 200, result)
            res.send(apiResponse)
        }
    })
}


let getAllAssingedIssueOfAUser = (req, res) => {

    IssueModel.find({ 'assigneeEmail': req.params.email })
        .select('-__v -_id')
        .sort('-lastestModificationDate')
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Issue Controller: getAllAssingedIssueOfAUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Issue Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'Issue Controller: getAllAssingedIssueOfAUser', 10)
                let apiResponse = response.generate(true, 'No Issue Found ', 404, null)

                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Issues  Found', 200, result)
                res.send(apiResponse)
            }

        })

}

let getSingleIssueDetails = (req, res) => {
    IssueModel.findOne({ 'issueId': req.params.issueId })
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err);
                logger.error(err.message, 'issueController: getSingleIssueDetails', 10)
                let apiResponse = response.generate(true, 'Failed To Find Issue Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue found', 'issueController: getSingleIssueDetails')
                let apiResponse = response.generate(true, 'No issue details found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info('Issue found', 'issueController: getSingleIssueDetails');
                let apiResponse = response.generate(false, 'Issue details found', 200, result)
                res.send(apiResponse)
            }
        })
} //end of getSingleIssueDetails function.


let getAllIssueOnSystem = (req, res) => {
    IssueModel.find()
        .select('-__v -_id')
        .sort('-lastestModificationDate')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err);
                logger.error(err.message, 'issueController: getAllIssueOnSystem', 10)
                let apiResponse = response.generate(true, 'Failed To Find Issue Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue found', 'issueController: getAllIssueOnSystem')
                let apiResponse = response.generate(true, 'No issue found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info('Issue found', 'issueController: getAllIssueOnSystem');
                let apiResponse = response.generate(false, 'All issue details found', 200, result)
                res.send(apiResponse)
            }
        })
}  // end of getAllIssue function.



let searchIssue = (req, res) => {
    console.log("in text searck", req.params.text)


    IssueModel.find({ $text: { $search: req.params.text } })

        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'issueController: searchIssue', 10)
                let apiResponse = response.generate(true, 'Failed To find text', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'issueController: searchIssue')
                let apiResponse = response.generate(true, 'No issue present with this search text', 404, null)
                res.send(apiResponse)
            } else {
                logger.info('Issues found', "issueController:searchIssue");
                let apiResponse = response.generate(false, "issues present by this search text", 200, result);
                res.send(apiResponse);
            }
        })



}

module.exports = {
    createNewIssue: createNewIssue,
    editAnExistingIssue: editAnExistingIssue,
    getAllIssueOnSystem: getAllIssueOnSystem,
    getAllAssingedIssueOfAUser: getAllAssingedIssueOfAUser,
    getSingleIssueDetails: getSingleIssueDetails,
    searchIssue: searchIssue,
    deleteAnIssue: deleteAnIssue
}
