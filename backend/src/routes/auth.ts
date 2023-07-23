import { NextFunction, Request, Response, Router } from "express";
import prisma from "../libs/prisma";

const register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name, confirmPassword } = req.body
    const errors: any = {}

    try {
        const user = await prisma?.user.findUnique({
            where: {
                email: 'email'
            }
        })

        if(user) errors.email = "이미 해당 이메일 주소가 사용되었습니다."

        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        // const createUser = await prisma.user.create({
        //     email,

        // })

    } catch(error: any) {
        console.error(error)
        next(error)
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

}

const logout = async (_: Request, res: Response) => {

}

const router = Router()

router.post('/register', register)

export default router