import "antd/dist/antd.less";
import { Button, Card, Typography } from "antd";
import { AppstoreAddOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { createUseStyles } from "react-jss";
import { Route, Routes } from "react-router-dom";
import HomePage from "pages/HomePage";
import NotFound from "pages/NotFound";
import Dishes from "pages/Dishes";
import AddDish from "pages/AddDish";
import EditDish from "pages/EditDish";
import Categories from "pages/Categories";
import EditCategory from "pages/EditCategory";
import AddCategory from "pages/AddCategory";
import Login from "pages/Login";
import AuthRoute from "components/Auth/AuthRoute";
import ProtectedRoute from "components/Auth/ProtectedRoute";
import Configs from "pages/Configs";

export default function App() {
  const classes = useStyle();

  return (
    <div className={classes.app}>
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/login" element={<AuthRoute />}>
          <Route path="" element={<Login />} />
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="" element={<HomePage />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/dishes/add" element={<AddDish />} />
          <Route path="/dishes/:dishId" element={<EditDish />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/categories/:categoryId" element={<EditCategory />} />

          <Route path="/configs" element={<Configs />} />
        </Route>
      </Routes>
    </div>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  app: {
    maxWidth: 600,
    margin: "auto",
  },
}));
