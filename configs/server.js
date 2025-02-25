"use strict"

import express from 'express'
import cors from "cors"
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import authRoutes from '../src/auth/auth.routes.js'
import {initializeAdminUser } from "../src/user/user.controller.js"
import companyRoutes from "../src/company/company.routes.js"

const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
 }


const routes = (app) => {
    app.use("/corporex/v1/auth", authRoutes)
    app.use("/corporex/v1/companies", companyRoutes)

}


const connectarDB = async () => {
    try{
        await dbConnection()
        await initializeAdminUser()
    }catch(err){
        console.log(`❌ Database connection failed: ${err}`)
    }
}


export const initServer = () =>{
    const app = express()
    try{
        middlewares(app)
        connectarDB()
        routes(app)
        app.listen(process.env.PORT)
        console.log(`✅ Server running on port: ${process.env.PORT}`)
    }catch(err){
        console.log(`❌Server init failed: ${err}`)
    }
}