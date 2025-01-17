import { Request, Response } from "express";
import Joi from "joi";

export class Controller {
  
  protected validateRequest(
    req: Request,
    res: Response,
    schema: Joi.ObjectSchema
  ): boolean {
    const { error } = schema.validate(req.body);
    if (!error) return true;

    res.status(422).json({ error: error.details[0].message });
    return false;
  }
}
