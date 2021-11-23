import {
  loginMutation,
  newAcademicYearMutation,
  newScheduleMutation,
  registerMutation
} from "src/graphql/mutation";
import { meQuery } from "src/graphql/query";
import { testClient } from "../../../../test/graphqlTestClient";
import faker from "faker";
import { getConnection } from "typeorm";
import { AcademicYear } from "src/entity";
import { newHolidayMutation } from "src/graphql/mutation/holiday";

const testUser = {
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password: faker.internet.password()
};

/**
 * user setup
 */
let accessToken: string;
describe("setting up user account", () => {
  it("should create new account for user", async () => {
    const response = await testClient({
      source: registerMutation,
      variableValues: {
        email: testUser.email,
        username: testUser.username,
        password: testUser.password
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
  });
  it("should login user", async () => {
    const response = await testClient({
      source: loginMutation,
      variableValues: {
        email: testUser.email,
        password: testUser.password
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    accessToken = response.data!.login!.accessToken;
  });
  it("should show authenticated user", async () => {
    expect(accessToken).toBeDefined();
    const response = await testClient({
      source: meQuery,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
  });
});

/**
 * creating first academic year
 */
let academicYearIdOne: string;
describe("create academic year with fixed schedule and term", () => {
  it("should create empty academic year", async () => {
    const response = await testClient({
      source: newAcademicYearMutation,
      variableValues: {
        startDate: "September 12 2021",
        endDate: "March 12 2022"
      },
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    academicYearIdOne = response.data!.newAcademicYear!.id;
  });

  let scheduleId: string;
  it("should create fixed schedule", async () => {
    const response = await testClient({
      source: newScheduleMutation,
      variableValues: {
        type: "fixed",
        academicYearId: academicYearIdOne
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    scheduleId = response.data!.newSchedule!.id;
  });

  it("should show academic year with fixed schedule and term", async () => {
    const academicYearRepository = getConnection(
      process.env.NODE_ENV
    ).getRepository(AcademicYear);
    const academicYear = (await academicYearRepository.findOne(
      academicYearIdOne,
      {
        relations: ["schedule"]
      }
    )) as AcademicYear;
    expect(academicYear).toHaveProperty("schedule");
    expect(academicYear.schedule).not.toBeNull();
    expect(academicYear.schedule.id).toEqual(scheduleId);
  });
});

/**
 * creating second academic year
 */
let academicYearIdTwo: string;
describe("create academic year with fixed schedule and term", () => {
  it("should create empty academic year", async () => {
    const response = await testClient({
      source: newAcademicYearMutation,
      variableValues: {
        startDate: "March 13 2022",
        endDate: "September 13 2022"
      },
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    academicYearIdTwo = response.data!.newAcademicYear!.id;
  });

  let scheduleId: string;
  it("should create fixed schedule", async () => {
    const response = await testClient({
      source: newScheduleMutation,
      variableValues: {
        type: "fixed",
        academicYearId: academicYearIdTwo
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    scheduleId = response.data!.newSchedule!.id;
  });

  it("should show academic year with fixed schedule and term", async () => {
    const academicYearRepository = getConnection(
      process.env.NODE_ENV
    ).getRepository(AcademicYear);
    const academicYear = (await academicYearRepository.findOne(
      academicYearIdTwo,
      {
        relations: ["schedule"]
      }
    )) as AcademicYear;
    expect(academicYear).toHaveProperty("schedule");
    expect(academicYear.schedule).not.toBeNull();
    expect(academicYear.schedule.id).toEqual(scheduleId);
  });
});

/**
 * create new holiday
 */
describe("create holiday", () => {
  it("should create new holiday for academic year one", async () => {
    const response = await testClient({
      source: newHolidayMutation,
      variableValues: {
        startDate: "December 25 2021",
        endDate: "December 25 2021",
        academicYearId: academicYearIdOne,
        name: "Christmas"
      },
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
  });

  it("should create new holiday for academic year two", async () => {
    const response = await testClient({
      source: newHolidayMutation,
      variableValues: {
        startDate: "October 31 2022",
        endDate: "October 31 2022",
        academicYearId: academicYearIdTwo,
        name: "Halloween"
      },
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
  });

  it("should have 1 holiday in academic year one", async () => {
    const academicYearRepository = getConnection(
      process.env.NODE_ENV
    ).getRepository(AcademicYear);
    const academicYear = (await academicYearRepository.findOne(
      academicYearIdOne,
      {
        relations: ["holidays"]
      }
    )) as AcademicYear;
    expect(academicYear).toHaveProperty("holidays");
    expect(academicYear.holidays).not.toBeNull();
    expect(academicYear.holidays.length).toEqual(1);
  });

  it("should have 1 holiday in academic year two", async () => {
    const academicYearRepository = getConnection(
      process.env.NODE_ENV
    ).getRepository(AcademicYear);
    const academicYear = (await academicYearRepository.findOne(
      academicYearIdTwo,
      {
        relations: ["holidays"]
      }
    )) as AcademicYear;
    expect(academicYear).toHaveProperty("holidays");
    expect(academicYear.holidays).not.toBeNull();
    expect(academicYear.holidays.length).toEqual(1);
  });
});
