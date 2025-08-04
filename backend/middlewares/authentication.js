//the fact that this function doesnt stop a particular flow shouts the fact that this process is solely of authentication,and that authentication and authorisaton are two different things
//cookieName is just a variable name,its the name that you had assigned to your cookie
const { validateToken } = require("../services/auth.js");
function checkForAuthenticationCookie(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) return next(); //if there exists no cookie by the parameter name u just gave
    try {
      const userPayload = await validateToken(tokenCookieValue);
      //payload coming but id aint coming
      req.user = userPayload; //if the user happens to be logged in,the req.user will have all the necessary details of the user obtained from the jwt token and then at different endpoints we can just do req.user if the user is logged in,and show his details
    } catch (err) {
      console.log("Error in validating the logged in user");
    }
    return next(); //if you just have a cookie by that name,whether or not the token-named cookie matches validates or not,go on to the next anyway
  };
}
module.exports = { checkForAuthenticationCookie };
