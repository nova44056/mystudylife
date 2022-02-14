import React from "react";
import { GetClassesQuery, GetTasksQuery } from "../../../generated/graphql";
import { Button } from "../../button";
import BaseModal from "../BaseModal";
import { HiLocationMarker } from "react-icons/hi";
import { GiTeacher } from "react-icons/gi";
import css from "./ViewTask.module.css";
import moment from "moment";
import ctx from "classnames";
import { AiFillClockCircle, AiOutlineClose } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { BsCalendar, BsPersonFill } from "react-icons/bs";
import { formatDate, formatTime } from "../../../utils";
import { DeleteClass, EditClass } from "..";
import { Slider } from "../../input/Slider";
import { DeleteTask } from "../DeleteTask";
import { GrInProgress } from "react-icons/gr";

interface Props {
  childController?: React.ReactNode;
  data?: GetTasksQuery["getTasks"][0];
}

export const ViewTask: React.FC<Props> = ({ childController, data }) => {
  const [show, setShow] = React.useState(false);

  if (data)
    return (
      <React.Fragment>
        {childController ? (
          <div data-type="modal" onClick={() => setShow(true)}>
            {childController}
          </div>
        ) : (
          <Button
            as="neutral"
            text={`View Task`}
            onClick={() => setShow(true)}
          />
        )}

        <BaseModal
          hide={() => setShow(false)}
          className="viewTask"
          parent={document.querySelector(".App") as Element}
          show={show}
        >
          <BaseModal.Header>
            <BaseModal.Title
              style={{
                fontSize: "20px",
                maxWidth: "300px",
              }}
            >
              <div>{`${data.title}`}</div>
              <div className="txt-sm">{`${data.subject.name}`}</div>
            </BaseModal.Title>
            <DeleteTask
              taskId={data!.id}
              closeParent={() => setShow(false)}
              parentClassName={"viewTask"}
            />

            {/* <DeleteClass
              classId={data!.id}
              closeParent={() => setShow(false)}
              parentClassName={"viewClass"}
            />
            <EditClass c={data} />
            <div
              onClick={() => {
                setShow(false);
              }}
              className="close"
              style={{ top: "1.5rem" }}
            >
              <AiOutlineClose />
            </div> */}
          </BaseModal.Header>
          <BaseModal.Body style={{ padding: "1.5rem" }}>
            <div className={css.section}>
              <div className={css.icon}>
                <BsCalendar />
              </div>
              <div className={css.info}>
                <div>Due {formatDate(new Date(data.due_date))}</div>
                {new Date(data.due_date) < new Date() && (
                  <div className="txt-sm">
                    <span
                      style={{ color: "var(--error)" }}
                      className="txt-bold"
                    >
                      Overdue by{" "}
                      {Math.ceil(
                        Math.abs(+new Date() - +new Date(data.due_date)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={css.section}>
              <div className={css.icon}>
                <GrInProgress />
              </div>
              <div className={css.info}>
                <Slider min={0} max={100} />
              </div>
            </div>
          </BaseModal.Body>
        </BaseModal>
      </React.Fragment>
    );
  else return null;
};
