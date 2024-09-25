function calculateAgeFromDOB(dob) {
  // Date difference in milliseconds
  const dateToday = new Date();
  const birthDate = new Date(dob);
  let age = dateToday.getFullYear() - birthDate.getFullYear();

  // Check month difference to improve age precision a little bit
  const monthDifference = dateToday.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && dateToday.getDate() < birthDate.getDate())
  ) {
    age--; // subtract one year
  }

  return age;
}

module.exports = {
  calculateAgeFromDOB,
};
