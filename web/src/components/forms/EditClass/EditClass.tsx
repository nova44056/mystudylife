import React from "react";
import { withFormik, FormikProps, Form } from "formik";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { TermPayload } from "../../../shared/NewAcademicYear.slice";

import { Pair } from "../../../types";
import { Button, LoaderButton } from "../../button";
import { FormikBasicTextInput, SelectInput } from "../../input";

import css from "./EditClass.module.css";
import {
  ClassPayload,
  ClassSchedulePayload,
  OneOffSchedulePayload,
  RepeatSchedulePayload,
  selectClassPayload,
  selectClassSchedulePayload,
  selectOneOffSchedulePayload,
  selectRepeatSchedules,
  setClassPayload,
  setClassSchedulePayload,
} from "../../../shared/NewClass.slice";
import {
  Exact,
  GetClassesQuery,
  NewClassMutationFn,
  NewClassScheduleMutationFn,
  NewOneOffScheduleMutationFn,
  NewRepeatScheduleMutationFn,
  useGetAcademicYearsQuery,
  useGetClassesQuery,
  useGetSubjectsQuery,
  useNewClassMutation,
  useNewClassScheduleMutation,
  useNewOneOffScheduleMutation,
  useNewRepeatScheduleMutation,
  useUpdateClassMutation,
  useUpdateOneOffScheduleMutation,
  UpdateClassMutationFn,
  UpdateOneOffScheduleMutationFn,
  useUpdateRepeatScheduleMutation,
  UpdateRepeatScheduleMutationFn,
} from "../../../generated/graphql";
import { FormikBasicSelectInput } from "../../input/BasicSelectInput";
import { NewClass, NewSubject } from "../../modal";
import { asyncForEach } from "../../../utils";
import { ApolloQueryResult } from "@apollo/client";
import {
  selectNewRepeatSchedules,
  selectToBeUpdatedClassPayload,
  selectToBeUpdatedClassSchedulePayload,
  selectToBeUpdatedOneOffSchedulePayload,
  selectToBeUpdatedRepeatSchedules,
  setDefaultToBeUpdatedClassPayload,
  setToBeUpdatedClassPayload,
} from "../../../shared/EditClass.slice";
import { OneOffSchedule } from "./OneOffSchedule";
import { RepeatSchedule } from "./RepeatSchedule";

const InnerForm = (props: FormikProps<TermPayload> & DispatchMap) => {
  const { touched, errors, setToBeUpdatedClassPayload, isSubmitting } = props;
  const { data: subjects } = useGetSubjectsQuery();
  const toBeUpdatedClassPayload = useAppSelector(selectToBeUpdatedClassPayload);
  const toBeUpdatedClassSchedulePayload = useAppSelector(
    selectToBeUpdatedClassSchedulePayload
  );
  const [defaultClassPayload, setDefaultClassPayload] = React.useState<
    ClassPayload & { id: string }
  >();
  const dispatch = useAppDispatch();

  React.useLayoutEffect(() => {
    if (touched.name && errors.name) {
      document.querySelector(`.${css.name}`)?.classList.add(css.error);
    } else {
      document.querySelector(`.${css.name}`)?.classList.remove(css.error);
    }
  }, [touched.name, errors.name]);

  // create new template for default value constant so that when the toBeUpdatedClassPayload changes the default vlaue stays the same
  React.useEffect(() => {
    if (!defaultClassPayload && toBeUpdatedClassPayload)
      setDefaultClassPayload(toBeUpdatedClassPayload);
  }, [toBeUpdatedClassPayload]);
  React.useEffect(() => {
    return () => {
      if (defaultClassPayload)
        dispatch(setDefaultToBeUpdatedClassPayload(defaultClassPayload));
    };
  }, [defaultClassPayload]);

  if (subjects && toBeUpdatedClassPayload && defaultClassPayload)
    return (
      <Form className={css.form}>
        <div className={css.field}>
          <div className={css.group}>
            <div className={css.row}>
              <div
                style={{
                  gridTemplateColumns: "1fr min-content",
                  columnGap: 0,
                }}
                className={css.row}
              >
                <FormikBasicSelectInput
                  label="Subject"
                  name={"Subject"}
                  defaultValue={toBeUpdatedClassPayload.subjectId}
                  options={subjects?.getSubjects
                    .filter(
                      (subject) =>
                        !subject.academicYear ||
                        subject.academicYear.id ===
                          toBeUpdatedClassPayload.academicYearId
                    )
                    .map((subject) => {
                      return {
                        key: subject.id,
                        value: subject.id,
                        label: subject.name,
                      };
                    })}
                  onChange={(e) => {
                    setToBeUpdatedClassPayload({
                      key: "subjectId",
                      value: e.target.value,
                    });
                  }}
                />
                <NewSubject controller="plus" />
              </div>
              <FormikBasicTextInput
                className={css.name}
                name="module"
                // validate={validateName}
                value={toBeUpdatedClassPayload.module}
                onChange={(e) => {
                  setToBeUpdatedClassPayload({
                    key: "module",
                    value: e.target.value,
                  });
                }}
                label="Module"
              />
              {/* {touched.name && errors.name && (
              <div className="error">{errors.name}</div>
            )} */}
            </div>
            <div className={css.row}>
              <FormikBasicTextInput
                className={css.name}
                name="room"
                // validate={validateName}
                value={toBeUpdatedClassPayload.room}
                onChange={(e) => {
                  setToBeUpdatedClassPayload({
                    key: "room",
                    value: e.target.value,
                  });
                }}
                label="Room"
              />
              <FormikBasicTextInput
                className={css.name}
                name="building"
                // validate={validateName}
                value={toBeUpdatedClassPayload.building}
                onChange={(e) => {
                  setToBeUpdatedClassPayload({
                    key: "building",
                    value: e.target.value,
                  });
                }}
                label="Building"
              />
            </div>
            <div className={css.row}>
              <FormikBasicTextInput
                className={css.name}
                name="teacher"
                // validate={validateName}
                value={toBeUpdatedClassPayload.teacher}
                onChange={(e) => {
                  setToBeUpdatedClassPayload({
                    key: "teacher",
                    value: e.target.value,
                  });
                }}
                label="Teacher"
              />
            </div>
            <div
              style={{
                marginTop: "2rem",
              }}
            >
              {toBeUpdatedClassSchedulePayload?.type === "oneOff" && (
                <OneOffSchedule />
              )}
              {toBeUpdatedClassSchedulePayload?.type === "repeat" && (
                <RepeatSchedule />
              )}
            </div>
          </div>
        </div>

        <div className={css.btns}>
          <LoaderButton
            style={{
              padding: "1rem 2rem",
            }}
            loading={isSubmitting}
            type="submit"
            text="Update"
            as="primary"
          />
        </div>
      </Form>
    );
  else return null;
};

// The type of props MyForm receives

// Wrap our form with the withFormik HoC
const MyForm = withFormik<any, ClassPayload>({
  handleSubmit: (values, { props }) => {
    const toBeUpdatedClassPayload =
      props.toBeUpdatedClassPayload as ClassPayload & { id: string };
    const toBeUpdatedClassSchedulePayload =
      props.toBeUpdatedClassSchedulePayload as ClassSchedulePayload & {
        id: string;
      };
    const toBeUpdatedOneOffSchedulePayload =
      props.toBeUpdatedOneOffSchedulePayload as OneOffSchedulePayload & {
        id: string;
      };
    const toBeUpdatedRepeatSchedules =
      props.toBeUpdatedRepeatSchedules as (RepeatSchedulePayload & {
        id: string;
      })[];
    const newRepeatSchedules =
      props.newRepeatSchedules as RepeatSchedulePayload[];

    const updateClass = props.updateClass as UpdateClassMutationFn;
    const updateOneOffSchedule =
      props.updateOneOffSchedule as UpdateOneOffScheduleMutationFn;
    const updateRepeatSchedule =
      props.updateRepeatSchedule as UpdateRepeatScheduleMutationFn;
    const newRepeatSchedule =
      props.newRepeatSchedule as NewRepeatScheduleMutationFn;

    const setShow = props.setShow;
    const refetchClasses = props.refetch as (
      variables?:
        | Partial<
            Exact<{
              [key: string]: never;
            }>
          >
        | undefined
    ) => Promise<ApolloQueryResult<GetClassesQuery>>;

    updateClass({
      variables: {
        id: toBeUpdatedClassPayload.id,
        subjectId: toBeUpdatedClassPayload.subjectId as string,
        academicYearId: toBeUpdatedClassPayload.academicYearId as string,
        building: toBeUpdatedClassPayload.building,
        module: toBeUpdatedClassPayload.module,
        room: toBeUpdatedClassPayload.room,
        teacher: toBeUpdatedClassPayload.teacher,
      },
    })
      .then(async (response) => {
        if (toBeUpdatedClassSchedulePayload.type === "oneOff") {
          await updateOneOffSchedule({
            variables: {
              id: toBeUpdatedOneOffSchedulePayload.id,
              date: toBeUpdatedOneOffSchedulePayload.date,
              endTime: toBeUpdatedOneOffSchedulePayload.endTime,
              startTime: toBeUpdatedOneOffSchedulePayload.startTime,
              scheduleId: toBeUpdatedClassSchedulePayload.id,
            },
          });
        } else if (toBeUpdatedClassSchedulePayload.type === "repeat") {
          await asyncForEach(
            toBeUpdatedRepeatSchedules,
            async (toBeUpdatedRepeatSchedulePayload) => {
              await updateRepeatSchedule({
                variables: {
                  id: toBeUpdatedRepeatSchedulePayload.id,
                  startTime: toBeUpdatedRepeatSchedulePayload.startTime,
                  endTime: toBeUpdatedRepeatSchedulePayload.endTime,
                  scheduleId: toBeUpdatedClassSchedulePayload.id,
                  repeatDays: toBeUpdatedRepeatSchedulePayload.days,
                },
              });
            }
          );
          if (newRepeatSchedules.length > 0) {
            await asyncForEach(newRepeatSchedules, async (repeatSchedule) => {
              await newRepeatSchedule({
                variables: {
                  scheduleId: toBeUpdatedClassSchedulePayload.id,
                  startTime: repeatSchedule.startTime,
                  endTime: repeatSchedule.endTime,
                  repeatDays: repeatSchedule.days,
                },
              });
            });
          }
        }
        await refetchClasses();
        setShow(false);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    return {
      academicYearId: props.academicYearId,
      building: props.building,
      module: props.module,
      name: props.name,
      room: props.room,
      subjectId: props.subjectId,
      teacher: props.teacher,
    };
  },
})(InnerForm);

const mapStateToProps = (state: RootState) => {
  return state.editclass.toBeUpdatedClassPayload;
};

interface DispatchMap {
  setToBeUpdatedClassPayload: (params: Pair<ClassPayload>) => void;
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchMap => ({
  setToBeUpdatedClassPayload: (params: Pair<ClassPayload>) => {
    dispatch(setToBeUpdatedClassPayload(params));
  },
});

const ConnectedForm = connect(mapStateToProps, mapDispatchToProps)(MyForm);

interface EditClassProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditClassForm: React.FC<EditClassProps> = ({ setShow }) => {
  const toBeUpdatedClassPayload = useAppSelector(selectToBeUpdatedClassPayload);
  const toBeUpdatedClassSchedulePayload = useAppSelector(
    selectToBeUpdatedClassSchedulePayload
  );
  const toBeUpdatedOneOffSchedulePayload = useAppSelector(
    selectToBeUpdatedOneOffSchedulePayload
  );
  const toBeUpdatedRepeatSchedules = useAppSelector(
    selectToBeUpdatedRepeatSchedules
  );
  const newRepeatSchedules = useAppSelector(selectNewRepeatSchedules);

  const [updateClass] = useUpdateClassMutation();
  const [updateOneOffSchedule] = useUpdateOneOffScheduleMutation();
  const [updateRepeatSchedule] = useUpdateRepeatScheduleMutation();
  const [newRepeatSchedule] = useNewRepeatScheduleMutation();

  const { refetch } = useGetClassesQuery();

  return (
    <ConnectedForm
      toBeUpdatedClassPayload={toBeUpdatedClassPayload}
      toBeUpdatedClassSchedulePayload={toBeUpdatedClassSchedulePayload}
      toBeUpdatedOneOffSchedulePayload={toBeUpdatedOneOffSchedulePayload}
      toBeUpdatedRepeatSchedules={toBeUpdatedRepeatSchedules}
      newRepeatSchedules={newRepeatSchedules}
      updateClass={updateClass}
      updateOneOffSchedule={updateOneOffSchedule}
      updateRepeatSchedule={updateRepeatSchedule}
      newRepeatSchedule={newRepeatSchedule}
      setShow={setShow}
      refetch={refetch}
    />
  );
};