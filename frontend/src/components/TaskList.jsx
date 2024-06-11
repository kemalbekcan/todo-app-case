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
      title: "Name",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
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
            style={{ maxWidth: "100px" }}
          />
        ) : (
          "Null"
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal('sadas', 'update')}>Upload {record.name}</a>
          <a onClick={() => showModal(record._id, 'delete')}>Delete</a>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
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
