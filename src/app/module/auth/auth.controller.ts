import { envVars } from "../../../config/env";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import ms, { StringValue } from "ms";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { CookieUtils } from "../../utils/cookie";
import { auth } from "../../lib/auth";

const registerUser = catchAsync(
  async (req: Request, res: Response) => {
    const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue);
    console.log("📝 Register Payload:", req.body);
    console.log("⏱ MaxAge for access token:", maxAge);

    const result = await AuthService.registerUser(req.body);
    const { accessToken, refreshToken, token, ...rest } = result;

    console.log("🍪 Setting cookies on register:", { accessToken, refreshToken, token });

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    console.log("✅ Cookies set successfully for registration");

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "User registered successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest,
      },
    });
  }
);

const loginUser = catchAsync(
  async (req: Request, res: Response) => {
    console.log("📝 Login Payload:", req.body);
    const result = await AuthService.loginUser(req.body);
    console.log("✅ Login Result:", result);

    const { accessToken, refreshToken, token, ...rest } = result;

    console.log("🍪 Setting cookies on login:", { accessToken, refreshToken, token });
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    console.log("✅ Cookies set successfully for login");

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest,
      },
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response) => {
    console.log("🌐 getMe Route hit");
    console.log("🍪 Cookies Received:", req.cookies);
    console.log("🍪 Raw Cookie Header:", req.headers.cookie);

    const user = req.user;
    console.log("🛡 User from middleware:", user);

    const result = await AuthService.getMe(user);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User profile fetched successfully",
      data: result,
    });
  }
);

const getNewToken = catchAsync(
  async (req: Request, res: Response) => {
    console.log("🌐 getNewToken Route hit");
    console.log("🍪 Cookies Received:", req.cookies);

    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];

    if (!refreshToken) {
      throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
    }

    const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

    console.log("🍪 Setting new tokens cookies:", { accessToken, newRefreshToken, sessionToken });

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken,
      },
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    console.log("📝 Change Password Payload:", req.body);
    console.log("🍪 Cookies Received:", req.cookies);

    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.changePassword(req.body, betterAuthSessionToken);
    const { accessToken, refreshToken, token } = result;

    console.log("🍪 Setting new cookies after password change:", { accessToken, refreshToken, token });

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);

const logoutUser = catchAsync(
  async (req: Request, res: Response) => {
    console.log("🌐 logout Route hit");
    console.log("🍪 Cookies Received before logout:", req.cookies);

    // Get session token from cookies OR Authorization header
    let betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if (!betterAuthSessionToken && req.headers.authorization?.startsWith("Bearer ")) {
      betterAuthSessionToken = req.headers.authorization.split(" ")[1];
    }

    console.log("🔐 Session token for logout:", betterAuthSessionToken ? "Found" : "Not found");

    if (betterAuthSessionToken) {
      const result = await AuthService.logoutUser(betterAuthSessionToken);
      console.log("✅ Better-auth signOut result:", result);
    }

    console.log("🍪 Clearing cookies...");
    CookieUtils.clearCookie(res, 'accessToken', { httpOnly: true, secure: true, sameSite: "none" , path: "/"});
    CookieUtils.clearCookie(res, 'refreshToken', { httpOnly: true, secure: true, sameSite: "none",path: "/" });
    CookieUtils.clearCookie(res, 'better-auth.session_token', { httpOnly: true, secure: true, sameSite: "none",path: "/" });

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User logged out successfully",
      data: { success: true },
    });
  }
);

// Email verification / password reset routes remain mostly unchanged but add logs
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  console.log("📝 verifyEmail Payload:", req.body);
  await AuthService.verifyEmail(req.body.email, req.body.otp);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Email verified successfully" });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  console.log("📝 forgetPassword Payload:", req.body);
  await AuthService.forgetPassword(req.body.email);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Password reset OTP sent to email successfully" });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  console.log("📝 resetPassword Payload:", req.body);
  await AuthService.resetPassword(req.body.email, req.body.otp, req.body.newPassword);
  sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Password reset successfully" });
});

const googleLogin = catchAsync((req: Request, res: Response) => {
  console.log("🌐 Google Login Route hit");
  console.log("📝 Redirect query:", req.query.redirect);

  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

  res.render("googleRedirect", { callbackURL, betterAuthUrl: envVars.BETTER_AUTH_URL });
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  console.log("🌐 Google Login Success Route hit");
  console.log("🍪 Cookies Received:", req.cookies);

  const redirectPath = (req.query.redirect as string) || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];

  if (!sessionToken) {
    console.log("❌ No session token found, redirecting to login");
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const session = await auth.api.getSession({ headers: { "Cookie": `better-auth.session_token=${sessionToken}` } });
  console.log("✅ Retrieved session:", session);

  if (!session) return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  if (!session.user) return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);

  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;

  console.log("🍪 Setting cookies after Google login success:", { accessToken, refreshToken });
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);

  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});

const handleOAuthError = catchAsync((req: Request, res: Response) => {
  console.log("🌐 OAuth Error Route hit");
  const error = req.query.error as string || "oauth_failed";
  console.log("❌ OAuth Error:", error);
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});

export const AuthController = {
  registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess,
  handleOAuthError,
  googleLogin
};