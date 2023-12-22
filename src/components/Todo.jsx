import React, { useRef, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaCheckSquare } from "react-icons/fa";

import "./Todo.css";

const GroceryComponent = () => {
  const LOCAL_STORAGE = () => JSON.parse(localStorage.getItem("Items")) || [];
  const [groceryItems, setGroceryItems] = useState(LOCAL_STORAGE);

  const LOCAL_STORAGE_TASK_COUNT = () =>
    JSON.parse(localStorage.getItem("Count")) || 0;
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

  const handleClear = () => {
    if (isEditing) {
      setNewItem("");
      setIsEditing(false);
      inputRef.current.focus();
    } else {
      setGroceryItems([]);
      setTaskCount((prevCount) => (prevCount = 0));
    }
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

  const line_through = {
    textDecoration: 'line-through',
    textDecorationColor: '#ffffff',
    textDecorationThickness: '1.5px', 
    fontStyle: 'italics',
    fontWeight: '100',
  }

  

  return (
    <div className="todo__container ">
     
  <div className="items-container container">
  <h1>Todo</h1>
      <h4>You have <span>({taskCount})</span> task to be completed</h4>
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
          </div>
    
        <div className="input-btn">
          {" "}
          <button onClick={handleAddItem} className="btn-add">
            {isEditing ? "Update Item" : "Add Item"}
          </button>
          <button onClick={handleClear} className="btn-clear" type="button">
            {isEditing ? "Cancel" : "Clear"}
          </button>
        </div>
        <div>
        <ul className="todo-list">
          {groceryItems.map((item) => (
            <li key={item.id} className="list-items">
              
              <span
                style={
                 item.completed ? line_through : {}
                }
              >
                {item.name}
              </span>
              <div className="input-btn_2">
              <button
                onClick={() => handleEditItem(item.id, item.name)}
                className="btn-edit"
                disabled={isEditing ? true : false}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteItem(item.id, item.completed)}
                className="btn-delete"
                disabled={isEditing ? true : false}
              >
               <MdDelete />
              </button>

              <button
                
              
                onClick={() => handleChecked(item.id, item.completed)}
                disabled={isEditing}
                className="btn-check"
              >
             <FaCheckSquare />
                </button>
              </div>
            </li>
          ))}
        </ul>
  
    </div>
    </div>
    </div>
  );
};

export default GroceryComponent;
