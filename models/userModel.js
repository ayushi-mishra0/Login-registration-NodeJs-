module.exports = (sequelize, DataTypes) => {
  const userModel = sequelize.define('userModel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING,
    },
    otpExpiresAt: {
      type: DataTypes.DATE
    },
    verificationToken: {
      type: DataTypes.STRING
    },
    verificationTokenExpiresAt: {
      type: DataTypes.DATE
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'userModel',  // Updated to follow PascalCase convention
  });

  return userModel;
}
