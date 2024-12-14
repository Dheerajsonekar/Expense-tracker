const expense = require("../models/Expense");

exports.expensePost = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    const response = await expense.create({ amount, description, category });
    if (response.ok) {
      return res.status(201).json({ message: "expense posted successfully!" });
    }
  } catch (err) {
    console.error("failed to post expense", err);
    return res.status(500).json(err);
  }
};

exports.showExpense = async (req, res)=>{
    
    try{
     
      const response = await expense.findAll();
      if(response){
        return res.status(201).json(response);
      }
     

    }catch(err){
        console.error('failed to showExpenses');
        return res.status(500).json({message: 'failed to show expenses.'});
    }
}
