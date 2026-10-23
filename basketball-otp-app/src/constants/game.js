export const OTP_LENGTH = 6;
export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const generateRandomOTP = () => {
  return [1,2,3,4,5,6]; // Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10));
};