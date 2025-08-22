import { Button, Card, Col, Input, Menu, Modal, Space, Typography } from "antd";
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
import {
  CloseOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export default function Dishes() {
  const classes = useStyle();
  const [dishes, setDishes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);
  const [seacrhVal, setSearchVal] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleFilterModal = () => setShowFilterModal((curr) => !curr);

  const handleResetFilters =
    (toggleModal = false) =>
    () => {
      setFilterCategory(null);
      if (toggleModal) {
        toggleFilterModal();
      }
    };

  const handleSearch = (e: any) => {
    setSearchVal(e.target.value);
  };

  const handlePriceChange = (dish: any) => {
    fetchInitialData();
  };

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setDishes((curr) => {
        const oldIndex = curr.findIndex((obj) => obj.id === active.id);
        const newIndex = curr.findIndex((obj) => obj.id === over.id);

        console.log(oldIndex, newIndex);

        return arrayMove(curr, oldIndex, newIndex);
      });
    }
  }

  const fetchCategories = async () => {
    let { data, error } = await supabase.from("categories").select();

    if (!!data) setCategories(data);
  };

  const fetchInitialData = async () => {
    let query = supabase.from("dishes").select();

    if (seacrhVal !== "") {
      query.textSearch("dish_name", seacrhVal);
    }

    if (!!filterCategory) {
      query.match({ category: filterCategory });
    }

    let { data, error } = await query.order("dish_name");

    if (!!data) {
      setLoading(false);
      setDishes(data);
      return;
    }

    console.log(error);
  };

  useEffect(() => {
    if (!loading) {
      fetchInitialData();
    }
  }, [seacrhVal, filterCategory]);

  useEffect(() => {
    if (loading) {
      fetchInitialData();
      fetchCategories();
    }
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Page className={classes.dishesPage}>
      <PageTitle showBackBtn text="Dishes" />

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
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={handleResetFilters(false)}
                />
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
              setFilterCategory(item.category_name);
              toggleFilterModal();
            },
          }))}
        />
      </Modal>

      {/* <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      > */}
      {/* <SortableContext items={dishes} strategy={verticalListSortingStrategy}> */}
      {dishes.map((dish, index) => (
        <DishListCard
          key={index}
          dish={dish}
          onPriceChange={handlePriceChange}
        />
      ))}
      {/* </SortableContext> */}
      {/* </DndContext> */}
    </Page>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  dishesPage: {
    padding: 40,
  },
  dishCard: {
    marginTop: 15,
    backgroundColor: "#202020",
    border: "none",
  },
  inputWrapper: {
    marginTop: 15,

    "& *": {
      color: colors.light500,
    },
    "& .ant-input-prefix": {
      marginRight: 10,
    },
    "& > .ant-typography": {
      paddingBottom: 5,
      display: "block",
      color: colors.light500,
    },
    "& .ant-input , & .ant-select-selector , & .ant-select, & .ant-input-affix-wrapper":
      {
        width: "100%",
        backgroundColor: "#202020 !important",
        border: "none !important",
      },

    "& .ant-select-multiple .ant-select-selection-item": {
      backgroundColor: "#202020 !important",
      border: "none !important",
      "& .ant-select-selection-item-content": {
        display: "flex",
        alignItems: "center",
      },
    },
  },

  filterModal: {
    "& .ant-modal-title": {
      color: colors.light100,
    },
    "& .ant-modal-header, & .ant-modal-body, & .ant-menu, & .ant-modal-footer, & .ant-btn":
      {
        backgroundColor: "#202020 !important",
      },
    "& .ant-menu-vertical, & .ant-modal-header, & .ant-modal-footer": {
      borderColor: "#202020 !important",
    },

    "& .ant-modal-body": {
      height: "calc(100vh - 300px)",
      overflowY: "auto",
    },
    "& .ant-menu-item-active": {
      borderRadius: 5,
    },
  },
}));
