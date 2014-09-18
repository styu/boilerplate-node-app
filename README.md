<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [sample-node-app](#sample-node-app)
  - [Adding to your git repo](#adding-to-your-git-repo)
  - [Installing node](#installing-node)
  - [Getting Started](#getting-started)
  - [Application Structure](#application-structure)
  - [Using a database](#using-a-database)
    - [MongoDB](#mongodb)
      - [Using MongoDB](#using-mongodb)
      - [More Mongo!](#more-mongo!)
    - [sqlite](#sqlite)
  - [Helpful Tips](#helpful-tips)
- [Deploying](#deploying)
  - [Nodejitsu](#nodejitsu)
    - [Database hosting](#database-hosting)
  - [Heroku](#heroku)
    - [Database hosting](#database-hosting-1)
  - [Other options](#other-options)
- [Submission](#submission)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

sample-node-app
===============

This is the starting code for a sample node app, with instructions on how to deploy onto heroku and nodejitsu

## Adding to your git repo
To add this to your own git repository, `cd` into your repository, and then run
```
git remote add sample-node-app git@github.mit.edu:mit6470/sample-node-app.git
git pull sample-node-app master
```

It is recommended that this be run on an empty repository to prevent any possible conflicts. Since this is a sample application, you can use this as a starting point for your web application.

## Installing node

You can download node from their website: http://nodejs.org/download/

Node works by having packages that you can install with libraries that your application may need. This is done through `npm`, or the Node Package Manager. Lucky for you `npm` is now included in node, so you should be good to go once you have installed node.

## Getting Started

This sample application is a simple node app that uses Express (http://expressjs.com/) as the web framework (go to the node lecture to learn more).

To run this application, first run `npm install` to install the necessary packages on your local computer. If you see an error message with something like `npm ERR! Error: EACCES...`, you may have to run `sudo npm install` instead. Or if you're on Windows run it in a shell that has administrator privileges. If it runs successfully, you should see it spit out the list of packages that just installed.

To start the server, run `node app.js` and you should see the message

```
Express server listening on port 3000
```

Now you can go to http://localhost:3000 on any browser and see the text 'Hello World' on a blank background.

## Application Structure

The structure of this simple node application is as follows:

```
sample-node-app/
├─┬ models/
  └── sample.js
├── node_modules/
├─┬ public/
| ├─┬ css/
| | ├── reset.css
| | └── main.css
| ├─┬ js/
| | ├── jquery.min.js
| | └── main.js
| └── fonts/
├─┬ routes/
| └── routes.js
├─┬ views/
| └── index.html
├── app.js
├── package.json
└── Procfile
```

* `app.js` is where your main application code lives. This is the file you run to start the server with `node app.js`
* `package.json` is where you list all the node modules your application requires. This is so anyone else can clone your repository and just run `npm install` to have everything they need to run your application. Make sure to keep this up to date as you add more modules to your application.
* `views/` is where all your HTML files will live. This sample application uses Handlebars (http://handlebarsjs.com/) as the templating engine. Any new HTML files should go here, and you can render them in your server code simply by saying `res.render(filename.html)`
* `routes/` is where all the code corresponding to your routes go. You will notice that in `app.js` there is a line that says:

    ```
    app.get('/', routes.index);
    ```

    This says anytime you visit the base url (e.g. http://localhost:3000/), then give me the result of the index function in routes. If you go to `routes/routes.js`, you will find the function `exports.index`, which renders `index.html` with some text. Any new routes should be declared in `app.js`, e.g.

    ```
    app.get('/login', routes.login);
    app.post('/login', routes.doLogin);
    ```

    And then their corresonding `exports.login` and `exports.doLogin` functions should be created in `routes.js`, similar to how `exports.index` was written.

* `public/` is where all your client side code goes - this includes fonts, client side javascript, and css files. You can reference these files using `/js/filename.js` or `/css/filename.css`, as some examples. See `views/index.html` for an example.
* `node_modules/` is where all your installed node modules live after you run `npm install`. This should NEVER be committed to git - the .gitignore file ignores them in this repo, so you should be fine.
* `models/` is where all your database models live. More explanation on this in the next section.
* `Procfile` is for Heroku only, ignore this otherwise. See the Deploying section below for more details.

## Using a database

### MongoDB

We recommend using MongoDB as a backend to your node application - MongoDB is lightweight and easy to use, especially if you're a beginner. For node, there is a easy to use module to interface with your Mongo database - `mongoose` (http://mongoosejs.com/).

This sample application comes with some sample code on how to set up Mongo and mongoose. Look in `routes/routes.js` for this sample code. Before you do, make sure to install Mongo on your laptop and make sure that Mongo is running (The command to start mongo is `mongod`). Download MongoDB here: https://www.mongodb.org/downloads

#### Using MongoDB

Uncomment out the sample code in `routes/routes.js` and `app.js` to use MongoDB. Restart your application (any changes you make to server code you will need to restart the server - see helpful tips below for an easier way to do this). Once you've restarted the app by running `node app.js`, visit http://localhost:3000/test-database. You should now see the text 'This is a test.' instead of 'Hello World'.

This text is actually the text of a newly created object in your database. If you look at the database code, you'll notice there are three parts:

1. Connecting to the database.
    Connecting to the database is pretty simple - you can replace `test` with whatever database name you want - if it doesn't exist, mongoose will automatically create one for you. Be sure to replace `test` in both the connect and the on disconnect methods below:

    ```
    // DATABASE CONNECTION
    mongoose.connect('mongodb://localhost/test');

    // Error handler
    mongoose.connection.on('error', function (err) {
      console.log(err)
    });

    // Reconnect when closed
    mongoose.connection.on('disconnected', function () {
      mongoose.connect('mongodb://localhost/test');
    });
    ```

2. Creating a Schema
    Databases consists of models, which are described by schemas, which is like a set of instructions for what your data should look like. Our schema is loaded in the following line

    ```
    var SampleModel = require('../models/sample')(mongoose);
    ```

    What this line says is it's looking in the `/models/` folder for a file called sample.js. This file is the one that actually holds the schema and returns the corresponding Model object, which you will use from then on to create new objects, query your database, etc etc.

    Looking in `/models/sample.js`, you'll see

    ```
    var Schema = mongoose.Schema

    var sampleSchema = new Schema({
      text: String
    });

    return mongoose.model('Sample', sampleSchema);
    ```

    This code simply says create a new Schema with just a single text field called 'text', and then return a model with that schema called 'Sample'. Any models created with the Sample model will have a text field to go with it. If you want to create new models, just create a new file in the `/models/` folder called `yourmodel.js`, copy the contents of `sample.js`, and change the names and fields according to what your new model is. Then in `routes/routes.js` you will want to load your model with the code:

    ```
    var YourModel = require('../models/yourmodel.js')(mongoose);
    ```

3. Using the Model

    In `routes/routes.js`, we have a new route that creates a new Sample object and saves it to the database. If the save is successful, then we display the text, which is what you saw when you visited the url http://localhost:3000/test-database

    ```
    var example = new SampleModel({text: "This is a test."});
    example.save(function(err) {
      if (err) {
        res.render('index.html', {text: err});
      } else {
        res.render('index.html', {text: example.text});
      }
    });
    ```

#### More Mongo!

For more information on how to use Mongo/Mongoose, you can visit their docs at http://mongoosejs.com/docs/guide.html

### sqlite

If you for some reason don't want to use MongoDB, there are other options out there. One option would be to use sqlite - there are many node modules out there that support this. A popular module is sqlite3 (https://www.npmjs.org/package/sqlite3) - a downside to this module is that you would have to write your own SQL queries. Another module is thin-orm (https://github.com/on-point/thin-orm), which abstracts the SQL queries for you.

## Helpful Tips

* If you would like to not have to kill and restart the server everytime you make a server change, consider using nodemon (http://nodemon.io/)

Deploying
=========
There are several ways to deploy your app:

## Nodejitsu

To deploy your application on Nodejitsu, first create an account: https://www.nodejitsu.com/

Once you do it might take you to a form about payment options, but find the convenient button at the bottom that says something like 'No thanks', and it'll continue onto account creation without you having to fork over money.

Once you've logged in, you will want go to launch webops (https://webops.nodejitsu.com/#/login). Make sure your account is activated first otherwise you won't be able to access the page.

Click on 'Deploy an app with jitsu' and follow the instructions (https://github.com/nodejitsu/jitsu) there.

In particular, you will want to add the following lines to your `package.json` file:

```
"subdomain": "sample-node-app",
"scripts": {
  "predeploy": "echo This will be run before deploying the app",
  "postdeploy": "echo This will be run after deploying the app",
  "start": "app.js"
},
"engines": {
  "node": "0.10.x"
}
```

You can replace `sample-node-app` with the name of your application instead.

### Database hosting

If you are using MongoDB, you will need to create a database on Nodejitsu. Go to https://webops.nodejitsu.com/databases and select MongoDB, and pick any provider. You will then be asked to provide a name for your database. After it is created, there will be a box labeled 'Connection String'. You will then want to replace the any line that has `mongodb://localhost/yourdatabase` with your connection string instead, like so:

```
mongoose.connect('mongodb://nodejitsu:abcdefghijklmnopqrstuvwxyz123@troup.mongohq.com:10045/nodejitsudb1234567890');
```

You should then be able to re-deploy with `jitsu deploy`

## Heroku

To deploy your application on Heroku, first create an account: https://www.heroku.com/

Then add the following lines to your `package.json` file:

```
"engines": {
  "node": "0.10.x"
},
"main": "app.js",
"scripts": {
  "start": "node app.js"
}
```

Once you do, follow the instructions here: https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction

You can skip the cloning the repo part, since you will be starting with your own repository.

Make sure you have run `heroku ps:scale web=1` before you view the website. In addition, ensure that your Procfile is up to date with the command you run to start the server.

### Database hosting

If you are using MongoDB, you will need to host your database somewhere. We recommend using MongoLabs (https://devcenter.heroku.com/articles/mongolab) - you can use their free sandbox option and it should suffice for this competition. It may ask you to provide billing information, but we don't believe it should charge you with the free plan. Read the fine print before continuing though. Follow the instructions at the url (https://devcenter.heroku.com/articles/mongolab) to get the connection URL that you need to use within your code.

## Other options

If you cannot host your node application with any of the above methods by the time your website is due to us, email the staff at 6.470-staff@mit.edu.

Submission
==========

To submit your milestones, please answer the questions in `milestones/milestoneX.md`, where X is the milestone number you are submitting.
