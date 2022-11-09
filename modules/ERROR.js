module.exports = {
  WRONG_PASSWORD: {
    IN_KOREAN: {
      code: 'INCLUDE_KOREAN',
      message: 'Must be password include only english & number'
    }
  },
  EMPTY_INFO: {
    USER_ID: {
      code: 'EMPTY_USER_ID',
      message: 'User ID is required.'
    },
    USER_PASSWORD: {
      code: 'EMPTY_USER_PASSWORD',
      message: 'User Password is required.'
    },
    USERNAME: {
      code: 'EMPTY_USERNAME',
      message: 'Username is required.'
    }
  },
  EXISTS_ID: {
    code: 'EXISTS_USER_ID',
    message: 'The user id already exists.'
  },
  NOT_EXISTS_USER: {
    code: 'NOT_EXISTS_USER',
    message: 'User not exists'
  },
  OTHER: {
    code: 'UNKNOWN',
    message: 'Unknown Error'
  }
}