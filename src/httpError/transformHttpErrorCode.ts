const transformHttpErrorCode = (errorCode: number): number => {
  return errorCode >= 100 && errorCode <= 511 ? errorCode : 500;
};

export default transformHttpErrorCode;
