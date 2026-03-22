import { NextFunction, Request, Response } from "express";
import { IUpdateClientInfoPayload, IUpdateClientPayload } from "./client.interface";

export const updateMyClientProfileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }

  const payload: IUpdateClientPayload = req.body;

  const files = req.files as {
    [fieldName: string]: Express.Multer.File[] | undefined;
  };

  if (files?.profilePhoto?.[0]) {
    if (!payload.clientInfo) {
      payload.clientInfo = {} as IUpdateClientInfoPayload;
    }
    payload.clientInfo.profilePhoto = files.profilePhoto[0].path;
  }

  req.body = payload;

  next();
};