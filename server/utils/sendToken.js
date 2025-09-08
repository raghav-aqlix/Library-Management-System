export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  // console.log("Setting cookie");
  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
    })
    .json({
      success: true,
      user,
      message,
      token,
    });
};
