import {
  AppstoreAddOutlined,
  LogoutOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Typography } from "antd";
import React from "react";
import { createUseStyles } from "react-jss";
import { Link, useNavigate } from "react-router-dom";
import AppLogo from "assets/images/Logo.svg";
import Page from "components/Layout/Page";
import supabase from "utils/client";

const options = [
  { icon: <UnorderedListOutlined />, label: "Dishes", to: "/dishes" },
  { icon: <AppstoreAddOutlined />, label: "Categories", to: "categories" },
  { icon: <SettingOutlined />, label: "Configs", to: "configs" },
];

export default function HomePage() {
  const classes = useStyle();
  const navigate = useNavigate();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (!!!error) return navigate("/login");

    console.log(error);
  }

  return (
    <Page className={classes.homePage}>
      <img src={AppLogo} alt="" className={classes.logo} />
      <div>
        <Row gutter={[20, 20]} className={classes.optionsWrapper}>
          {options.map((opt, index) => (
            <Col
              key={index}
              xs={24}
              md={7}
              className={classes.optionCardWrapper}
            >
              <Link to={opt.to}>
                <Card className={classes.optionCard}>
                  {opt.icon}
                  <Typography.Text strong>{opt.label}</Typography.Text>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <Button
        type="text"
        icon={<LogoutOutlined />}
        className={classes.logoutBtn}
        onClick={signOut}
      />
    </Page>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  homePage: {
    height: "100vh",
    display: "flex",
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    width: 700,
    objectFit: "contain",
    position: "absolute",
    top: -100,
    left: "50%",
    transform: "translate(-50%)",
  },
  optionsWrapper: {
    width: "100vw",
    padding: 20,
  },
  optionCardWrapper: {
    maxWidth: 500,
    margin: "auto",
  },
  optionCard: {
    padding: [20, 0],
    color: colors.light500,
    backgroundColor: "#202020",
    border: "none",

    "& .ant-card-body": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },

    "& .anticon": {
      fontSize: 44,
      marginBottom: 15,
    },
    "& .ant-typography": {
      color: colors.light500,
    },
  },

  logoutBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    "& .anticon": {
      fontSize: 18,
      opacity: 0.6,
    },
  },
}));
