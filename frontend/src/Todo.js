import React, { useEffect, useState } from "react";
import { Toaster, Intent } from "@blueprintjs/core";
import './App.css';

const AppToaster = Toaster.create({ position: "top" });

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [createdIds, setCreatedIds] = useState([]);

  const apiURL = "http://localhost:3000";

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiURL + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setCreatedIds([...createdIds, newTodo._id]);
          AppToaster.show({
            message: "Item Created Successfully",
            intent: Intent.SUCCESS,
          });
          setTitle("");
          setDescription("");
        })
        .catch(() => {
          AppToaster.show({
            message: "Unable to create a Todo Item",
            intent: Intent.DANGER,
          });
          setError("Unable to create a Todo Item");
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiURL + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
        setCreatedIds([]); // Reset the createdIds on refresh
      });
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiURL + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                return { ...item, title: editTitle, description: editDescription };
              }
              return item;
            });
            setTodos(updatedTodos);
            AppToaster.show({
              message: "Item Updated Successfully",
              intent: Intent.PRIMARY,
            });
            setEditId(-1);
            setEditTitle("");
            setEditDescription("");
          } else {
            AppToaster.show({
              message: "Unable to update Todo Item",
              intent: Intent.DANGER,
            });
            setError("Unable to update Todo Item");
          }
        })
        .catch(() => {
          AppToaster.show({
            message: "Unable to update Todo Item",
            intent: Intent.DANGER,
          });
          setError("Unable to update Todo Item");
        });
    }
  };

  const handleEdit = (item) => {
    if (!createdIds.includes(item._id)) {
      setEditId(item._id);
      setEditTitle(item.title);
      setEditDescription(item.description);
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
    setEditTitle("");
    setEditDescription("");
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      fetch(apiURL + "/todos/" + id, {
        method: "DELETE"
      })
        .then(() => {
          const updatedTodos = todos.filter((item) => item._id !== id);
          setTodos(updatedTodos);
        });
    }
  };

  return (
    <>
      <div className="row p-3 bg-danger bg-gradient text-light">
        <h1 className="text-center">Go with a Flow Using MERN Stack</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            value={title}
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
          <input
            placeholder="Description"
            value={description}
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="d-flex justify-content-center align-items-center">
          <ul className="list-group">
            {todos.map((item) => (
              <li key={item._id} className="list-group-item bg-info d-flex justify-content-between my-2">
                <div className="d-flex flex-column gap-2 me-2">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <div className="form-group d-flex gap-2">
                      <input
                        placeholder="Title"
                        value={editTitle}
                        className="form-control"
                        onChange={(e) => setEditTitle(e.target.value)}
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        value={editDescription}
                        className="form-control"
                        onChange={(e) => setEditDescription(e.target.value)}
                        type="text"
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === -1 || editId !== item._id ? (
                    <button className="btn btn-warning" onClick={() => handleEdit(item)} disabled={createdIds.includes(item._id)}>
                      Edit
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={handleUpdate}>Update</button>
                  )}
                  {editId === -1 || editId !== item._id ? (
                    <button className="btn btn-danger" onClick={() => { handleDelete(item._id); }}>Delete</button>
                  ) : (
                    <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
