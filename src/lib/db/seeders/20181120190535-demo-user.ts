import * as faker from "faker";
import { IUser } from "../../users/models/User";
import { QueryInterface } from "sequelize";

export default {
  up: (queryInterface: QueryInterface, Sequelize) => {
    const users: IUser[] = [];

    for (let index = 0; index < 20; index++) {
      users.push(
        {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: 1,
        },
      );
    }

    return queryInterface.bulkInsert("users", users, {});
  },
  down: (queryInterface: QueryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
