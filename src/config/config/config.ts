import dotenv from "dotenv"
dotenv.config()


export const DATABASE_URL= process.env.DATABASE_URL
export const LOGIN_API_URL= process.env.LOGIN_API_URL as string
export const DASHBOARD_URL= process.env.DASHBOARD_URL as string

