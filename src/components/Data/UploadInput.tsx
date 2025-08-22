import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadProps, UploadFile } from "antd/lib/upload";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";

const SUPABASE_IMAGE_PREFIX =
  "https://ealmujmxbmhjvahkdbyo.supabase.co/storage/v1/object/public/menu";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

interface UploadInputProps {
  defaultImagePath: string;
  onChange: (fileList: any[]) => void;
}

export default function UploadInput({
  defaultImagePath,
  onChange,
}: UploadInputProps) {
  const classes = useStyle();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>();

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }

    onChange(info?.fileList);
  };

  useEffect(() => {
    setImageUrl(
      !!defaultImagePath ? SUPABASE_IMAGE_PREFIX + defaultImagePath : null
    );
  }, []);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      action=""
      name="avatar"
      listType="picture-card"
      multiple={false}
      accept="image/png, image/jpg, image/jpeg"
      // @ts-ignore
      customRequest={({ file, onSuccess }) => {
        setTimeout(() => {
          // @ts-ignore
          onSuccess("ok");
        }, 0);
      }}
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      className={classes.uploadInput}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  uploadInput: {
    "& .ant-upload": {
      height: "150px !important",
      width: "150px !important",
      backgroundColor: "#202020",
      border: "none",
    },
  },
}));
