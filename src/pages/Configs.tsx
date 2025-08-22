import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EditTwoTone,
} from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Input, message, Row } from "antd";
import Page from "components/Layout/Page";
import PageTitle from "components/Layout/PageTitle";
import Loader from "components/Others/Loader";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import supabase from "utils/client";
import moment from "moment-timezone";

const { RangePicker } = DatePicker;

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const isEqual = (arr1: any[], arr2: any[]) => {
  // If length is not equal
  if (arr1?.length != arr2?.length) return false;
  else {
    // Comparing each element of array
    for (var i = 0; i < arr1?.length; i++) if (arr1[i] != arr2[i]) return false;
    return true;
  }
};

export default function Configs() {
  const classes = useStyle();
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<any[]>([]);

  const fetchConfigs = async () => {
    let res = await supabase.from("configs").select().order("priority");

    if (!!res.data) {
      setConfigs(res.data);
      setLoading(false);
      return;
    }

    console.log(res.error);
    message.error("Something went wrong!");
  };

  useEffect(() => {
    if (loading) {
      fetchConfigs();
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Page className={classes.configsPage}>
      <PageTitle showBackBtn text="Configs" />

      {configs.map((config) => (
        <ConfigCard config={config} onChange={fetchConfigs} />
      ))}
    </Page>
  );
}

const ConfigCard = ({ config, onChange }: any) => {
  const classes = useStyle();
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [value, setValue] = useState(config.content);
  const [data, setData] = useState(config.data);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e: any) => {
    let val: string = e.target.value;

    setIsChanged(val.localeCompare(config.content) != 0);
    setValue(val);
  };

  const handleSave = async () => {
    let res = await supabase
      .from("configs")
      .update({
        content: value,
        data: data,
      })
      .match({ name: config.name });

    if (!!res.data) {
      onChange();
      setIsChanged(false);
      setIsEditing(false);
      return message.success("Config updated successfully!");
    }

    console.log(res.error);
    message.error("Something went wrong!");
  };

  const handleDayClick = (day: string) => () => {
    if (data.days?.includes(day)) {
      setData({ days: data.days.filter((d: string) => d !== day) });
    } else {
      console.log(day, data.days);
      setData({ days: [...data.days, day] });
    }
  };

  const handleTimeChange = (val: any) => {
    setData({
      startTime: val[0].format(),
      endTime: val[1].format(),
    });
  };

  useEffect(() => {
    if (config.name === "Lunch Days") {
      setIsChanged(!isEqual(data?.days, config?.data?.days));
    } else if (config.name === "Lunch Time") {
      setIsChanged(
        data.startTime !== config.data.startTime ||
          data.endTime !== config.data.endTime
      );
    }
  }, [data]);

  if (config.name === "Lunch Days") {
    return (
      <Card className={classes.configCard}>
        <Card.Meta
          title={
            <div className={classes.cardHeader}>
              <div>{config.name}</div>
              {isChanged && (
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={handleSave}
                />
              )}
            </div>
          }
        />
        <Row gutter={[10, 10]} style={{ marginTop: 15 }}>
          {weekDays.map((day) => (
            <Col span={3}>
              <Button
                block
                onClick={handleDayClick(day)}
                type={data.days?.includes(day) ? "primary" : "ghost"}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {day.substring(0, 3)}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>
    );
  }

  if (config.name === "Lunch Time") {
    console.log(data);
    return (
      <Card className={classes.configCard}>
        <Card.Meta
          title={
            <div className={classes.cardHeader}>
              <div>{config.name}</div>
              {isChanged && (
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={handleSave}
                />
              )}
            </div>
          }
        />
        <div className={classes.timePicker}>
          <RangePicker
            value={[
              moment(data.startTime).tz("Europe/Berlin"),
              moment(data.endTime).tz("Europe/Berlin"),
            ]}
            format={"HH:mm"}
            onChange={handleTimeChange}
            picker="time"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className={classes.configCard}>
      <Card.Meta
        title={
          <div className={classes.cardHeader}>
            <div>{config.name}</div>
            {isEditing ? (
              isChanged ? (
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={handleSave}
                />
              ) : (
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={handleEditToggle}
                />
              )
            ) : (
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={handleEditToggle}
              />
            )}
          </div>
        }
        description={
          <div>
            {isEditing ? (
              <Input.TextArea rows={3} value={value} onChange={handleChange} />
            ) : (
              <div>{config.content}</div>
            )}
          </div>
        }
      />
    </Card>
  );
};

const useStyle = createUseStyles(({ colors }: Theme) => ({
  "@global": {
    ".ant-picker, .ant-picker-range-arrow::before, .ant-picker-panel-container, .ant-picker-ok > button":
      {
        background: "#202020 !important",
        color: "#fff !important",
      },
    ".ant-picker-time-panel-column > li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner":
      {
        background: "#303030 !important",
      },
  },
  configsPage: {},
  configCard: {
    marginTop: 15,
    paddingBottom: 10,
    backgroundColor: "#202020",
    border: "none",
    "& .ant-card-meta-title": {
      color: colors.light100,
    },
    "& .ant-card-meta-description": {
      fontSize: 16,
    },
    "& .ant-card-meta, & .ant-card-meta-detail": {
      width: "100%",
    },
    "& .ant-input , & .ant-select-selector , & .ant-select": {
      width: "100%",
      backgroundColor: "#111 !important",
      border: "none !important",
    },
  },
  cardHeader: {
    width: "100%",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timePicker: {
    marginTop: 15,
    "& .anticon": {
      color: "#fff !important",
    },
    "& .ant-picker-clear": {
      background: "#101010 !important",
    },
  },
}));
