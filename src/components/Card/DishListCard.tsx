import { createUseStyles } from "react-jss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { Button, Card, Input, message, Space, Typography } from "antd";
import { CheckOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import supabase from "utils/client";

const truncate = (input: string, length: number) =>
  input.length > length ? input.substring(0, length) + "..." : input;

export default function DishListCard({ dish, onPriceChange, rearranging = false }: any) {
  const classes = useStyle();
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(dish.price);

  // same hook as Categories’ card, but only used in rearranging view
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: dish.id });
  const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;

  const handlePriceSave = async () => {
    if (priceInput === dish.price) return setEditingPrice(false);
    const { data, error } = await supabase.from("dishes").upsert({ ...dish, price: priceInput });
    if (data?.length) {
      setEditingPrice(false);
      onPriceChange?.();
      message.success("Price updated successfully!");
    } else {
      message.error("Something went wrong!");
      console.log(error);
    }
  };

  if (rearranging) {
    // Draggable version (identical UX to CategoryListCard)
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className={classes.dishCardRearranging}>
          <Typography.Text>{dish.dish_name}</Typography.Text>
          <MenuOutlined />
        </Card>
      </div>
    );
  }

  // Normal (non-draggable) version with your price editing
  return (
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
            onPressEnter={handlePriceSave}
            onChange={(e) => setPriceInput(e.target.value)}
          />
          <Button type="primary" size="small" icon={<CheckOutlined />} onClick={handlePriceSave} />
        </Space>
      ) : (
        <Button size="small" type="text" onClick={() => setEditingPrice(true)} style={{ wordBreak: "break-all" }}>
          {truncate(String(priceInput ?? ""), 10)}
          <EditOutlined />
        </Button>
      )}
    </Card>
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
