import { Sequelize } from "sequelize";
import Config, { Options } from './sequelize.config'

// https://velog.io/@dlawogus/NodeJS-Express-Typescript%EB%A1%9C-Sequelize%ED%99%98%EA%B2%BD%EA%B5%AC%EC%B6%95
const env: string = process.env.NODE_ENV || 'development'
const config = Config[env]
const db: any = {}

console.log(config)
const sequelize = new Sequelize(
    config.database, 
    config.username, 
    config.password, 
    Options
)

const defaultOption = {
    timestamps: true, // timestamps가 true면 created_at, updated_at 자동으로 생김
    underscored: true, // createdAt, created_at 차이
    paranoid: true, // soft delete 구현, hard delete할거면 false 하면됨
    // modelName: 'Plan', // 자바스크립트에서 사용하는 이름
    // tableName: 'plans', // 실제 디비에서 사용하는 이름
    charset: "utf8mb4", // utf8mb4 이모티콘도 사용가능 해짐 utf8
    collate: "utf8mb4_general_ci", // 한글 저장 utf8mb4_general_ci, utf8_general_ci
}

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db
