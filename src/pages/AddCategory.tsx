import { Button, Col, Input, message, Row, Select, Typography } from "antd";
import Page from "components/Layout/Page";
import PageTitle from "components/Layout/PageTitle";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "utils/client";
import { CategorySchema } from "../schemas/category";

export default function AddCategory() {
  const classes = useStyle();
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [initialValues] = useState({
    category_name: "",
    group: undefined,
  });

  const handleSubmit = async (
    values: typeof initialValues,
    {}: FormikHelpers<typeof initialValues>
  ) => {
    let { data, error } = await supabase.from("categories").insert(values);

    if (data?.length) {
      message.success("Category added successfully!");
      navigate(`/categories/${data[0].id}`, { replace: true });
      return;
    }

    message.error("Something went wrong!");
    console.log(error);
  };

  return (
    <Page>
      <PageTitle showBackBtn text="Edit Category" />

      <Formik
        initialValues={initialValues}
        validationSchema={CategorySchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Row gutter={[20, 20]}>
              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Category Name</Typography.Text>
                <Field as={Input} size="large" name="category_name" />
                <ErrorMessage
                  name="category_name"
                  component={Typography.Text}
                  className={classes.customError}
                />
              </Col>

              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Group</Typography.Text>

                <Field
                  as={Select}
                  name="group"
                  size="large"
                  onChange={(value: any) => setFieldValue("group", value)}
                >
                  <Select.Option value="DRINKS">Drinks</Select.Option>
                  <Select.Option value="FOOD">Asia</Select.Option>
                  <Select.Option value="OTHER">Sushi</Select.Option>
                </Field>
                <ErrorMessage
                  name="group"
                  component={Typography.Text}
                  className={classes.customError}
                />
              </Col>

              <Col span={24} className={classes.buttonWrapper}>
                <Button
                  block
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Add
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
  inputWrapper: {
    "& *": {
      color: colors.light500,
    },
    "& > .ant-typography": {
      paddingBottom: 5,
      display: "block",
      color: colors.light500,
    },
    "& .ant-input, & .ant-select-selector, & .ant-select": {
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
