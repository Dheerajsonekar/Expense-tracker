const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 3000;
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./util/database');
const User = require('./models/User');
const Expense = require('./models/Expense');
const { foreign_key } = require('i/lib/methods');





app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
})
app.use('/api', userRoutes);


User.hasMany(Expense, { foreignkey: 'userId', onDelete: 'CASCADE'});
Expense.belongsTo(User, { foreignkey: 'userId'});



sequelize
.sync()
.then((result)=>{
    
    app.listen(PORT, ()=>{
        console.log(`Server is running on the Port ${PORT}.`)
    })
})
.catch(err=>console.error(err));
