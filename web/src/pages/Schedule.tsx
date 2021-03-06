import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import {
  EditAcademicYear,
  ManageSubject,
  NewAcademicYear,
  NewClass,
  NewHoliday,
  ViewClass
} from "../components/modal";
import {
  GetAcademicYearsQuery,
  GetClassesQuery,
  GetClassesQueryResult,
  useGetAcademicYearsQuery,
  useGetClassesQuery
} from "../generated/graphql";

import css from "./Schedule.module.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectScheduleComponentState,
  setScheduleComponentState
} from "../shared/Schedule.slice";
import { formatDate, formatTime } from "../utils";
import ctx from "classnames";
import { setHolidayPayload } from "../shared/NewHoliday.slice";
import { EditHoliday } from "../components/modal/EditHoliday";
import { BsPencil } from "react-icons/bs";

interface Props {}

export const Schedule: React.FC<Props> = () => {
  const { data, loading } = useGetAcademicYearsQuery();
  const { selectedYear } = useAppSelector(selectScheduleComponentState);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (data)
      dispatch(
        setScheduleComponentState({
          key: "academicYears",
          value: data.getAcademicYears
        })
      );
  }, [data]);

  return (
    <div className={css.content}>
      <header className={css.header}>
        <h2 className={css.title + " txt-lg"}>Schedule</h2>
        <div>
          <ManageSubject />
          {selectedYear && <EditAcademicYear />}
          <NewAcademicYear />
        </div>
      </header>
      <div className={css.body}>
        {data && data!.getAcademicYears.length > 0 ? (
          <ScheduleListing schedules={data.getAcademicYears} />
        ) : (
          !loading && <EmptySchedule />
        )}
      </div>
    </div>
  );
};

const EmptySchedule: React.FC = () => {
  return (
    <div className={css.emptySchedule}>
      <div className={css.emptyScheduleContent}>
        <div className={css.emptyScheduleIcon}>
          <AiOutlineCalendar />
        </div>
        <div className="txt-lg">Add Your Schedule</div>
        <div className="txt-sm">
          This is where your years, terms, classes and holidays will live. Add
          an academic year to get started
        </div>
        <div>
          <NewAcademicYear />
        </div>
      </div>
    </div>
  );
};

interface ScheduleListingProps {
  schedules: GetAcademicYearsQuery["getAcademicYears"];
}

const ScheduleListing: React.FC<ScheduleListingProps> = ({ schedules }) => {
  const dispatch = useAppDispatch();
  const { selectedYear, selectedTerm } = useAppSelector(
    selectScheduleComponentState
  );
  var { data: classesQueryResult } = useGetClassesQuery();
  const [classes, setClasses] = React.useState<GetClassesQuery["getClasses"]>(
    []
  );

  React.useEffect(() => {
    dispatch(
      setScheduleComponentState({
        key: "selectedYear",
        value: schedules[0]
      })
    );
  }, [schedules]);

  React.useEffect(() => {
    if (classesQueryResult) setClasses([...classesQueryResult?.getClasses]);
  }, [classesQueryResult]);

  React.useEffect(() => {
    if (classes && classesQueryResult) {
      setClasses([
        ...classesQueryResult?.getClasses.filter(
          (c) =>
            c.academicYear?.id === selectedYear?.id || c.academicYear === null
        )
      ]);
    }
  }, [selectedYear, classesQueryResult]);

  React.useEffect(() => {
    if (selectedYear)
      dispatch(
        setHolidayPayload({
          key: "academicYearId",
          value: selectedYear.id
        })
      );
  }, [selectedYear]);

  if (classes)
    return (
      <div className={css.scheduleListing}>
        <div>
          {schedules.map((schedule) => (
            <React.Fragment>
              <div
                key={schedule.id}
                onClick={() => {
                  dispatch(
                    setScheduleComponentState({
                      key: "selectedYear",
                      value: schedule
                    })
                  );
                  dispatch(
                    setScheduleComponentState({
                      key: "selectedTerm",
                      value: null
                    })
                  );
                }}
                className={
                  selectedYear?.id === schedule.id && !selectedTerm
                    ? css.active
                    : undefined
                }
              >
                <div className="txt-md">
                  {schedule.startDate.split("-")[0]}
                  {" - "}
                  {schedule.endDate.split("-")[0]}
                </div>
                <div className="txt-xs">
                  {new Date(schedule.startDate)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric"
                    })
                    .split(",")
                    .join("")}
                  {" - "}
                  {new Date(schedule.endDate)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric"
                    })
                    .split(",")
                    .join("")}
                </div>
              </div>
              {schedule.terms.length > 0 &&
                [...schedule.terms]
                  .sort((a, b) => {
                    return new Date(a.startDate) > new Date(b.startDate)
                      ? 1
                      : -1;
                  })
                  .map((term) => (
                    <div
                      onClick={() => {
                        dispatch(
                          setScheduleComponentState({
                            key: "selectedTerm",
                            value: term
                          })
                        );
                      }}
                      className={ctx(
                        css.term,
                        selectedTerm?.id === term.id && css.active
                      )}
                    >
                      <div className="txt-sm txt-thin">{term.name}</div>
                      <div className="txt-sm txt-thin">
                        {new Date(term.startDate)
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric"
                          })
                          .split(",")
                          .join("")}
                        {" - "}
                        {new Date(term.endDate)
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric"
                          })
                          .split(",")
                          .join("")}
                      </div>
                    </div>
                  ))}
            </React.Fragment>
          ))}
        </div>
        <div>
          <div>
            <div className="txt-md">Classes</div>
            <NewClass />
          </div>
          <div className={css.classListing}>
            {classes
              .filter((c) => {
                if (selectedTerm) {
                  return c.term?.id === selectedTerm?.id;
                }
                return c.academicYear?.id === selectedYear?.id;
              })
              .map((c) => (
                <ViewClass
                  data={c}
                  childController={
                    <div className={css.class}>
                      <div>
                        <div className="txt-md">{`${c.subject.name} ${
                          c.module ? `: ${c.module}` : ``
                        }`}</div>
                        <div className="txt-sm">{c.teacher}</div>
                      </div>
                      {c.schedule.type === "oneOff" && (
                        <div className="txt-sm txt-thin">{`${formatTime(
                          c.schedule.oneOff?.startTime
                        )} - ${formatTime(c.schedule.oneOff?.endTime)}`}</div>
                      )}
                      {c.schedule.type === "repeat" &&
                        c!.schedule!.repeat!.map((r: any) => (
                          <div
                            style={{ textTransform: "capitalize" }}
                            className="txt-sm txt-thin"
                          >
                            {`${formatTime(r.startTime)} - ${formatTime(
                              r.endTime
                            )} ${r.repeatDays.join(",")}`}
                          </div>
                        ))}
                    </div>
                  }
                />
              ))}
          </div>
        </div>
        <div>
          <div>
            <div className="txt-md">Holiday</div>
            <NewHoliday />
          </div>
          <div className={css.holidayListing}>
            {selectedYear?.holidays.map((h) => (
              <EditHoliday
                childController={
                  <div className={css.holiday}>
                    <div className={css.left}>
                      <div>{h.name}</div>
                      <div className="txt-thin txt-sm">
                        {h.startDate === h.endDate
                          ? formatDate(new Date(h.startDate))
                          : `${formatDate(
                              new Date(h.startDate)
                            )} - ${formatDate(new Date(h.endDate))}`}
                      </div>
                    </div>
                    <BsPencil />
                  </div>
                }
                c={h}
                academicYearId={selectedYear.id}
              />
            ))}
          </div>
        </div>
      </div>
    );
  else return null;
};
