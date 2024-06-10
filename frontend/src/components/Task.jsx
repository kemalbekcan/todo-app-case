import axios from "../lib/axios";

// eslint-disable-next-line react/prop-types
const Task = ({setRefresh}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/task/add", { text: e.target.message.value })
      .then((response) => {
        console.log("res", response);
        setRefresh((prev) => !prev); 
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div className="mx-10 mb-10">
      <form className="flex gap-10" onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Message"
          className="w-100 h-32"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Task;
