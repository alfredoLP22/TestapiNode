# api Test

# comandos instalacion
npm install

# pasos posteriores 
- Renombrar o clonar .env.example a .env

# Configuracion base de datos
- Crear base de datos de manera local
- Por temas de practicidad no por mejor practica se utiliza sync para crear p modificar las entidades de BD automaticamente
- lo recomendable es crear migraciones 

| **PORT** | puerto de despliegue de api
| **DB_NAME** | nombre base de datos
| **DB_USERNAME** | usuario de conexiobn a host de base de datos
| **DB_HOST** | Host de conexion a base de datos
| **DB_PASSWORD** | Contraseña de base de datos (dejar en blanco en caso de no tener una)
| **JWT_SECRET** | Palabra secreta para generacion de json web tokens para login de usuarios