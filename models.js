const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('./db');


class User extends Model {

}

User.init ({
    userName:{
        type: DataTypes.STRING,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    }
},{
    sequelize, // We need to pass the connection instance
    modelName: 'User' // We need to choose the model name
})



class Category extends Model {

}

Category.init({
    cName: {
        type: DataTypes.STRING,
    },
},{
    sequelize,
    modelName: 'Category'
});


class Thread extends Model {

}

Thread.init({
    title: {
        type: DataTypes.STRING,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tContent:  {
        type: DataTypes.TEXT,
    },
},{
    sequelize,
    modelName: 'Thread'
});


class Reply extends Model {

}

Reply.init({
    rContent: {
        type: DataTypes.TEXT,
    },
},{
    sequelize,
    modelName: 'Reply'
});

User.hasMany(Thread, {
    foreignKey: {
        allowNull: false
    }
});
Thread.belongsTo(User);

Category.hasMany(Thread, {
    foreignKey: {
        allowNull: false
    }
});
Thread.belongsTo(Category);

Thread.hasMany(Reply, {
    foreignKey: {
        allowNull: false
    }
});
Reply.belongsTo(Thread);


sequelize.sync({alter:true});

module.exports = {User, Category, Thread, Reply};