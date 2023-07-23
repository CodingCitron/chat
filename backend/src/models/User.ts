import { Association, DataTypes, Model } from "sequelize"
import { sequelize } from './'

interface UserAttributes {
    email: string
    password: string
    nickname: string
}

export class User extends Model<UserAttributes> {
    public readonly id!: number
    public email!: string
    public password!: string
    public nickcname!: string

   // timestamps!
   public readonly createdAt!: Date;
   public readonly updatedAt!: Date;

   public static associations: {}
}

User.init({
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    modelName : 'User',
    tableName : 'users',
    sequelize,
    freezeTableName : true,
    timestamps : true,
    updatedAt : 'updateTimestamp',
    charset: "utf8mb4", // utf8mb4 이모티콘도 사용가능 해짐 utf8
    collate: "utf8mb4_general_ci", // 한글 저장 utf8mb4_general_ci, utf8_general_ci
})

// Users.hasMany(Scores, {
//     sourceKey : "id",
//     foreignKey : "user_id",
//     as : 'userHasManyScores'
// });