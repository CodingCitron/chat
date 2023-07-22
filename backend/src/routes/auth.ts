import { Request, Response, Router } from "express";

const register = async (req: Request, res: Response) => {
    
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

}

const logout = async (_: Request, res: Response) => {

}

const router = Router()

export default router