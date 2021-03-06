import { registerEnumType } from "type-graphql";
import { createConnection, getConnection } from "typeorm";
import {
  AcademicYear,
  AcademicYearSchedule,
  WeekRotationSchedule,
  DayRotationSchedule,
  Term,
  Class,
  ClassSchedule,
  OneOffSchedule,
  RepeatSchedule,
  Exam,
  Subject,
  Task,
  User,
  UserProvider,
  Holiday
} from "../src/entity";
import {
  AcademicYearScheduleType,
  ClassScheduleType,
  DayOfWeek,
  TaskType
} from "../src/entity/types";

beforeAll(async () => {
  await createConnection({
    name: "test",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "nova",
    password: "",
    database: "mystudylife_test",
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: [
      AcademicYear,
      AcademicYearSchedule,
      WeekRotationSchedule,
      DayRotationSchedule,
      Term,
      Class,
      ClassSchedule,
      OneOffSchedule,
      RepeatSchedule,
      Exam,
      Subject,
      Task,
      User,
      UserProvider,
      Holiday
    ]
  });

  registerEnumType(ClassScheduleType, { name: "ClassScheduleType" });
  registerEnumType(AcademicYearScheduleType, {
    name: "AcademicYearScheduleType"
  });
  registerEnumType(DayOfWeek, { name: "DayOfWeek" });
  registerEnumType(TaskType, { name: "TaskType" });
});

afterAll(async () => {
  const defaultConnection = getConnection(process.env.NODE_ENV);
  await defaultConnection.close();
});
