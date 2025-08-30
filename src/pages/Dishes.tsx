import { Button, Card, Col, Input, Menu, Modal, Space, Typography, message } from "antd";
import Page from "components/Layout/Page";
import PageTitle from "components/Layout/PageTitle";
import Loader from "components/Others/Loader";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Link } from "react-router-dom";
import supabase from "utils/client";
import DishListCard from "components/Card/DishListCard";

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
import Search from "antd/lib/input/Search";
import { CloseOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";

export default function Dishes() {
  const classes = useStyle();
  const [dishes, setDishes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<any>(null);
  const [seacrhVal, setSearchVal] = useState("");
  const [rearranging, setRearranging] = useState(false); // same flow as Categories

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleFilterModal = () => setShowFilterModal((curr) => !curr);

  const handleResetFilters =
    (toggleModal = false) =>
      () => {
        setRearranging(false); // exit rearrange if clearing
        setFilterCategory(null);
        if (toggleModal) toggleFilterModal();
      };

  const handleSearch = (e: any) => setSearchVal(e.target.value);
  const handlePriceChange = () => fetchInitialData();

  // EXACT same drag-end logic as Categories (frontend reorder)
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDishes((curr) => {
      const oldIndex = curr.findIndex((obj) => obj.id === active.id);
      const newIndex = curr.findIndex((obj) => obj.id === over.id);
      return arrayMove(curr, oldIndex, newIndex);
    });
  };

  // Persist current order -> priority (highest number = top)
  // Persist current on-screen order for this category
  const saveReorder = async () => {
    if (!filterCategory) return;

    // Optional guard: avoid partial sets that could collide with hidden items
    if (seacrhVal.trim() !== "") {
      message.info("Clear search to save a full category order.");
      return;
    }

    const ids = dishes.map((d) => d.id);

    // STEP 1: put all involved rows into the safe "0" bucket (duplicates allowed)
    const { error: stageErr } = await supabase
      .from("dishes")
      .update({ priority: 0 })
      .in("id", ids)              // scope only to what we're rearranging
      .eq("category", filterCategory); // extra safety

    if (stageErr) {
      console.error(stageErr);
      message.error("Couldn't stage priorities.");
      return;
    }

    // STEP 2: assign the final unique priorities (highest = top)
    const updates = dishes.map((d, idx) =>
      supabase
        .from("dishes")
        .update({ priority: dishes.length - idx })
        .eq("id", d.id)
        .eq("category", filterCategory)
    );

    const results = await Promise.all(updates);
    const firstErr = results.find((r) => r.error)?.error;
    if (firstErr) {
      console.error(firstErr);
      message.error("Failed to save new order.");
      return;
    }

    message.success("Rearranged successfully!");
    setRearranging(false);
    await fetchInitialData();
  };



  const fetchCategories = async () => {
    let { data } = await supabase.from("categories").select();
    if (!!data) setCategories(data);
  };

  const fetchInitialData = async () => {
    let query = supabase.from("dishes").select();

    if (seacrhVal !== "") query.textSearch("dish_name", seacrhVal);
    if (!!filterCategory) query.match({ category: filterCategory });

    // NEW: sort by priority desc inside a category; otherwise alphabetical
    if (filterCategory) {
      query.order("priority", { ascending: false }).order("dish_name");
    } else {
      query.order("dish_name");
    }

    const { data, error } = await query;
    if (data) {
      setLoading(false);
      setDishes(data);
    } else {
      console.log(error);
    }
  };


  useEffect(() => {
    if (!loading) fetchInitialData();
  }, [seacrhVal, filterCategory]);

  useEffect(() => {
    if (loading) {
      fetchInitialData();
      fetchCategories();
    }
  }, [loading]);

  if (loading) return <Loader />;

  // flow you asked: filter → choose category → rearrange button appears
  const showRearrangeBtn = !!filterCategory;

  return (
    <Page className={classes.dishesPage}>
      <PageTitle
        showBackBtn
        text="Dishes"
        extra={
          !!filterCategory && (
            <Button
              type="link"
              onClick={() => (rearranging ? saveReorder() : setRearranging(true))}
            >
              {rearranging ? "Save" : "Rearrange"}
            </Button>
          )
        }
      />


      <Link to="/dishes/add">
        <Button block size="large" type="primary">
          <Typography.Text>Add Dish</Typography.Text>
        </Button>
      </Link>

      <Col className={classes.inputWrapper}>
        <Input
          size="large"
          placeholder="Search..."
          value={seacrhVal}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          suffix={
            <Space>
              <Button
                shape="circle"
                type={!!filterCategory ? "default" : "text"}
                icon={<FilterOutlined />}
                onClick={toggleFilterModal}
              />
              {!!filterCategory && (
                <Button type="text" icon={<CloseOutlined />} onClick={handleResetFilters(false)} />
              )}
            </Space>
          }
        />
      </Col>

      <Modal
        visible={showFilterModal}
        title="Filter By Category"
        onCancel={toggleFilterModal}
        className={classes.filterModal}
        footer={
          <Space>
            <Button onClick={handleResetFilters(true)}>Reset Filters</Button>
          </Space>
        }
      >
        <Menu
          selectable
          selectedKeys={[filterCategory ?? ""]}
          items={categories.map((item, index) => ({
            key: item.category_name,
            label: item.category_name,
            onClick: () => {
              setRearranging(false);
              setFilterCategory(item.category_name);
              toggleFilterModal();
            },
          }))}
        />
      </Modal>

      {rearranging ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dishes} strategy={verticalListSortingStrategy}>
            {dishes.map((dish, index) => (
              <DishListCard rearranging key={index} dish={dish} />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <div>
          {dishes.map((dish, index) => (
            <DishListCard key={index} dish={dish} onPriceChange={handlePriceChange} />
          ))}
        </div>
      )}
    </Page>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  dishesPage: {
    padding: 40,
  },
  inputWrapper: {
    marginTop: 15,
    "& *": { color: colors.light500 },
    "& .ant-input-prefix": { marginRight: 10 },
    "& > .ant-typography": { paddingBottom: 5, display: "block", color: colors.light500 },
    "& .ant-input , & .ant-select-selector , & .ant-select, & .ant-input-affix-wrapper": {
      width: "100%",
      backgroundColor: "#202020 !important",
      border: "none !important",
    },
  },
  filterModal: {
    "& .ant-modal-title": { color: colors.light100 },
    "& .ant-modal-header, & .ant-modal-body, & .ant-menu, & .ant-modal-footer, & .ant-btn": {
      backgroundColor: "#202020 !important",
    },
    "& .ant-menu-vertical, & .ant-modal-header, & .ant-modal-footer": {
      borderColor: "#202020 !important",
    },
    "& .ant-modal-body": { height: "calc(100vh - 300px)", overflowY: "auto" },
    "& .ant-menu-item-active": { borderRadius: 5 },
  },
}));
