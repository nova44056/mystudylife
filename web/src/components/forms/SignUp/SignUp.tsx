import React from "react";
import { ApolloError } from "@apollo/client";
import { Formik, FormikProps, Form } from "formik";
import * as Yup from "yup";

import { Button, LoaderButton } from "../../button";
import { FormikTextInput } from "../../input";

import { useRegisterMutation } from "../../../generated/graphql";
import { useHistory } from "react-router";

export const SignUpForm: React.FC<{}> = () => {
  const [error, setError] = React.useState<string>("");
  const [register] = useRegisterMutation();
  const history = useHistory();
  React.useEffect(() => {
    if (error) {
      // empty error message
      const ERROR_TIMEOUT = 3 * 1000; // 3 seconds
      setTimeout(() => {
        setError("");
      }, ERROR_TIMEOUT);
    }
  }, [error]);

  return (
    <div>
      {error && <span className="error">{error}</span>}
      <Formik
        initialValues={initialValues}
        validationSchema={FormValuesValidationSchema}
        onSubmit={async (values: FormValues, { setSubmitting }) => {
          try {
            console.log("signing up...");
            await register({
              variables: {
                registerEmail: values.email,
                registerPassword: values.password,
                registerUsername: values.username,
              },
            });
            setSubmitting(false);
            history.push("/");
          } catch (error) {
            const e = error as ApolloError;
            if (e.message.includes("username"))
              setError("Username already exist");
            else if (e.message.includes("email"))
              setError("Email already exist");
          }
        }}
      >
        {InnerForm}
      </Formik>
    </div>
  );
};

const FormValuesValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const InnerForm: React.FC<FormikProps<FormValues>> = (props) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form>
      <div>
        <FormikTextInput
          autoComplete="no"
          style={{ color: "black" }}
          name="username"
          label="Username"
          error={
            touched.username &&
            errors.username && <span className="error">{errors.username}</span>
          }
        />
      </div>
      <div>
        <FormikTextInput
          style={{ color: "black" }}
          name="email"
          label="Email"
          error={
            touched.email &&
            errors.email && <span className="error">{errors.email}</span>
          }
        />
      </div>
      <div>
        <FormikTextInput
          style={{ color: "black" }}
          name="password"
          label="Password"
          type="password"
          error={
            touched.password &&
            errors.password && <span className="error">{errors.password}</span>
          }
        />
      </div>
      <div>
        <FormikTextInput
          style={{ color: "black" }}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          error={
            touched.confirmPassword &&
            errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )
          }
        />
      </div>
      <div className="txt-sm">
        <span>by creating an account you agree to our </span>
        <a className="txt-primary" href="/">
          privacy policy
        </a>
        <span> and </span>
        <a className="txt-primary" href="/">
          terms of service
        </a>
      </div>
      <LoaderButton
        loading={isSubmitting}
        type="submit"
        as="primary"
        text="Confirm"
      />
    </Form>
  );
};

const initialValues: FormValues = {
  email: "",
  password: "",
  username: "",
  confirmPassword: "",
};

/**
 * interfaces
 */
interface FormValues {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}
