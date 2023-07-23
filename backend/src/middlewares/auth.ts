import { NextFunction, Request, Response } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any | undefined = res.locals.user

        if(!user) throw new Error("Unauthenticated")

        return next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Unauthenticated" })
    }
}