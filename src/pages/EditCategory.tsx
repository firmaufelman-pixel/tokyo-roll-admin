import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import Page from "components/Layout/Page";
import PageTitle from "components/Layout/PageTitle";
import Loader from "components/Others/Loader";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "utils/client";

export default function EditCategory() {
  const classes = useStyle();
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    category_name: "",
    group: undefined,
  });

  const handleSubmit = async (
    values: typeof initialValues,
    {}: FormikHelpers<typeof initialValues>
  ) => {
    let { data, error } = await supabase.from("categories").upsert(values);

    if (data?.length) {
      message.success("Category updated successfully!");
      return;
    }

    message.error("Something went wrong!");
    console.log(error);
  };

  const handleCategoryDelete = () => {
    Modal.confirm({
      title:
        "Are you sure you want to delete this category? (Associated dishes will be deleted as well)",
      okText: "Delete",
      onOk: async () => {
        await supabase.from("categories").delete().match({ id: categoryId });
        await supabase
          .from("dishes")
          .delete()
          .match({ category: initialValues.category_name });

        message.success("Category deleted successfully!");
        navigate(-1);
      },
    });
  };

  const fetchInitialData = async () => {
    let categoryRes = await supabase
      .from("categories")
      .select()
      .match({ id: categoryId });

    console.log(categoryRes.data);

    if (categoryRes.data?.length) setInitialValues(categoryRes.data[0]);

    setLoading(false);
  };

  useEffect(() => {
    if (!!categoryId) {
      fetchInitialData();
    }
  }, [categoryId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Page>
      <PageTitle showBackBtn text="Edit Category" />

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, isSubmitting, setFieldValue }) => (
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
                  Save
                </Button>
              </Col>
              <Col span={24}>
                <Button
                  block
                  danger
                  size="large"
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={handleCategoryDelete}
                >
                  Delete
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
