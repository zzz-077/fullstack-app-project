async function createAccessTokenCookie(res, AccessToken) {
    return res.cookie("AccessToken", AccessToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 1 * 3600 * 1000,
        secure: true,
        path: "/",
    });
}
async function createRefreshTokenCookie(res, RefreshToken) {
    return res.cookie("RefreshToken", RefreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 7 * 24 * 3600 * 1000,
        secure: true,
        path: "/",
    });
}

export { createAccessTokenCookie, createRefreshTokenCookie };
