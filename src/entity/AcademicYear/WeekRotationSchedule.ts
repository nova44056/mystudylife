import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AcademicYearSchedule } from "..";

@Entity("academic_year_week_rotation_schedules")
@ObjectType()
export class WeekRotationSchedule {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  numOfWeek: number;

  @Column()
  @Field(() => Int)
  startWeek: number;

  @Column({ nullable: true })
  scheduleId: string;

  @OneToOne(() => AcademicYearSchedule, { createForeignKeyConstraints: false })
  @JoinColumn({ name: "scheduleId" })
  schedule: AcademicYearSchedule;
}