import { createUseStyles } from "react-jss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { Button, Card, Input, message, Space, Typography } from "antd";
import { useState } from "react";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import supabase from "utils/client";

const truncate = (input: string, length: number) => {
  if (input.length > length) {
    return input.substring(0, length) + "...";
  }
  return input;
};

export default function DishListCard({ dish, onPriceChange }: any) {
  const classes = useStyle();
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(dish.price);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: dish.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handlePriceChange = async () => {
    if (priceInput === dish.price) return setEditingPrice(false);

    let { data, error } = await supabase
      .from("dishes")
      .upsert({ ...dish, price: priceInput });

    if (data?.length) {
      setEditingPrice(false);
      onPriceChange();
      message.success("Price updated successfully!");
      return;
    }

    message.error("Something went wrong!");
    console.log(error);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={classes.dishCard}>
        <Link to={`/dishes/${dish.id}`}>
          <Typography.Text>{dish.dish_name}</Typography.Text>
        </Link>

        <div style={{ flex: 1 }} />

        {editingPrice ? (
          <Space className={classes.priceInputWrapper}>
            <Input
              size="small"
              value={priceInput}
              onPressEnter={handlePriceChange}
              onChange={(e) => setPriceInput(e.target.value)}
            />
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={handlePriceChange}
            />
          </Space>
        ) : (
          <Button
            size="small"
            type="text"
            onClick={() => setEditingPrice(true)}
            style={{ wordBreak: "break-all" }}
          >
            {truncate(priceInput, 10)}
            <EditOutlined />
          </Button>
        )}
      </Card>
    </div>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  dishCard: {
    marginTop: 15,
    backgroundColor: "#202020",
    border: "none",

    "& .ant-card-body": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
  priceInputWrapper: {
    "& > .ant-typography": {
      paddingBottom: 5,
      display: "block",
      color: colors.light500,
    },
    "& .ant-input": {
      width: 70,
      textAlign: "center",
      backgroundColor: "#111 !important",
      border: "none !important",
    },
  },
}));
