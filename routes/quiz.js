const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid")
const Quiz = require("../models/quizmodel");
const User = require("../models/user");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");



const router = express.Router();

//Create the form for quiz 
router.post("/create",ensureAuthenticated,async (req, res, next) => {
	
			const quiz = new Quiz({
				_id: new mongoose.Types.ObjectId(),
				quizTitle: req.body.quizTitle,
				quizSubject:req.body.quizSubject,
				quizDate: req.body.quizDate,
				quizTime: req.body.quizTime,
				quizDuration: req.body.quizDuration,
				quizCode: shortid.generate(),
				question: req.body.question,
				
			});
			quiz.save()
				.then(async (result) => {
					console.log(result._id)
					const quizId = result._id;
					console.log(req.user)
					User.updateOne(
						{ user_id: req.user.user_id },
						{ $push: { quizzes: { quiz_id : quizId }
						  } }
					)
					.then(async (result1) => {
						console.log("success quiz added in user")
						res.status(200).json({
							message: "created quiz",
							result,
						});
					})
					.catch(async (err) => {
						console.log(err)
						res.status(400).json({ error: "err1" });
					});
					//res.status(200).json({ message: "created quiz",result });
				})
				.catch((err) => {
					console.log(err)
					res.status(400).json({ error: "err" });
				});
		
            });


			//Edit the quiz
router.put('/update/:id', async function(req, res)  {
				let quiz = await Quiz.findById(req.params.id)
				
				quiz.quizTitle= req.body.quizTitle
				quiz.quizSubject = req.body.quizSubject
				quiz.quizDate = req.body.quizDate
				quiz.quizTime =  req.body.quizTime
				quiz.quizDuration = req.body.quizDuration
				quiz.question =  req.body.question
				
			
				quiz.save()
				.then(async (result) => {
					console.log("updated quiz")
					res.status(200).json({ message: "updated quiz",result });
				})
				.catch((err) => {
					console.log(err)
					res.status(400).json({ error: "err" });
				});
		
			
			  
			  })

//delete quiz
router.delete('/delete/:id', async (req, res) => {
				await Quiz.findByIdAndDelete(req.params.id)
				console.log("deleted quiz")
				res.status(200).json({ message: "deleted quiz"});
			  })			  
module.exports = router;