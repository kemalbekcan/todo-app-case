import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Space, Table } from "antd";

// eslint-disable-next-line react/prop-types
const TaskList = ({ refresh }) => {
  const [tasks, setTasks] = useState();

  useEffect(() => {
    axios
      .get("/task/list")
      .then((response) => {
        console.log("response", response);
        setTasks(response.data.results);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [refresh]);


  const columns = [
    {
      title: 'Name',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={tasks} columns={columns} />
    </div>
  );
};

export default TaskList;
