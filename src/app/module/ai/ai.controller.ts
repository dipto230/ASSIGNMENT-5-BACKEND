/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AIService } from "./ai.service";
import { LawyerService } from "../lawyer/lawyer.service";


const normalizeCategory = (category: string) => {
  const map: Record<string, string> = {
    "criminal defense": "Criminal Law",
    criminal: "Criminal Law",
    "family law": "Family Law",
    family: "Family Law",
    tax: "Tax Law",
    "tax law": "Tax Law",
    immigration: "Immigration Law",
  };

  return map[category?.toLowerCase()] || category;
};

export const AIController = {

  chat: catchAsync(async (req: Request, res: Response) => {
    const { message } = req.body;

    const result = await AIService.chatWithAI(message);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "AI response generated",
      data: result,
    });
  }),

  
  search: catchAsync(async (req: Request, res: Response) => {
    const { query } = req.body;

    const result = await AIService.searchWithAI(query);

    let parsedResult;

    
    try {
      parsedResult = JSON.parse(result);
    } catch {
      parsedResult = { type: "general", raw: result };
    }

    
    if (parsedResult.type === "lawyer_search") {
      const normalizedCategory = normalizeCategory(parsedResult.category);

      const lawyers = await LawyerService.getAllLawyers({
        searchTerm: normalizedCategory,
      });

      
      if (!lawyers?.data?.length) {
        const fallbackLawyers = await LawyerService.getAllLawyers({
          searchTerm: parsedResult.category,
        });

        return sendResponse(res, {
          httpStatusCode: status.OK,
          success: true,
          message: "Fallback search result",
          data: fallbackLawyers,
        });
      }

      return sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Lawyers fetched successfully",
        data: lawyers,
      });
    }

    
    if (parsedResult.type === "appointment_help") {
      return sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Appointment guidance",
        data: "Go to booking page → select lawyer → choose time slot → confirm.",
      });
    }

    
    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "AI search result",
      data: parsedResult,
    });
  }),
};