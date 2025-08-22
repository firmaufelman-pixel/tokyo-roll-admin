import { Button, Result } from "antd";
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const classes = useStyle();
  const navigate = useNavigate();

  return (
    <div className={classes.notFoundPage}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back
          </Button>
        }
      />
    </div>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  notFoundPage: {
    minHeight: "100vh",
    padding: 40,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));
