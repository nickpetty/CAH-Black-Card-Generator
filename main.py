# Online CAH Black card generator

# Milestones:
#
# Create main page showing block card CHECK
# Create algorithm to auto format content to card: CHECK
# 	- White text in <font>
# 	- Draw and Pick number in corner based on number of blanks.
# Create submit form CHECK
# Password protect pages
# Link form to database
# Link card display to database
# Clean UI
# Create voting algorithm for choosing card from database
# Add 'Players' section for giving points to winner by selecting their name

# Future:
# Mobile format support

from flask import Flask, render_template, request, redirect, Markup
from flask.ext.basicauth import BasicAuth
from bson.objectid import ObjectId
from pymongo import MongoClient
from random import randrange
import json
import re

configFile = open('config')
config = json.load(configFile)

client = MongoClient()
db = client.bcg
dbCards = db.cards

app = Flask(__name__)

app.config['BASIC_AUTH_USERNAME'] = config['username']
app.config['BASIC_AUTH_PASSWORD'] = config['password']

basic_auth = BasicAuth(app)

@app.route('/about')
def test():
	return render_template('about.html')

@app.route('/')
def index():
	return render_template('index.html', pickNumber=1)

@app.route('/random')
def random():
	count = db.cards.count()
	rand = randrange(0,count)
	record = db.cards.find().limit(-1).skip(rand).next()
	#return redirect('/card/' + str(record["_id"]))
	cardContent = dbCards.find_one({"_id":ObjectId(record["_id"])})
	response = Markup('{"insult":"'+cardContent["content"]+'","pickNumber":"' + str(cardContent["pickNumber"]) +'"}')
	return response


@app.route('/card/<postID>')
def card(postID=None):
	cardContent = dbCards.find_one({"_id":ObjectId(postID)})
	#print cardContent["pickNumber"]
	return render_template('index.html', insult=re.escape(Markup(cardContent["content"])), pickNumber=cardContent["pickNumber"])


@app.route('/submit', methods=['GET','POST'])
@basic_auth.required
def insultSubmitForm():
	if request.method == 'POST':
		cardContent = request.form['content']
		if cardContent != '':
			pickNumber = request.form['pick']
			cardData = {"content":cardContent, "pickNumber":pickNumber}
			_id = db.cards.insert(cardData)
			print _id

			return redirect('/card/' + str(_id))
		else:
			return render_template('submit.html')
	else:
		return render_template('submit.html')

app.run(host='0.0.0.0', port=80, debug=True)	

