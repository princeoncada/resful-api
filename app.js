const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

	.get((req, res) => {
		Article.find({}, (err, articles) => {
			if (!err) res.send(articles);
			else res.send(err);
		});
	})

	.post((req, res) => {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content,
		});

		newArticle.save((err) => {
			if (!err) res.send("Successfully added new article.");
			else res.send(err);
		});
	})

	.delete((req, res) => {
		Article.deleteMany({}, (err) => {
			if (!err) res.send("Successfully deleted all articles.");
			else res.send(err);
		});
	});

app.route("/articles/:title")

	.get((req, res) => {
		Article.findOne({ title: req.params.title }, (err, article) => {
			if (!err) res.send(article);
			else res.send(err);
		});
	})

	.put((req, res) => {
		Article.findOneAndUpdate(
			{ title: req.params.title },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			(err) => {
				if (!err) res.send("Successfully updated article.");
				else res.send(err);
			}
		);
	})

	.patch((req, res) => {
		Article.findOneAndUpdate(
			{ title: req.params.title },
			{ $set: req.body },
			(err) => {
				if (!err) res.send("Successfully updated article.");
				else res.send(err);
			}
		);
	})

	.delete((req, res) => {
		Article.deleteOne({ title: req.params.title }, (err) => {
			if (!err) res.send("Successfully deleted article.");
			else res.send(err);
		});
	});

app.listen(3000, function () {
	console.log("listening on port 3000");
});
