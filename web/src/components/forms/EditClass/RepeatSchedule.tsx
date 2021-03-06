import moment from "moment";
import React from "react";
import { useAppSelector } from "../../../app/hooks";
import {
  selectNewRepeatSchedules,
  selectToBeUpdatedRepeatSchedules,
} from "../../../shared/EditClass.slice";
import { RepeatSchedulePayload } from "../../../shared/NewClass.slice";
import { EditRepeatSchedule, NewRepeatSchedule } from "../../modal";
import { EditNewRepeatSchedule } from "../../modal/EditClass/EditNewRepeatSchedule";
import css from "./RepeatSchedule.module.css";

interface Props {}

export const RepeatSchedule: React.FC<Props> = () => {
  const toBeUpdatedRepeatSchedules = useAppSelector(
    selectToBeUpdatedRepeatSchedules
  );
  const newRepeatSchedules = useAppSelector(selectNewRepeatSchedules);
  const dayOfWeekOptions = React.useMemo(
    () => [
      { key: "Sun", value: "sunday" },
      { key: "Mon", value: "monday" },
      { key: "Tue", value: "tuesday" },
      { key: "Wed", value: "wednesday" },
      { key: "Thu", value: "thursday" },
      { key: "Fri", value: "friday" },
      { key: "Sat", value: "saturday" },
    ],
    []
  );

  if (toBeUpdatedRepeatSchedules && newRepeatSchedules)
    return (
      <div>
        {toBeUpdatedRepeatSchedules.map((repeatSchedule) => (
          <EditRepeatSchedule
            data={repeatSchedule}
            childController={
              <div className={css.option}>
                <div>
                  <div>
                    {moment(repeatSchedule.startTime, "HH:mm").format(
                      "hh:mm a"
                    )}{" "}
                    {" - "}
                    {moment(repeatSchedule.endTime, "HH:mm").format("hh:mm a")}
                  </div>
                  <div
                    className="txt-sm txt-thin"
                    style={{ textTransform: "capitalize" }}
                  >
                    {repeatSchedule.days
                      .map(
                        (day) =>
                          dayOfWeekOptions.filter((d) => d.value === day)[0]
                            .value
                      )
                      .join(",")}
                  </div>
                </div>
                <div></div>
              </div>
            }
          />
        ))}

        {newRepeatSchedules.map((repeatSchedule) => (
          <EditNewRepeatSchedule
            data={repeatSchedule}
            childController={
              <div className={css.option}>
                <div>
                  <div>
                    {moment(repeatSchedule.startTime, "HH:mm").format(
                      "hh:mm a"
                    )}{" "}
                    {" - "}
                    {moment(repeatSchedule.endTime, "HH:mm").format("hh:mm a")}
                  </div>
                  <div
                    className="txt-sm txt-thin"
                    style={{ textTransform: "capitalize" }}
                  >
                    {repeatSchedule.days
                      .map(
                        (day) =>
                          dayOfWeekOptions.filter((d) => d.value === day)[0]
                            .value
                      )
                      .join(",")}
                  </div>
                </div>
                <div></div>
              </div>
            }
          />
        ))}
        <NewRepeatSchedule />
      </div>
    );
  else return null;
};
