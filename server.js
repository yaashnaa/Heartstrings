// library imports
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nedb = require("nedb");
const expressSession = require("express-session");
const nedbSessionStore = require("nedb-session-store");
const bcrypt = require("bcrypt");

// initialized libs w params
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
const upload = multer({
  dest: "public/uploads",
});
const nedbInitializedStore = nedbSessionStore(expressSession);
const sessionStore = new nedbInitializedStore({
  filename: "sessions.txt",
});
const app = express();

app.use(express.static("public"));
app.use(urlEncodedParser);
app.use(cookieParser());
app.use(
  expressSession({
    store: sessionStore,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
    secret: "supersecret123",
  })
);
app.set("view engine", "ejs");




const databaseinfo = new nedb({
  filename: "databaseinfo.txt",
  autoload: true,
});

let usersdatabase = new nedb({
  filename: "userdb.txt",
  autoload: true,
});

function requiresAuth(req, res, next) {
  if (req.session.loggedInUser) {
    console.log("requires auth: " + req.path);
    next();
    // res.redirect('/quizzes')
  } else {
    res.redirect("/login?error=true");
  }
}

app.get("/test", (req, res) => {
  res.send("server is working");
});

app.get("/eroticism", (req, res) => {
  res.render("eroticism.ejs");
});

app.get("/marry", (req, res) => {
  res.render("marry.ejs");
});

app.get("/choice", (req, res) => {
  res.render("choice.ejs");
});

app.get("/homecopy", (req, res) => {
  if (req.session.loggedInUser) {
    res.render("home.ejs");
  } else {
    res.render("homecopy.ejs");
  }
});

app.get("/logout", (req, res) => {
  delete req.session.loggedInUser;
  res.redirect("/login");
});

app.get("/main/:id", requiresAuth, (req, res) => {
  //   if (req.session.loggedInUser) {
  let id = req.params.id;
  let query = {
    userid: id,
  };

  databaseinfo.findOne(query, (error, data) => {
    // console.log(query);
    // console.log(data + "****");
    res.render("main.ejs", { userinfo: query });
  });
});

app.post("/info", upload.single("theimage"), (req, res) => {
  let id = req.params.id;

  let datainfo = {
    age: req.body.age,
    sexuality: req.body.sexuality,
    gender: req.body.gender,
    work: req.body.work,
    education: req.body.education,
    location: req.body.location,
    hometown: req.body.hometown,
    ethnicity: req.body.ethnicity,
    height: req.body.height,
    vaccine: req.body.vaccine,
    religion: req.body.religion,
    minage: req.body.minage,
    maxage: req.body.maxage,
    sexualitypref: req.body.sexualitypref,
    genderpref: req.body.genderpref,
    maxdistance: req.body.maxdistance,
    religionpref: req.body.religionpref,
    ethnicitypref: req.body.ethnicity,
    prompt1: req.body.prompt1,
    prompt2: req.body.prompt2,
    prompt3: req.body.prompt2,
    response1: req.body.response1,
    response2: req.body.response2,
    response3: req.body.response3,
    drinking: req.body.drinking,
    marijuana: req.body.smoking,
    attachment: req.body.attachment,
    lovelanguage: req.body.lovelang,
    conflictresolution: req.body.conflictresol,
    communicationstyle: req.body.communication,

    userid: req.body.userid,
  };

  // console.log(query)
  if (req.file) {
    datainfo.theimage = "/uploads/" + req.file.filename;
  }
  // databaseinfo.findOne(query, (error, data)=>{
  // console.log(data)
  // console.log(query)
  databaseinfo.insert(datainfo, (error, newData) => {
    res.redirect("/nextsteps/" + req.body.userid);
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", {});
});
app.get("/login", (req, res) => {
  res.render("login.ejs", {});
});
app.get("/lovelanguages", (req, res) => {
  res.render("lovelanguages.ejs", {});
});
app.get("/communication", (req, res) => {
  res.render("communication.ejs", {});
});
app.get("/attachment", (req, res) => {
  res.render("attachment.ejs", {});
});
app.get("/conflict", (req, res) => {
  res.render("conflict.ejs", {});
});
app.get("/selflove", (req, res) => {
  res.render("selflove.ejs", {});
});

app.get("/", (req, res) => {
  res.render("index.ejs", {});
});

app.get("/home", (req, res) => {
  //   if (req.session.loggedInUser) {
  let id = req.params.id;
  let query = {
    userid: id,
  };

  databaseinfo.findOne(query, (error, data) => {
    // console.log(query+"*******");
    // console.log(data + "****");
    res.render("home.ejs", { userinfo: query });
  });
});
app.get("/newhome", (req, res) => {
  res.render("newhome.ejs", {});
});
app.get("/artofloving", (req, res) => {
  res.render("artofloving.ejs", {});
});
app.post("/signup", (req, res) => {
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);

  let data = {
    username: req.body.username,
    fullname: req.body.fullname,
    password: hashedPassword,
  };

  usersdatabase.insert(data, (err, insertedData) => {
    res.redirect("/congrats/" + insertedData._id);
  });
});

app.get("/congrats/:id", (req, res) => {
  let id = req.params.id;
  let query = {
    _id: id,
  };

  databaseinfo.findOne(query, (error, data) => {
    res.render("congrats.ejs", { message: query });
  });
});

app.get("/newsignup/:id", (req, res) => {
  let id = req.params.id;

  let query;
  if (!id.includes(".js") && !id.includes(".css")) {
    query = {
      _id: id,
    };
  }

  databaseinfo.findOne(query, (error, data) => {
    res.render("newsignup.ejs", { message: query });
  });
});

app.get("/nextsteps/:id", (req, res) => {
  let id = req.params.id;
  let query = {
    _id: id,
  };
  res.render("nextsteps.ejs", { message: query });

  // databaseinfo.findOne(query, (error, data) => {
  // console.log(data)
});
// app.get("/success/:id", (req, res) => {
//   let id = req.params.id;

//   let query = {
//     _id: id,
//   };

//   databaseinfo.findOne(query, (error, data) => {
//     // console.log(data)
//     // console.log(query)
//     res.render("success.ejs", { message: query });
//   });
// });

app.get("/completeprofile/:id", requiresAuth, (req, res) => {
  let id = req.params.id;
  let query = {
    userid: id,
  };

  databaseinfo.findOne(query, (error, data) => {
    // console.log(query);
    // console.log(data + "****");
    res.render("completeprofile.ejs", { userinfo: data });
  });

  // databaseinfo.findOne(query, (error, data) => {
  //   if (error) {
  //     console.error(error);
  //     return res
  //       .status(500)
  //       .send("An error occurred while fetching data from the database");
  //   }
  //   // console.log(data.req.body.userid+"***")
  //   res.render("completeprofile.ejs", {userinfo: data });
  // console.log(query);
  // databaseinfo.findOne(query, (error, data) => {
  //   // console.log(query)
  //   res.render("completeprofile.ejs", { message: query });
  // });
});

app.get("/resources", (req, res) => {
  res.render("resources.ejs", {});
});

app.get("/resourcescopy", (req, res) => {
  res.render("resourcescopy.ejs", {});
});
app.get("/attraction", (req, res) => {
  res.render("attraction.ejs", {});
});
app.get("/canlovelast", (req, res) => {
  res.render("canlovelast.ejs", {});
});
// app.get("/profile", (req, res) => {
//   database.find(query.id);
//   res.render("profile.ejs", {});
// });

// app.post("/attachment", (req, res) => {
//   let id = req.body.userid;
//   let data = {
//     attachment: req.body.attachment,
//     lovelanguage: req.body.lovelang,
//     conflictresolution: req.body.conflictresol,
//     communicationstyle: req.body.communication,
//     userid: req.body.userid,
//   }
//   let query = { userid: id };
//   let update = { $set: { attachment: req.body.attachment } };

//   usersdatabase.update(query, update, {}, function(err, numReplaced) {
//     if (err) {
//       console.log("Error updating document: " + err);
//     } else {
//       console.log("Document updated successfully");
//     }
//   });
// });

// app.post("/attachment", (req, res) => {
//   let id = req.params.userid;
//   let data= {
//     attachment: req.body.attachment,
//     lovelanguage: req.body.lovelang,
//     conflictresolution: req.body.conflictresol,
//     communicationstyle: req.body.communication,
//     userid: req.body.userid,
//   }
//   let attachment= req.body.attachment
//   let query = { userid: id };
//   let update = { $set: { data.attachment: req.body.attachment} };

//   // databaseinfo.insert(datainfo, (error, newData) => {
//   //   res.redirect("/nextsteps/" + req.body.userid);
//   // });

//   usersdatabase.update(query, update, {}, function(err, numReplaced) {
//     if (err) {
//       console.log("Error updating document: " + err);
//     } else {
//       console.log("Document updated successfully");
//     }
//   });

// let id = req.params.id;
// let query = {
//   userid: id,
// };
// let attachment= req.body.attachment;
// databaseinfo.update(query, $set(req.body.attachment), {},
// res.render("profile.ejs", {});

app.get("/header/:id", (req, res) => {
  let id = req.params.id;
  let query = {
    _id: id,
  };

  databaseinfo.findOne(query, (error, data) => {
    // console.log(data)
    res.render("header.ejs", { message: query });
  });
});

app.post("/authenticate", (req, res) => {
  let data = {
    username: req.body.username,
    password: req.body.password,
  };

  let searchedQuery = {
    username: data.username,
  };

  usersdatabase.findOne(searchedQuery, (err, user) => {
    console.log("attempt login");
    if (err || user == null) {
      res.redirect("/login");
    } else {
      console.log("found user");
      let encPass = user.password;
      if (bcrypt.compareSync(data.password, encPass)) {
        let session = req.session;
        session.loggedInUser = data.username;
        console.log("successful login");
        res.redirect("/main/" + user._id);

        // res.redirect("/main");
      } else {
        res.redirect("/login");
      }
    }
  });
});

app.listen(6007, () => {
  console.log("server started on port 6007");
});

// app.get("/completeprofile/", (req, res) => {
// let query= req.params
// res.render("congrats.ejs", {query});
// let id = req.params.id;
// let query = {
//   _id: id,
// };
// databaseinfo.findOne(query, (error, data) => {
//   // res.render("newsignup.ejs", { message: data });
// res.render("completeprofile.ejs", { message: data });
// })
// });
// app.get("/completeprofile/:id", (req, res) => {
//   let userId = req.params.id;
//   databaseinfo.findOne({ _id: userId }, (error, data) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send("Error finding user data");
//     } else {
//       let userdata = newData;
//       res.render("completeprofile.ejs", { userdata: userdata });
//     }
//   });
// });
