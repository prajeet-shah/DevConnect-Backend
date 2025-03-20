const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter the strong password");
  }
};

const validateProfileEditData = (req) => {
  const allowedFields = [
    "skills",
    "about",
    "age",
    "gender",
    "firstName",
    "lastName",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedFields.includes(field);
  });

  console.log(isEditAllowed);
};

module.exports = { validateSignUpData, validateProfileEditData };
