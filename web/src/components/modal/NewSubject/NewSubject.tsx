import React from "react";
import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "../../../app/hooks";
import { setSubjectPayloadToDefault } from "../../../shared/NewSubject.slice";
import { Button } from "../../button";
import { NewSubjectForm } from "../../forms";
import BaseModal from "../BaseModal";

import css from "./NewSubject.module.css";

type controller = "button" | "link" | "plus";
interface Props {
  controller: controller;
  parentClass?: string;
}

export const NewSubject: React.FC<Props> = ({ controller, parentClass }) => {
  const [show, setShow] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  return (
    <React.Fragment>
      {controller === "button" && (
        <Button as="primary" text="New Subject" onClick={() => setShow(true)} />
      )}
      {controller === "link" && (
        <span onClick={() => setShow(true)} className={css.link}>
          add a subject
        </span>
      )}
      {controller === "plus" && (
        <button
          type="button"
          onClick={() => setShow(true)}
          className={css.plus}
        >
          <FaPlus />
        </button>
      )}
      <BaseModal
        parent={
          document.querySelector(
            parentClass ? `.${parentClass}` : ".App"
          ) as Element
        }
        show={show}
      >
        <BaseModal.Header>
          <BaseModal.Title>New Subject</BaseModal.Title>
        </BaseModal.Header>
        <BaseModal.Body>
          <NewSubjectForm setShow={setShow} />
          <div className={css.footer}>
            <Button
              onClick={() => {
                dispatch(setSubjectPayloadToDefault());
                setShow(false);
              }}
              as="neutral"
              text="Cancel"
            />
          </div>
        </BaseModal.Body>
      </BaseModal>
    </React.Fragment>
  );
};
