import React from "react";
import { AiFillDelete } from "react-icons/ai";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
} from "../../../generated/graphql";
import { Button, LoaderButton } from "../../button";
import BaseModal from "../BaseModal";
import css from "./DeleteTask.module.css";

interface Props {
  taskId: string;
  parentClassName: string;
  closeParent: () => void;
}

export const DeleteTask: React.FC<Props> = ({
  parentClassName,
  closeParent,
  taskId,
}) => {
  const [show, setShow] = React.useState(false);
  const [deleteTask, { loading }] = useDeleteTaskMutation();
  const { refetch } = useGetTasksQuery();

  return (
    <React.Fragment>
      <div
        style={{ top: "1.5rem" }}
        className="delete"
        onClick={() => setShow(true)}
      >
        <AiFillDelete />
      </div>
      {document.querySelector(`.${parentClassName}`) && (
        <BaseModal
          show={show}
          parent={document.querySelector(`.${parentClassName}`) as Element}
        >
          <div className={css.wrapper}>
            <div>Are you sure?</div>
            <div>You are about to delete all occurrences for this class.</div>
            <div>
              <LoaderButton
                onClick={async () => {
                  await deleteTask({
                    variables: {
                      id: taskId,
                    },
                  })
                    .then(async () => {
                      await refetch();
                      setShow(false);
                      closeParent();
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
                style={{ padding: "1rem 2rem" }}
                loading={loading}
                as="primary"
                text="Yes"
              />
              <Button as="secondary" text="No" onClick={() => setShow(false)} />
            </div>
          </div>
        </BaseModal>
      )}
    </React.Fragment>
  );
};
