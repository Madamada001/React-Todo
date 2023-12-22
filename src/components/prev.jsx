import React, { useRef, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

import './Todo.css';

const GroceryComponent = () => {
  const LOCAL_STORAGE = () => JSON.parse(localStorage.getItem("Items")) || [];
  const [groceryItems, setGroceryItems] = useState(LOCAL_STORAGE);

  const LOCAL_STORAGE_TASK_COUNT = () =>
  JSON.parse(localStorage.getItem('Count')) || 0;
  const [taskCount, setTaskCount] = useState(LOCAL_STORAGE_TASK_COUNT);

  const inputRef = useRef();
  const [item, setItem] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState("");
  
  useEffect(
    () => localStorage.setItem("Count", JSON.stringify(taskCount)),
    [taskCount]
  );

  useEffect(
    () => localStorage.setItem("Items", JSON.stringify(groceryItems)),
    [groceryItems]
  );



  const handleChecked = (id, completed) => {
    setGroceryItems((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    if (!completed) {
      setTaskCount((prevCount) => (prevCount > 0 ? prevCount - 1 : prevCount));
    } else {
      setTaskCount((prevCount) => prevCount + 1);
    }
  };

  const handleAddItem = () => {
    if (isEditing) {
      setGroceryItems((prevState) => {
        const newItems = prevState.map((item) =>
          item.id === editId ? { ...item, name: newItem } : item
        );
        setIsEditing(false);
        setEditId(null);
        setNewItem("");
        inputRef.current.focus();
        return newItems;
      });
      return;
    }
    if (item) {
      setGroceryItems([
        ...groceryItems,
        { id: uuid(), name: item, completed: false },
      ]);
      setItem("");
      inputRef.current.focus();
      setTaskCount((prevCount) => prevCount + 1);
    }
    return;
  };

  const handleEditItem = (id, name) => {
    setIsEditing(true);
    setEditId(id);
    setNewItem(name);
    inputRef.current.focus();
  };

  const handleDeleteItem = (id, completed) => {
    setGroceryItems((prevState) => prevState.filter((item) => item.id !== id));
    if (!completed) {
      setTaskCount((prevCount) => (prevCount > 0 ? prevCount - 1 : prevCount));
    } else {
      setTaskCount((prevCount) => prevCount + 0);
    }
  };

  return (
    <div className="todo__container container">
      <h1>Grocery Buddy</h1>
      <h3>You have {taskCount} task Todo</h3>
      <div className="input-section">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter an Item..."
            value={isEditing ? newItem : item}
            onChange={
              isEditing
                ? (event) => setNewItem(event.target.value)
                : (event) => setItem(event.target.value)
            }
          />
          <button onClick={handleAddItem} className="btn-add">
            {isEditing ? "Update Item" : "Add Item"}
          </button>

          <button onClick={handleAddItem} className="btn-add">
            {isEditing ? "Cancel" : "Clear Items"}
          </button>
        </div>
        <ul className="grocery-list">
          {groceryItems.map((item) => (
            <li key={item.id}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleChecked(item.id, item.completed)}
                disabled={isEditing}
              />
              <span
                style={{
                  textDecoration: item.completed ? "line-through" : null,
                }}
              >
                {item.name}
              </span>
              <button
                onClick={() => handleEditItem(item.id, item.name)}
                className="btn-edit"
                disabled={isEditing ? true : false}
              >
              Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item.id, item.completed)}
                className="btn-delete"
                disabled={isEditing ? true : false}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroceryComponent;
