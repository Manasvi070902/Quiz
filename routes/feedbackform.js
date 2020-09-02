const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid")
const Form = require("../models/form");
const User = require("../models/user");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");




const router = express.Router();

//Create feedbackform
router.post("/create", ensureAuthenticated,async (req, res, next) => {
	
	const form = new Form({
		_id: new mongoose.Types.ObjectId(),
		
		formTitle: req.body.formTitle,
		formDescription:req.body.formDescription,
		formCode: shortid.generate(),
		question: req.body.question,
		
	});
	form.save()
		.then(async (result) => {
			// console.log("created form")
			// res.status(200).json({ message: "created form",result });
			const formId = result._id;
					console.log(req.user)
					User.updateOne(
						{ user_id: req.user.user_id },
						{ $push: { forms: { form_id : formId }
						  } }
					)
					.then(async (sucess) => {
						console.log("success form added in user")
						res.status(200).json({
							message: "created form",
							result,
						});
					})
		})
		.catch((err) => {
			console.log(err)
			res.status(400).json({ error: "err" });
		});

	});


//Edit the form
router.put('/update/:id', async function(req, res)  {
				let form = await Form.findById(req.params.id)
			
				 form.formTitle =  req.body.formTitle
				 form.formDescription = req.body.formDescription
				 form.question = req.body.question
		
				
			
				form.save()
				.then(async (result) => {
					console.log("updated form")
					res.status(200).json({ message: "updated form",result });
				})
				.catch((err) => {
					console.log(err)
					res.status(400).json({ error: "err" });
				});
		
			
			  
			})

//delete form
router.delete('/delete/:id', async (req, res) => {
				await Form.findByIdAndDelete(req.params.id)
				console.log("deleted form")
				res.status(200).json({ message: "deleted form"});
			  })

module.exports = router;