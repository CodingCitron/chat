import { Options as OptionsType } from "sequelize"

export interface ConfigValues {
  username: string,
  password: string,
  database: string,
}

export interface ConfigType {
  [key: string]: ConfigValues
}

const Config: ConfigType = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },  
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },
  production: {
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
  }
}

export const Options: OptionsType = {
  host: 'db', // container service 명
  dialect: 'postgres',
  timezone: '+9:00'
}

export default Config
