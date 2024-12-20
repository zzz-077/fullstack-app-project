async function createAccessTokenCookie(res, AccessToken) {
  return res.cookie("AccessToken", AccessToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    path: "/",
    maxAge: 1 * 3600 * 1000,
  });
}
async function createRefreshTokenCookie(res, RefreshToken) {
  return res.cookie("RefreshToken", RefreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    path: "/",
    maxAge: 24 * 3600 * 1000,
  });
}

export { createAccessTokenCookie, createRefreshTokenCookie };
