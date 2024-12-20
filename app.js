require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000 ;
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./util/database');
const User = require('./models/User');
const Expense = require('./models/Expense');
const Payment = require('./models/Payment');





app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
})
app.use('/api', userRoutes);


User.hasMany(Expense, { foreignKey: "userId", onDelete: 'CASCADE'});
Expense.belongsTo(User, { foreignKey: "userId"});

User.hasMany(Payment, {foreignKey: "userId", onDelete: "CASCADE"});
Payment.belongsTo(User, {foreignKey: "userId"})



sequelize
// .sync({force: true})
.sync()
.then((result)=>{
    
    app.listen(PORT, ()=>{
        console.log(`Server is running on the Port ${PORT}.`)
    })
})
.catch(err=>console.error(err));
