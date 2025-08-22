import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Switch,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import FormItemLabel from "antd/lib/form/FormItemLabel";
import UploadInput from "components/Data/UploadInput";
import Page from "components/Layout/Page";
import PageTitle from "components/Layout/PageTitle";
import Loader from "components/Others/Loader";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useNavigate, useParams } from "react-router-dom";
import { DishSchema } from "schemas/dish";
import supabase from "utils/client";

const SUPABASE_IMAGE_PREFIX =
  "https://ealmujmxbmhjvahkdbyo.supabase.co/storage/v1/object/public/menu";

export default function EditDish() {
  const classes = useStyle();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [labelIcons, setLabelIcons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState<any>(null);

  const [initialValues, setInitialValues] = useState({
    dish_name: "",
    price: "",
    lunch_price: "",
    label: "",
    beliebt: false,
    deactivate: false,
    lunch_category: false,
    icons: [],
    image: "",
    category: "",
    description: "",
  });

  const uploadNewProductImage = async () => {
    message.loading("Uploading image...");
    if (initialValues.image?.startsWith("/images/")) {
      let removeImageRes = await supabase.storage
        .from("menu")
        .remove([initialValues.image.substring(1)]);
      console.log(removeImageRes);
    }

    let timestamp = Date.now() ?? +new Date();
    let ext = newImage.name.split(".").reverse()[0];

    let url = `/images/${timestamp}.${ext}`;

    const upload = await supabase.storage.from("menu").upload(url, newImage);

    if (!!upload.data) {
      console.log(upload.data?.Key);
      message.success("Image uploaded successfully!");
      setInitialValues((curr) => ({ ...curr, image: url }));
      return url;
    }

    console.log(upload.error);
    return initialValues.image;
  };

  const handleSubmit = async (
    values: typeof initialValues,
    {}: FormikHelpers<typeof initialValues>
  ) => {
    if (newImage) {
      values.image = await uploadNewProductImage();
    }

    let { data, error } = await supabase.from("dishes").upsert(values);

    if (data?.length) {
      navigate(`/dishes/${data[0].id}`, { replace: true });
      message.success("Dish added successfully!");
      return;
    }

    message.error("Something went wrong!");
    console.log(error);
  };

  const handleUploadChange = async (fileList: any[]) => {
    let fileArray = fileList.map((item) => item.originFileObj);
    setNewImage(fileArray.reverse()[0]);
  };

  const fetchInitialData = async () => {
    let categoriesRes = await supabase.from("categories").select();
    let labelIconsRes = await supabase.from("label_icons").select();

    if (categoriesRes.data?.length) setCategories(categoriesRes.data);
    if (labelIconsRes.data?.length) setLabelIcons(labelIconsRes.data);

    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      fetchInitialData();
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Page>
      <PageTitle showBackBtn text="Add Dish" />

      <Formik
        initialValues={initialValues}
        validationSchema={DishSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Row gutter={[20, 20]}>
              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Dish Image</Typography.Text>
                <UploadInput
                  defaultImagePath={values.image}
                  onChange={handleUploadChange}
                />
              </Col>

              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Dish Name</Typography.Text>
                <Field as={Input} size="large" name="dish_name" />
                <ErrorMessage
                  name="dish_name"
                  component={Typography.Text}
                  className={classes.customError}
                />
              </Col>

              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>
                  Price{" "}
                  <i style={{ opacity: 0.6 }}>*separate multiple with (,)</i>
                </Typography.Text>
                <Field as={Input} size="large" name="price" />
                <ErrorMessage
                  name="price"
                  component={Typography.Text}
                  className={classes.customError}
                />
              </Col>

              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>
                  Lunch Price{" "}
                  <i style={{ opacity: 0.6 }}>*separate multiple with (,)</i>
                </Typography.Text>
                <Field as={Input} size="large" name="lunch_price" />
                <ErrorMessage
                  name="lunch_price"
                  component={Typography.Text}
                  className={classes.customError}
                />
              </Col>

              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Label</Typography.Text>
                <Field as={Input} size="large" name="label" />
              </Col>

              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Category</Typography.Text>

                <Field
                  as={Select}
                  name="category"
                  size="large"
                  onChange={(value: any) => setFieldValue("category", value)}
                >
                  {categories.map((category, index) => (
                    <Select.Option key={index} value={category.category_name}>
                      {category.category_name}
                    </Select.Option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category"
                  component={Typography.Text}
                  className={classes.customError}
                />
              </Col>

              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Icons</Typography.Text>

                <Field
                  as={Select}
                  mode="multiple"
                  name="icons"
                  size="large"
                  onChange={(value: any) => setFieldValue("icons", value)}
                >
                  {labelIcons.map((label, index) => (
                    <Select.Option key={index} value={label.image_url}>
                      <img
                        alt={label.key}
                        src={SUPABASE_IMAGE_PREFIX + label.image_url}
                        className={classes.labelIcon}
                      />
                    </Select.Option>
                  ))}
                </Field>
              </Col>

              <Col span={24} className={classes.inputWrapper}>
                <Typography.Text>Description</Typography.Text>
                <Field
                  as={Input.TextArea}
                  size="large"
                  name="description"
                  autoSize={{ minRows: 5, maxRows: 7 }}
                />
              </Col>

              <Col span={12} className={classes.inputWrapper}>
                <Typography.Text>Popular (BELIEBT)</Typography.Text>
                <Switch
                  checked={values.beliebt}
                  onChange={(val: boolean) => setFieldValue("beliebt", val)}
                />
              </Col>

              <Col span={12} className={classes.inputWrapper}>
                <Typography.Text>Lunch Category</Typography.Text>
                <Switch
                  checked={values.lunch_category}
                  onChange={(val: boolean) =>
                    setFieldValue("lunch_category", val)
                  }
                />
              </Col>

              <Col span={12} className={classes.inputWrapper}>
                <Typography.Text>Deactivate</Typography.Text>
                <Switch
                  checked={values.deactivate}
                  onChange={(val: boolean) => setFieldValue("deactivate", val)}
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
    "& .ant-input , & .ant-select-selector , & .ant-select": {
      width: "100%",
      backgroundColor: "#202020 !important",
      border: "none !important",
    },

    "& .ant-select-multiple .ant-select-selection-item": {
      backgroundColor: "#202020 !important",
      border: "none !important",
      "& .ant-select-selection-item-content": {
        display: "flex",
        alignItems: "center",
      },
    },
  },
  buttonWrapper: {
    marginTop: 20,
    "& .ant-btn": {
      color: colors.dark1000,
    },
  },
  labelIcon: {
    maxHeight: 20,
    width: 30,
    objectFit: "contain",
  },
  customError: {
    display: "block",
    color: "#ef5450",
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 12,
  },
}));
