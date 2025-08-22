import { createUseStyles } from "react-jss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { Card, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";

export default function CategoryListCard({
  category,
  rearranging = false,
}: any) {
  const classes = useStyle();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (rearranging) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className={classes.dishCardRearranging}>
          <Typography.Text>{category.category_name}</Typography.Text>
          <MenuOutlined />
        </Card>
      </div>
    );
  }

  return (
    <Link to={`/categories/${category.id}`} style={{ flex: 1 }}>
      <Card className={classes.dishCard}>
        <Typography.Text>{category.category_name}</Typography.Text>
      </Card>
    </Link>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  dishCard: {
    marginTop: 15,
    backgroundColor: "#202020",
    border: "none",
  },
  dishCardRearranging: {
    marginTop: 15,
    backgroundColor: "#202020",
    border: "none",
    cursor: "grab",
    position: "relative",

    "& .anticon": {
      opacity: 0.4,
      position: "absolute",
      right: 15,
      top: "50%",
      transform: "translateY(-50%)",
    },
  },
}));
