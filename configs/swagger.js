import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Gestor de la Empresa CORPEX API",
            version: "1.0.0",
            description: "API para un sistema de gestión de CORPEX",
            contact:{
                name: "Johan Tojin",
                email: "jtojin-2020591@kinal.edu.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3000/corporex/v1"
            }
        ]
    },
    apis:[
        "./src/auth/auth.routes.js",
        "./src/company/company.routes.js"
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi}
