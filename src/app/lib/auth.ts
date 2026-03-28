import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP, oAuthProxy } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../../config/env";

export const auth = betterAuth({
  baseURL: envVars.FRONTEND_URL,
  secret: envVars.BETTER_AUTH_SECRET,

  trustedOrigins: [
    envVars.FRONTEND_URL,
    "http://localhost:3000",
  ],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => ({
        role: Role.USER,
        status: UserStatus.ACTIVE,
        needPasswordChange: false,
        emailVerified: true,
        isDeleted: false,
        deletedAt: null,
      }),
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: Role.USER },
      status: { type: "string", defaultValue: UserStatus.ACTIVE },
      needPasswordChange: { type: "boolean", defaultValue: false },
      isDeleted: { type: "boolean", defaultValue: false },
      deletedAt: { type: "date", required: false },
    },
  },

  plugins: [
    bearer(),
    oAuthProxy(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return;
        if (type === "email-verification" && !user.emailVerified) {
          await sendEmail({ to: email, subject: "Verify your email", templateName: "otp", templateData: { name: user.name, otp } });
        }
        if (type === "forget-password") {
          await sendEmail({ to: email, subject: "Password Reset OTP", templateName: "otp", templateData: { name: user.name, otp } });
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 60 * 24 },
  },

  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
  },

  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
      
        },
      },
      state: {
        name: "oauth_state",
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
         
        },
      },
    },
  },
});