module.exports = (sequelize, DataTypes, Model) => {
  class User extends Model {}

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: {
            msg: 'Only alphabets are allowed',
          },
          len: [2, 10],
        },
        get() {
          const rawValue = this.getDataValue('firstName');
          return rawValue ? 'Mr. ' + rawValue.toUpperCase() : null;
        },
      },
      lastName: {
        type: DataTypes.STRING,
        defaultValue: 'Singh',
        set(value) {
          this.setDataValue('lastName', value + ', Indian');
        },
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set() {
          throw new Error('Setting `fullName` directly is not allowed!');
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: false, // Set this to false if you don't need createdAt/updatedAt fields
    },
  );

  return User;
};
