import { NextFunction, Request, Response, Router } from "express";
import prisma from "../libs/prisma";
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import userMiddleware from '../middlewares/user'
import authMiddleware from '../middlewares/auth'

const register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body
    const errors: any = {}

    try {
        const userExists = await prisma?.user.findUnique({
            where: {
                email
            }
        })

        if(userExists) errors.email = "이미 해당 이메일 주소가 사용되었습니다."

        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        const hashedPassword: string = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            } as Prisma.UserCreateInput
        })

        const token = jwt.sign({ email, name }, process.env.JWT_SECRET || '')

        // 쿠키저장
        res.set("set-cookie", cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "productioon",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/"
        }))

        return res.json({ 
            name: user.name,
            email: user.email,
            token 
        })
    } catch(error: any) {
        console.error(error)
        next(error)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const errors: any = {}

    try {
        // if(isEmpty(username)) errors.username = "이메일은 비워둘 수 없습니다."
        // if(isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다."

        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        const user: any = await prisma.user.findUnique({
            where: {
              email,
            }
        })
        
        if(!user) {
            return res.status(404).json({ username: "이메일이 등록되지 않았습니다." })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch) {
            return res.status(401).json({ password: "비밀번호가 잘못되었습니다." })
        }

        // 비밀번호가 맞다면 토큰 생성
        const token = jwt.sign({ 
            email: user.email, 
            name: user.name 
        }, process.env.JWT_SECRET || '')

        // 쿠키저장
        res.set("set-cookie", cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "productioon",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/"
        }))
        return res.json({ 
            email: user.email, 
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const logout = async (_: Request, res: Response) => {
    res.set(
        "Set-Cookie",
        cookie.serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0),
            path: "/"
        })
    )

    res.status(200).json({ success: true })
}

const loadUser = async (req: Request, res: Response) => {
    return res.json({
        ...res.locals.user,
        token: req.cookies.token
    })
}

const router = Router()

router.get("/", userMiddleware, authMiddleware, loadUser)
router.post('/register', register)
router.post('/login', login)
router.post('/logout', userMiddleware, authMiddleware, logout)

export default router