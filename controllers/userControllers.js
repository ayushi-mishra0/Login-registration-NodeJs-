
const { where } = require('sequelize');

var db = require('../models')
var User = db.user;
var Contact = db.contact;
const { Sequelize, Op, QueryTypes} = require('sequelize');
var db = require("../models")
const nodemailer = require("nodemailer");

var addUser = async (req, res) =>{
    const jane = await User.create({ firstName: "ravi" ,lastName: "kumar"});
        //const jane = User.build({ firstName: "Jane" ,lastName: "singh"});
        console.log(jane instanceof User); // true
        console.log(jane.firstName); // "Jane"
        //jane.set({ firstName: "Anuj" ,lastName: "Kumar"});
        // await jane.update({ firstName: "arun" ,lastName: "singha"});
        // await jane.save();
        //await jane.save();
        console.log('Jane was saved to the database!');
        // await jane.destroy();
        await jane.reload();
        console.log(jane.toJSON());
        res.status(200).json(jane.toJSON());
    }
    

var getUsers = async (req,res)=>{
    const data = await User.findAll({});
    res.status(200).json({data:data});
}

var getUser = async (req,res)=>{
    const data = await User.findOne({
        where:{
            id:req.params.id
        }
    });
    res.status(200).json({data:data});
}

var postUsers = async (req, res)=>{
    var postData = req.body;
    if(postData.length>1){
        var data = await User.bulkCreate(postData);
    }else{
        var data = await User.create(postData);
    }
    res.status(200).json({data:data});
}

var deleteUser = async (req, res) => {
    const userId = req.params.id;
    
    // Check if the user exists
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user exists, proceed to delete
    const result = await User.destroy({
      where: { id: userId }
    });
  
    res.status(200).json({ data: result });
  }
  
  var updateUser = async (req, res)=>{
    var updatedData = req.body;
    const data = await User.update(updatedData,{
        where:{
            id:req.params.id
        }
    });
    res.status(200).json({data:data});
}

// var updateUser = async (req,res)=>{
//     var updatedData = req.body;
//     const data = await User.update(updatedData,{
//         where:{
//             id:req.params.id
//         }
//     });// Importing the Customer model
//     const { Customer } = require('../models'); // Adjust the path if your models are in a different folder
    
//     // Function to create a new customer
//     async function createCustomer(name, email) {
//         try {
//             const newCustomer = await Customer.create({
//                 name: name,
//                 email: email
//             });
//             console.log('Customer created:', newCustomer);
//         } catch (error) {
//             console.error('Error creating customer:', error);
//         }
//     }
    
//     // Function to find a customer by email
//     async function findCustomerByEmail(email) {
//         try {
//             const customer = await Customer.findOne({
//                 where: { email: email }
//             });
//             if (customer) {
//                 console.log('Customer found:', customer);
//             } else {
//                 console.log('Customer not found');
//             }
//         } catch (error) {
//             console.error('Error finding customer:', error);
//         }
//     }
    
//     // Function to update a customer's name by email
//     async function updateCustomerName(email, newName) {
//         try {
//             const [updated] = await Customer.update({ name: newName }, {
//                 where: { email: email }
//             });
//             if (updated) {
//                 console.log('Customer name updated');
//             } else {
//                 console.log('Customer not found');
//             }
//         } catch (error) {
//             console.error('Error updating customer:', error);
//         }
//     }
    
//     // Function to delete a customer by email
//     async function deleteCustomerByEmail(email) {
//         try {
//             const deleted = await Customer.destroy({
//                 where: { email: email }
//             });
//             if (deleted) {
//                 console.log('Customer deleted');
//             } else {
//                 console.log('Customer not found');
//             }
//         } catch (error) {
//             console.error('Error deleting customer:', error);
//         }
//     }
    
//     // Function to fetch all customers
//     async function getAllCustomers() {
//         try {
//             const customers = await Customer.findAll();
//             console.log('All customers:', customers);
//         } catch (error) {
//             console.error('Error fetching customers:', error);
//         }
//     }
    
//     // Example usage of the functions
//     async function runExamples() {
//         // Creating a new customer
//         await createCustomer('John Doe', 'john.doe@example.com');
    
//         // Finding a customer by email
//         await findCustomerByEmail('john.doe@example.com');
    
//         // Updating a customer's name
//         await updateCustomerName('john.doe@example.com', 'Jonathan Doe');
    
//         // Fetching all customers
//         await getAllCustomers();
    
//         // Deleting a customer by email
//         await deleteCustomerByEmail('john.doe@example.com');
    
//         // Fetching all customers again to confirm deletion
//         await getAllCustomers();
//     }
    
//     // Run the examples
//     runExamples();
    
//     res.status(200).json({data:data});
// }

 //var queryUser = async (req, res)=>{
//     const data = await User.findAll({
//         attributes: { exclude:['firstName','lastName'],
//         include: ['id',[Sequelize.fn('COUNT', Sequelize.col('id')), 'count']]
//     }
//     });
//     res.status(200).json({data:data});
// }

//var queryUser = async (req, res)=>{
//     const data = await User.findAll({
//         where: {
//             [Op.and]: [
//                 { id: 1 },
//                 { firstName: 'Arun' }],
//         },
//       });
//     res.status(200).json({data:data});
// }

// var queryUser = async (req, res)=>{
//     const data = await User.findAll({
//         order: [
//             ['id','DESC']
//         ],
//         // group: 'lastName',
//         limit: 1,
//         offset: 1
//       });
//     res.status(200).json({data:data});
// }

var queryUser = async (req, res)=>{
    const data = await User.count({
        where: {
          id: {
            [Op.gt]: 3,
          },
        },
      });
    res.status(200).json({data:data});
}

var findersUser = async (req, res)=>{
    const {count, rows} = await User.findAndCountAll({
        where: { lastName: 'Singha' }
      });
    res.status(200).json({data:rows, count:count});
}

var getSetVirtualUser = async (req, res)=>{
    const data = await User.findAll({
        where: { lastName: 'Singha' }
      });
    // const data = await User.create({
    //     firstName: 'Naresh',
    //     lastName: 'Kumar'
    //   });
    res.status(200).json({data:data});
}

var validateUser = async (req, res) =>{
    var data={};
    var messages={};
    try{
        data = await User.create({
            firstName: 'yash',
            lastName: 'Kumar'
        });
    }catch(e){
        // console.log(e.errors)
        let message;
        e.errors.forEach(error => {
            switch(error.validatorKey){
                case 'isAlpha':
                    message='Only alphabets are allowed'
                    break;
                case 'isLowercase':
                    message='Only lowercase is allowed'
                    break;
                case 'len':
                    message='min 2 max 10 characters allowed'
                    break;
            }
            messages[error.path]=message
        });
    }
    res.status(200).json({data:data,messages:messages});
}

var rawQueriesUser = async (req, res) =>{
    const users = await db.sequelize.query('SELECT * FROM users WHERE id=$id', {
        bind: {id:'1'},
        type: QueryTypes.SELECT,
      });
    res.status(200).json({data:users});
}

var oneToOneUser = async (req, res) =>{
    // var data = await User.create({firstName:'gurmeet', lastName:'singh'})
    // if(data && data.id){
    //     await Contact.create({permanent_address:'abc', current_address:'xyz',
    //         'user_id':data.id
    //     })
    // }
    //var data = await User.findAll({
    //     attributes: ['firstName','lastName'],
    //     include:[{
    //         model:Contact,
    //         as: 'contactDetails',
    //         attributes:['permanent_address','current_address']
    //     }],
    //     where:{id:2}
    // })
    // res.status(200).json({data:data});
    var data = await Contact.findAll({
        attributes: ['permanent_address','current_address']['firstName','lastName'],
        include:[{
            model:User,
            as: 'userDetails',
            attributes:['firstName','lastName']
        }],
        where:{id:2}
    })
    res.status(200).json({data:data});
}
var oneToManyUser = async (req,res)=>{
    // await Contact.create({permanent_address:'Gurugram', current_address:'Merath',
    //     'user_id':1
    // })
    // var data = await User.findAll({
    //     attributes: ['firstName','lastName'],
    //     include:[{
    //         model:Contact,
    //         as: 'contactDetails',
    //         attributes:['permanent_address','current_address']
    //     }]
    // })
    var data = await Contact.findAll({
        attributes: ['permanent_address','current_address'],
        include:[{
            model:User,
            as: 'userDetails',
            attributes:['firstName','lastName']
        }]
    })
    res.status(200).json({data:data});
}

var manyToManyUser = async (req,res)=>{
    // var data = await User.create({firstName:'arun', lastName:'gupta'})
    // if(data && data.id){
    //     await Contact.create({permanent_address:'noida', current_address:'hapur'
    //     })
    // }
    // var data = {}
    // var data = await Contact.findAll({
    //     attributes: ['permanent_address','current_address'],
    //     include:[{
    //         model:User,
    //         attributes:['firstName','lastName']
    //     }]
    // })
    var data = await User.findAll({
        attributes: ['firstName','lastName'],
        include:[{
            model:Contact,
            attributes:['permanent_address','current_address']
        }]
    })
    res.status(200).json({data:data});
}

//-----------------##NodeMailer##------------------------
//-------------------------------------------------------

const sendMail = async (req, res) =>{
    let testAccount = await nodemailer.createTestAccount();

    //connect with the smtp
    let transporter = await nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
           user: 'myles.kuhlman68@ethereal.email',
            pass: 'V7vYQ7yYaNpmaDppwV'
        },
    })

    let info = await transporter.sendMail({
        from: '"Ayushi Mishra 👻" <rupal@gmail.com>', // sender address
        to: "ayushi@gmail.com.", // list of receivers
        subject: "Hello Ayushi", // Subject line
        text: "Hello Ayushi!How are you?", // plain text body
        html: "<b>Hello Ayushi. How are you?</b>", // html body
    })

    console.log("Message sent: %s", info.messageId);
    res.json(info);
};

module.exports={
    addUser,
    getUsers,
    getUser,
    postUsers,
    deleteUser,
    updateUser,
    queryUser,
    findersUser,
    getSetVirtualUser,
    validateUser,
    rawQueriesUser,
    oneToOneUser,
    oneToManyUser,
    manyToManyUser,
    sendMail
}