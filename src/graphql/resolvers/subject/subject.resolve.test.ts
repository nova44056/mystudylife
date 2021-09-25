import { AcademicYear, Subject } from "src/entity";
import {
  loginMutation,
  newAcademicYearMutation,
  newScheduleMutation,
  newSubjectMutation,
  registerMutation,
} from "src/graphql/mutation";
import { meQuery } from "src/graphql/query";
import { getConnection } from "typeorm";
import { testClient } from "../../../../test/graphqlTestClient";
import faker from "faker";

const testUser = {
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
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
        password: testUser.password,
      },
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
  });
  it("should login user", async () => {
    const response = await testClient({
      source: loginMutation,
      variableValues: {
        email: testUser.email,
        password: testUser.password,
      },
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
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
  });
});

/**
 * creating academic year with fixed schedule and no term
 */
let academicYearId: string;
describe("create academic year with fixed schedule and no term", () => {
  it("should create empty academic year", async () => {
    const response = await testClient({
      source: newAcademicYearMutation,
      variableValues: {
        startDate: "September 12 2021",
        endDate: "March 12 2022",
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    academicYearId = response.data!.newAcademicYear!.id;
  });

  let scheduleId: string;
  it("should create fixed schedule", async () => {
    const response = await testClient({
      source: newScheduleMutation,
      variableValues: {
        type: "fixed",
        academicYearId: academicYearId,
      },
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    scheduleId = response.data!.newSchedule!.id;
  });

  it("should show academic year with fixed schedule", async () => {
    const academicYearRepository = getConnection(
      process.env.NODE_ENV
    ).getRepository(AcademicYear);
    const academicYear = (await academicYearRepository.findOne(academicYearId, {
      relations: ["schedule"],
    })) as AcademicYear;
    expect(academicYear).toHaveProperty("schedule");
    expect(academicYear.schedule).not.toBeNull();
    expect(academicYear.schedule.id).toEqual(scheduleId);
  });
});

describe("test case 1: create subject with no academic year", () => {
  let subjectId: string;
  it("should create subject with no academic year", async () => {
    const response = await testClient({
      source: newSubjectMutation,
      variableValues: {
        name: "Subject 1",
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    subjectId = response.data!.newSubject.id;
  });
  it("should display subject with no academic year", async () => {
    const subjectRepository = getConnection(process.env.NODE_ENV).getRepository(
      Subject
    );
    const subject = await subjectRepository.findOne(subjectId, {
      relations: ["academicYear"],
    });
    expect(subject?.academicYear).toBeNull();
  });
});

describe("test case 2: create subject with academic year", () => {
  let subjectId: string;
  it("should create subject with academic year", async () => {
    const response = await testClient({
      source: newSubjectMutation,
      variableValues: {
        name: "Subject 2",
        academicYearId: academicYearId,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeNull();
    subjectId = response.data!.newSubject.id;
  });
  it("should display subject with academic year", async () => {
    const subjectRepository = getConnection(process.env.NODE_ENV).getRepository(
      Subject
    );
    const subject = await subjectRepository.findOne(subjectId, {
      relations: ["academicYear"],
    });
    expect(subject?.academicYear).not.toBeNull();
  });
});
