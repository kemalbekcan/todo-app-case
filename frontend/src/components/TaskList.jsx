import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Space, Table } from "antd";

// eslint-disable-next-line react/prop-types
const TaskList = ({ refresh, showModal }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/task/list?page=${page}&limit=10`)
      .then((response) => {
        console.log("response", response);
        setTotal(response.data.totalDocuments);
        setPage(response.data.page);

        setTasks(response.data.results.results);
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh]);

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      filters: tasks.map((task) => ({ text: task._id, value: task._id })),
      onFilter: (value, record) => record._id.includes(value),
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
      filters: tasks.map((task) => ({ text: task.text, value: task.text })),
      onFilter: (value, record) => record.text.includes(value),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={`http://localhost:3000/uploads/${image}`}
            alt="task"
            style={{ maxWidth: "100px", cursor: "pointer" }}
            onClick={() => handleImageClick(image)}
          />
        ) : (
          "Null"
        ),
      filters: [
        { text: "With Image", value: "withImage" },
        { text: "Without Image", value: "withoutImage" },
      ],
      onFilter: (value, record) => {
        if (value === "withImage") return record.image;
        if (value === "withoutImage") return !record.image;
        return true;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record, "update")}>
            Upload
          </a>
          <a onClick={() => showModal(record._id, "delete")}>Delete</a>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
  };

  const handleImageClick = async (image) => {
    if (image) {
      try {
        const response = await axios.get(
          `http://localhost:3000/uploads/${image}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${image}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading the image", error);
      }
    }
  };

  return (
    <div>
      <Table
        dataSource={tasks}
        columns={columns}
        pagination={{
          current: page,
          pageSize: 10,
          total: total,
        }}
        loading={loading}
        onChange={handleTableChange}
        rowKey="_id"
      />
    </div>
  );
};

export default TaskList;
