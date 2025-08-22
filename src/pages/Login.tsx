import { Button, Col, Input, message, Row, Typography } from "antd";
import Page from "components/Layout/Page";
import PageTitle from "components/Layout/PageTitle";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router-dom";
import { SignInSchema } from "schemas/user";
import supabase from "utils/client";

export default function Login() {
  const classes = useStyle();
  const navigate = useNavigate();
  const [initialValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    const { user, error } = await supabase.auth.signIn(values);

    if (!!user?.id) {
      resetForm();
      message.success("Authentication successful!");
      navigate("/", { replace: true });
    } else {
      console.log(error);
    }
  };

  return (
    <Page className={classes.loginPage}>
      <PageTitle center text="Login" />

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={SignInSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Row gutter={[15, 15]}>
              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Email</Typography.Text>
                <Field as={Input} size="large" name="email" />
                <ErrorMessage
                  name="email"
                  component={Typography.Text}
                  className={classes.customError}
                />
              </Col>
              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Password</Typography.Text>
                <Field as={Input.Password} size="large" name="password" />
                <ErrorMessage
                  name="password"
                  component={Typography.Text}
                  className={classes.customError}
                />
              </Col>

              <Col span={24} className={classes.buttonWrapper}>
                <Button
                  block
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Sign In
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Page>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  loginPage: {
    height: "100vh",
    paddingBottom: 80 + "px !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  inputWrapper: {
    "& *": {
      color: colors.light500,
    },
    "& > .ant-typography": {
      paddingBottom: 5,
      display: "block",
      color: colors.light500,
    },
    "& .ant-input , & .ant-input-affix-wrapper , & .ant-select": {
      width: "100%",
      backgroundColor: "#202020 !important",
      border: "none !important",
    },
  },
  buttonWrapper: {
    marginTop: 20,
    "& .ant-btn": {
      color: colors.dark1000,
    },
  },
  customError: {
    display: "block",
    color: "#ef5450",
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 12,
  },
}));
