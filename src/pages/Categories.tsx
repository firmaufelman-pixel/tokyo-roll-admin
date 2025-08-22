import { Button, Card, message, Typography } from "antd";
import Page from "components/Layout/Page";
import PageTitle from "components/Layout/PageTitle";
import Loader from "components/Others/Loader";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Link } from "react-router-dom";
import supabase from "utils/client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CategoryListCard from "components/Card/CategoryListCard";

export default function Categories() {
  const classes = useStyle();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rearranging, setRearranging] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetPriority = async () => {
    let newArray = [...categories];

    for (let i = 0; i < newArray.length; i++) {
      newArray[i].priority = newArray.length - i;
    }
    let { data, error } = await supabase.from("categories").upsert(newArray);

    if (data?.length) {
      setCategories(newArray);
      message.success("Rearranged successfully!");
      setRearranging(false);
    } else {
      console.log(error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCategories((curr) => {
        const oldIndex = curr.findIndex((obj) => obj.id === active.id);
        const newIndex = curr.findIndex((obj) => obj.id === over.id);

        return arrayMove(curr, oldIndex, newIndex);
      });
    }
  };

  const fetchInitialData = async () => {
    let { data, error } = await supabase
      .from("categories")
      .select()
      .order("priority", { ascending: false });

    if (data?.length) {
      setCategories(data);
      setLoading(false);
      return;
    }

    console.log(error);
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
    <Page className={classes.categoriesPage}>
      <PageTitle
        showBackBtn
        text="Categories"
        extra={
          <Button
            type="link"
            onClick={() =>
              rearranging ? resetPriority() : setRearranging(true)
            }
          >
            {rearranging ? "Save" : "Rearrange"}
          </Button>
        }
      />

      <Link to="/categories/add">
        <Button block size="large" type="primary">
          <Typography.Text>Add Category</Typography.Text>
        </Button>
      </Link>

      {rearranging ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category, index) => (
              <CategoryListCard rearranging key={index} category={category} />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <div>
          {categories.map((category, index) => (
            <CategoryListCard key={index} category={category} />
          ))}
        </div>
      )}
    </Page>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  categoriesPage: {
    padding: 40,
  },
}));
