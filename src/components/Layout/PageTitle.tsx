import { LeftOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import React from "react";
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router-dom";

export default function PageTitle({
  showBackBtn = false,
  text,
  center,
  extra,
}: any) {
  const classes = useStyle();
  const navigate = useNavigate();

  return (
    <div
      className={classes.pageTitle}
      style={{ justifyContent: !!center ? "center" : "flex-start" }}
    >
      {showBackBtn && (
        <Button
          size="small"
          type="text"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginRight: 10 }}
        />
      )}
      <Typography.Title level={4} className={classes.titleText}>
        {text}
      </Typography.Title>

      {!!extra && <div className={classes.extra}>{extra}</div>}
    </div>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  pageTitle: {
    width: "100%",
    display: "flex",
    marginBottom: 20,
    alignItems: "center",
    "& .ant-typography": {
      marginBottom: "0 !important",
    },
  },
  titleText: { paddingLeft: 0, color: colors.light300 + " !important" },
  extra: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
}));
