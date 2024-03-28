const validator = {
    validateName: (user_name) => {
        if (!/^[A-Za-z]+$/.test(user_name)) {
          return false;
        }
        return true;
      },
      validateEmail: (email) => {
        if (!/[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(email)) {
          return false;
        }
        return true;
      },
      validateCName: (name) => {
        if (!/^[A-Za-z]+$/.test(name)) {
          return false;
        }
        return true;
      },
  };
  
  module.exports = validator;
  