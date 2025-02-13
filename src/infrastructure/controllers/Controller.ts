import { Request, Response } from "express";
import Joi from "joi";

export class Controller {
  protected validateRequest(
    req: Request,
    res: Response,
    schema: Joi.ObjectSchema,
    source: "body" | "query" = "body" // Parámetro adicional para especificar la fuente
  ): boolean {
    const { error } = schema.validate(req[source]);
    if (!error) return true;

    res.status(422).json({ error: error.details[0].message });
    return false;
  }
}
