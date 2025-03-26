// ✅ Define setTokenCookies at the top of userController.js
exports.setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, { 
      httpOnly: true, secure: true, sameSite: "Strict", maxAge: 3600000 
    });
  
    res.cookie("refreshToken", refreshToken, { 
      httpOnly: true, secure: true, sameSite: "Strict", maxAge: 604800000 
    });
  };
  