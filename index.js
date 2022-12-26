async function main() {
    try {
        require('dotenv').config();

        const express = require('express');
        const cors = require('cors');
        const { sequelize } = require('./database/config');
        const app = express();

        app.use( cors() );

        app.use(express.json());
        require('./models/user.model');
        require('./models/asset.model');
        await sequelize.sync();

        app.use('/api/auth',require('./routes/auth.route'));
        app.use('/api/asset',require('./routes/asset.route'));

        app.listen(process.env.PORT,() => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });   
    } catch (error) {
        throw new Error(`Something when wrong: ${error}`)
    }
}
main();