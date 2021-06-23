/**
 * Prepares for admin login/signup/update/delete queries.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * src: https://github.com/Scavenge-UW/Scavenge
 */

// TODO: remove debugging console.log

const { execQuery } = require("../query");

exports.adminLogin = async (req, res, user) => {
  console.log("auth.models - login - user = ", user);
  // User fields already validated
  const query = `
    SELECT * 
    FROM users
    WHERE username = ?;
  `;
  var values = [[user.username]];

  const results = await execQuery("select", query, values);
  return results;
};

exports.adminGetPrivilege = async (req, res, user) => {
  console.log("auth.models - getPrivilege - user = ", user);
  // User fields already validated
  const query = `
    SELECT privilege 
    FROM users
    WHERE username = ?;
  `;
  var values = [[user.username]];

  const results = await execQuery("select", query, values);
  return results;
};

exports.adminSignup = async (req, res, newUser) => {
  console.log("auth.models - signup - newUser = ", newUser);
  const saltRounds = 10;
  const query = `INSERT INTO users (username, password, privilege) VALUES ?;`;

  // hashed + salted password - takes awhile so we need aysnc await
  await bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
    if (err) console.log(err);
    else {
      const values = [[newUser.username, hash, newUser.previlege]];
      return execQuery(
        "insert",
        query,
        values,
        "Duplicate username. Please choose another one."
      );
    }
  });
};

exports.adminUpdate = async (req, res, newInfo) => {
  console.log("auth.models - update - newInfo = ", newInfo);
  const saltRounds = 10;
  const query = `
    UPDATE users u
    SET 
      username = ?,
      password = ?,
      previlege = ?,
    WHERE u.username = ?;
  `;

  // hashed + salted password - takes awhile so we need aysnc await
  await bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
    if (err) console.log(err);
    else {
      const values = [
        [newUser.username, hash, newUser.previlege, req.params.username],
      ];
      return execQuery("update", query, values);
    }
  });

  // hash password - takes awhile so we need aysnc await
  // const hashedPassword = await bcrypt.hash(newInfo.password, 8);
  // const values = [
  //   newInfo.username,
  //   hashedPassword,
  //   newInfo.firstName,
  //   newInfo.lastName,
  //   newInfo.email,
  //   newInfo.phone,
  //   newInfo.address,
  //   newInfo.city,
  //   newInfo.state,
  //   newInfo.zipcode,
  //   req.params.username,
  // ];

  // return await execQuery("update", query, values);
};

exports.adminDelete = async (req, res) => {
  console.log("auth.models - delete -");
  const query = `
    DELETE FROM users
    WHERE username = ?;
  `;
  const values = [[req.params.username]];

  return await execQuery("delete", query, values);
};
