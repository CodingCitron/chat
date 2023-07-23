import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import prisma from "../libs/prisma";
import { exclude } from "../utils";

// https://www.prisma.io/docs/concepts/components/prisma-client/custom-models
export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token
        if(!token) return next()
    
        // 먼저 Sub을 생성할 수 있는 유저인지 체크하기 위해 유저 정보 가져오기
        const { email }: any = jwt.verify(token, process.env.JWT_SECRET || '')
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        
        // 유저 정보를 res.local.user에 넣어주기
        res.locals.user = exclude(user || {}, ['password'])
        return next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Something went wrong" })
    }
}