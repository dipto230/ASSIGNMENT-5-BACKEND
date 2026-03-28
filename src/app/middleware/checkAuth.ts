/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Role } from "../../generated/prisma/enums";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("🔥 checkAuth middleware HIT");
      console.log("🍪 RAW COOKIE HEADER:", req.headers.cookie);
      console.log("🔐 RAW AUTH HEADER:", req.headers.authorization);

      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token"
      );
      
      // 🔐 Try to get accessToken from cookies OR Authorization header
      let accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken && req.headers.authorization?.startsWith("Bearer ")) {
        accessToken = req.headers.authorization.split(" ")[1];
      }

      console.log("Session Token:", sessionToken);
      console.log("Access Token:", accessToken);

      // ==============================
      // ✅ 1. SESSION BASED AUTH (Better Auth)
      // ==============================
      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        console.log("Session Exists:", sessionExists);

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          // role check
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access! You do not have permission."
            );
          }

          // ✅ SET USER
            req.user = {
             id: user.id,   
            userId: user.id,
            role: user.role,
            email: user.email,
          };

          return next(); // ✅ IMPORTANT (stop here)
        }
      }

      // ==============================
      // ✅ 2. JWT FALLBACK AUTH
      // ==============================
      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! No access token provided"
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! Invalid access token"
        );
      }

      // role check
      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden! You do not have permission"
        );
      }

      // ✅ SET USER FROM JWT
        req.user = {
           id: verifiedToken.data!.userId, 
        userId: verifiedToken.data!.userId,
        role: verifiedToken.data!.role,
        email: verifiedToken.data!.email,
      };

      next();
    } catch (error: any) {
      console.error("❌ AUTH ERROR:", error);
      next(error);
    }
  };