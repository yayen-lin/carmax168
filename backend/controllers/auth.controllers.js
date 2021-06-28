/**
 * Admin login/signup/update/delete actions which execute the queries defined in auth.models.js.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * src: https://github.com/Scavenge-UW/Scavenge
 */

// TODO: remove console log debugging output
// TODO: return json auth needs to be re-determined

// const session = require("express-session");
const authDB = require("../models/auth.models.js");
// const userDB = require("../models/user.models.js");

exports.adminLoginAction = (req, res) => {
  if (req.cookies[0]) {
    console.log("req.cookies is : ", req.cookies);
    console.log("USER HAS LOGGED IN!");
  } else {
    console.log("req.cookies is not set!");
    console.log("USER HAS NOT LOGGED IN!");
  }

  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  if (
    !user.username ||
    !user.password ||
    user.username === "" ||
    user.password === ""
  ) {
    return res.status(200).json({
      message: "Please provide a username and password.",
    });
  }

  authDB
    .adminLogin(req, res, user)
    .then(async (results) => {
      console.log("auth.controllers - login - results = ", results);
      // if result is not returned or password is incorrect after `bcrypt.compare`
      if (
        !results[0] ||
        !(await bcrypt.compare(req.body.password, results[0].password))
      ) {
        // wrong password
        return res.status(200).json({
          auth: false,
          message: "Username or password is incorrect.",
        });
      } else {
        // login successfully
        console.log("Logged in successfully!");

        // console.log("req = ", req);
        console.log("BEFORE");
        console.log("req.body = ", req.body);
        console.log("req.cookies = ", req.cookies);
        console.log("req.session = ", req.session);
        // console.log("res = ", res);

        // TODO: create session for logged in user.
        let sess = req.session; // a server -side key/val store

        // if (sess.user) {
        //   console.log("sess.user = ", sess.user);
        //   return res.status(200).json({
        //     auth: true,
        //     username: req.body.username,
        //     token: token,
        //     profile: {
        //       username: results[0].username,
        //       privilege: results[0].privilege,
        //     },
        //     results: results,
        //   });
        // }

        sess.user = results[0].username;
        sess.privilege = results[0].privilege;
        console.log("YOYOYO! session = ", sess);

        // create jwt
        const username = results[0].username;
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // cookie setting
        const cookieOptions = {
          // cookie expires after 90 mins from the time it is set.
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000
          ),
          httpOnly: true, // for security reason it's recommended to set httpOnly to true
        };

        // adds cookie to the response
        res.cookie("Carmax168_cookie", token, cookieOptions);

        console.log("YOYOYO! TOKEN: ", token);
        console.log(
          "YOYOYO! req.cookies.Carmax168_cookie: ",
          req.cookies.Carmax168_cookie
        );

        console.log("AFTER");
        console.log("req.body = ", req.body);
        console.log("req.cookies = ", req.cookies);
        console.log("req.session = ", req.session);

        //console.log(results[0]);

        // TODO: user models
        // // get employee-of status
        // try {
        //   pantries = await db1.isEmployeeOf(req, res, user);
        // } catch (e) {
        //   console.log(e);
        //   return res.status(500).json({
        //     messsage: "Employee of pantries lookup failed due to server error.",
        //   });
        // }

        // // make into array
        // var pantriesArr = [];
        // pantries.forEach((obj, index) => {
        //   pantriesArr[index] = obj["pantry_id"];
        // });

        return res.status(200).json({
          auth: true,
          username: username,
          token: token,
          profile: {
            username: results[0].username,
            privilege: results[0].privilege,
          },
          results: results,
        });
      }
    })
    .catch((err) => {
      // Reject case
      console.log(err);
      return res.status(500).json({
        auth: false,
        messsage: "Login failed due to server error.",
      });
    });
};

exports.adminSignupAction = (req, res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    privilege: req.body.privilege,
  };

  if (
    !newUser.username ||
    !newUser.password ||
    newUser.username === "" ||
    newUser.password === ""
  ) {
    return res.status(200).json({
      auth: false,
      message: "Please provide a username and password.",
    });
  }

  authDB
    .adminSignup(req, res, newUser)
    .then(async (data) => {
      console.log("auth.controllers - signup - data = ", data);
      console.log("auth.controllers - signup - newUser = ", newUser);
      // create jwt
      // const token = jwt.sign(
      //   { username: newUser.username },
      //   process.env.JWT_SECRET,
      //   { expiresIn: process.env.JWT_EXPIRES_IN }
      // );

      // // create cookie
      // const cookieOptions = {
      //   // cookie expires after 90 mins from the time it is set.
      //   expires: new Date(
      //     Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000
      //   ),
      //   httpOnly: true,
      // };

      // // can specify any name for cookie
      // // need to decode the token to get username
      // res.cookie("Carmax168_cookie", token, cookieOptions);
      // console.log("YOYOYO! TOKEN: ", token);

      // get type
      // try {
      //   var userType = await authDB.adminGetPrivilege(req, res, newUser);
      // } catch (error) {
      //   console.log(error);
      //   return res.status(500).json({
      //     auth: false,
      //     messsage: "User privilege lookup failed due to server error.",
      //   });
      // }
      // var uType = userType[0].privilege;

      // TODO: user.models
      // get employee-of status
      // this will always return an empty array for signup because a new user cannot immediately be an employee
      // try {
      //   var pantries = await db1.isEmployeeOf(req, res, newUser);
      // } catch (err) {
      //   console.log(err);
      //   return res.status(500).json({
      //     messsage: "Employee of pantries lookup failed due to server error.",
      //   });
      // }

      // // make into array
      // var pantriesArr = [];
      // pantries.forEach((obj, index) => {
      //   pantriesArr[index] = obj["pantry_id"];
      // });

      return res.status(200).json({
        auth: false,
        message: "You have successfully signed up.",
        // username: newUser.username,
        // token: token,
        // profile: {
        //   username: newUser.username,
        //   privilege: newUser.privilege,
        // },
      });
    })
    .catch((err) => {
      console.log(err);
      // Duplicate username error
      return res.status(200).json({
        auth: false,
        message: "Duplicate Username Error: " + err,
      });
    });
};

exports.adminUpdateUserAction = (req, res) => {
  const newInfo = {
    username: req.body.username,
    password: req.body.password,
    privilege: req.body.privilege,
  };

  if (
    !newInfo.username ||
    !newInfo.password ||
    newInfo.username === "" ||
    newInfo.password === ""
  ) {
    return res.status(200).json({
      auth: true,
      message: "Please provide a username and password.",
    });
  }

  authDB
    .adminUpdate(req, res, newInfo)
    .then(async (data) => {
      console.log("auth.controllers - update - data = ", data);
      console.log("auth.controllers - update - newInfo = ", newInfo);
      // create token and insert cookie
      const token = jwt.sign(
        { username: newInfo.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // create cookie
      const cookieOptions = {
        // cookie expires after 90 mins from the time it is set.
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000
        ),
        httpOnly: true,
      };

      // can specify any name for cookie
      // need to decode the token to get username
      res.cookie("Carmax168_cookie", token, cookieOptions);
      console.log("YOYOYO! TOKEN: ", token);

      // get type
      // try {
      //   var userType = await authDB.adminGetPrivilege(req, res, newInfo);
      // } catch (error) {
      //   console.log(error);
      //   return res.status(500).json({
      //     auth: true,
      //     messsage: "User privilege lookup failed due to server error.",
      //   });
      // }
      // var uType = userType[0].privilege;

      // // get employee-of status
      // // this will always return an empty array for signup because a new user cannot immediately be an employee
      // try {
      //   var pantries = await db1.isEmployeeOf(req, res, newInfo);
      // } catch (err) {
      //   console.log(err);
      //   return res.status(500).json({
      //     messsage: "Employee of pantries lookup failed due to server error.",
      //   });
      // }

      // // make into array
      // var pantriesArr = [];
      // pantries.forEach((obj, index) => {
      //   pantriesArr[index] = obj["pantry_id"];
      // });

      return res.status(200).json({
        auth: true,
        username: newInfo.username,
        token: token,
        profile: {
          username: newInfo.username,
          privilege: newInfo.privilege,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        auth: true,
        message: "Failed to update user due to server error.",
      });
    });
};

exports.adminDeleteUserAction = (req, res) => {
  authDB
    .adminDelete(req, res)
    .then((data) => {
      //set cookie to user logged out
      console.log("auth.controllers - delete - data = ", data);
      res.cookie("Carmax168_cookie", "logout", {
        // cookie expires after 2 sec from the time it is set.
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
      });

      return res.status(200).json({
        auth: true,
        message: "User account deleted.",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        auth: true,
        message: "Failed to delete user due to server error.",
      });
    });
};

// TODO: session is not 'destroyed' and cookie is not 'cleared';
exports.adminLogoutAction = (req, res) => {
  console.log("auth.controllers - logout");
  res.cookie("Carmax168_cookie", "logout", {
    // cookie expires after 2 sec from the time it is set.
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  console.log("req.session before destroyed: ", req.session);

  // session destroy set current session to undefined
  req.session.destroy((err) => {
    if (err) {
      return res.status(200).json({
        auth: true,
        message: "Failed to destroy session during logout",
      });
    }
  });
  console.log("session destroyed");
  console.log("req.session after destroyed: ", req.session);
  return res.status(200).json({
    auth: false,
    message: "Successfully logged out!",
  });
};

// TEST: remove
exports.adminIsAuth = (req, res) => {
  console.log("------------------- req -------------------");
  console.log("req.sessionID", req.sessionID);
  console.log("req.session.cookie", req.session.cookie);
  console.log("req.session.user", req.session.user);
  console.log("req.session.privilege", req.session.privilege);
  console.log("req.cookies", req.cookies);

  return res.status(200).json({
    auth: true,
    message: "HI, this is adminIsAuth",
  });
};

exports.adminIsLoggedIn = (req, res) => {
  console.log("------------------- req -------------------");
  console.log(req);
  console.log("req.sessionID", req.sessionID);
  console.log("req.cookies", req.cookies);
  console.log("req.body", req.body);
  if (
    req.sessionID // &&
    // req.cookies.Carmax168_cookie &&
    // req.cookies.Carmax168_sid
  ) {
    console.log("user is logged in.");
    return res.status(200).json({
      auth: true,
      username: req.session.user,
      token: req.cookies.Carmax168_cookie,
      profile: {
        username: req.session.user,
        privilege: req.session.privilege,
      },
      message: "User is logged in.",
    });
  } else {
    console.log("User is not logged in.");
    return res.status(200).json({
      auth: false,
      message: "User is not logged in.",
    });
  }
};
