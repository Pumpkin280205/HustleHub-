const users = [];

const findUserByEmail = (email) => users.find(u => u.email === email);

const addUser = (user) => {
  users.push(user);
  return user;
};

module.exports = { users, findUserByEmail, addUser };