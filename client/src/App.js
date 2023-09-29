import "./App.css";
import img from "./Images/delete.png";
import img2 from "./Images/edit.png";
import img3 from "./Images/cross.png";
import { useState, useEffect } from "react";

const api_base = "http://localhost:5000";
const star = require("./Images/star-empty.png");
const importantStar = require("./Images/star-filled.png");
const incomplete = require("./Images/incomplete.png");
const complete = require("./Images/complete.png");
const closePopup = require("./Images/close-popup.png");
/// AFTER COMPLETING FOLLOW ALONG ADD TODO COLOR FUNCTIONALITY

function App() {
  const [todos, setTodos] = useState([]);
  const [selected, setSelected] = useState("Priority");
  const [newTodo, setNewTodo] = useState("");
  const [popupActive, setPopupActive] = useState(false);
  const [updateId, setUpdateId] = useState('');

  useEffect(() => {
    getTodo();
  }, []);

  const getTodo = () => {
    fetch(api_base + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  };

  const createNewTodo = async () => {
    if (newTodo !== "") {
      const data = await fetch(api_base + "/todos/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newTodo,
        }),
      }).then((res) => res.json());
      setTodos([...todos, data]);
      setNewTodo("");
    }
  };

  const deleteTodo = async (id) => {
    const data = await fetch(api_base + "/todos/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());
    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const deleteAllTodos = async () => {
    await fetch(api_base + "/todos/delete", {
      method: "DELETE",
    }).then((res) => res.json());
    setTodos([]);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if(!popupActive){
        await createNewTodo();
      }
      if(popupActive){
        await editTodo()
      }
    }
  };

  const setImportance = async (id) => {
    let currentTodo = todos.filter((todo) => todo._id === id);
    currentTodo = await fetch(api_base + "/todos/update/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        important: !currentTodo[0].important,
      }),
    }).then((res) => res.json());
    const updatedTodos = todos.map((todo) => {
      if (todo._id === currentTodo._id) {
        return currentTodo;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const setProgress = async (id) => {
    let currentTodo = todos.filter((todo) => todo._id === id);
    currentTodo = await fetch(api_base + "/todos/update/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !currentTodo[0].completed,
      }),
    }).then((res) => res.json());
    const updatedTodos = todos.map((todo) => {
      if (todo._id === currentTodo._id) {
        return currentTodo;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const openPopup = async (id) => {
    setPopupActive(true);
    setUpdateId(id);
  };

  const editTodo = async () => {
    if(newTodo !== ""){
      let currentTodo = todos.filter((todo) => todo._id === updateId);
      currentTodo = await fetch(api_base + '/todos/update/' + updateId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json());
    const updatedTodo = todos.map((todo) =>{
      if(todo._id === updateId) {
        return currentTodo;
      }
      return todo;
    })
    setTodos(updatedTodo)
    setPopupActive(false)
    setNewTodo("")
    }
  }

  const closeDownPopup = () => {
    setPopupActive(false);
  };

  const priorityDisplay = async () =>{
    if(selected === 'All'){
      getTodo()
    }
    if(selected === 'High'){
      const updatedTodos = await fetch(api_base + '/todos/important').then(res => res.json());
      setTodos(updatedTodos)
    }
    if(selected === 'Low'){
      const updatedTodos = await fetch(api_base + '/todos/unimportant').then(res => res.json());
      setTodos(updatedTodos)
    }
  }

  const priorityChange = async (e) =>{
    setSelected(e.target.value);
  }

  return (
    <div className="App">
      <div className="Title">
        <h1>TaskIT</h1>
      </div>
      <div className="newTodos">
        <h1>Create New Todo</h1>
        <input
          type="text"
          placeholder="Your Task"
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          value={newTodo}
        />
        <button onClick={createNewTodo}>Create</button>
      </div>
      <div className="currentTodosTitleBar">
        <h3>Current Todos</h3>
        <div className="select-dropdown">
          <select
            value={selected}
            onChange={priorityChange}
            onClick={priorityDisplay}
          >
            <option disabled selected hidden value = "Priority">Priority</option>
            <option value = "All">All</option>
            <option value = "High">High</option>
            <option value = "Low">Low</option>
          </select>
        </div>
        <img
          className="deleteAll"
          src={img}
          alt="delete"
          onClick={deleteAllTodos}
        ></img>
      </div>
      <div className="currentTodos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div className="todo" key={todo._id}>
              {todo.completed ? (
                <img
                  className="complete-mark"
                  src={complete}
                  alt="checkmark"
                  onClick={() => setProgress(todo._id)}
                />
              ) : (
                <img
                  className="complete-mark"
                  src={incomplete}
                  alt="checkmark"
                  onClick={() => setProgress(todo._id)}
                />
              )}
              {todo.important ? (
                <img
                  className="priority-star"
                  src={importantStar}
                  alt="priority"
                  onClick={() => setImportance(todo._id)}
                ></img>
              ) : (
                <img
                  className="priority-star"
                  src={star}
                  alt="priority"
                  onClick={() => setImportance(todo._id)}
                ></img>
              )}
              <h4 className={todo.completed ? "strike" : ""}>{todo.text}</h4>
              <img
                className="edit-icon"
                src={img2}
                alt="edit"
                onClick={() => openPopup(todo._id)}
              />
              <img
                className="delete-icon"
                src={img3}
                alt="delete"
                onClick={() => deleteTodo(todo._id)}
              />
            </div>
          ))
        ) : (
          <p className="no-tasks">No Tasks</p>
        )}
      </div>
      {popupActive && <div className="wrapper">
        <div className="grey-bg"></div>
        <div className="popup">
          <div className="popup-img-container">
            <img src={closePopup} alt="close-popup" onClick={closeDownPopup} />
          </div>
          <div className="popup-container">
            <h1>Edit Todo</h1>
            <div className="popup-container-2">
              <input
                type="text"
                placeholder="Your Task"
                onChange={(e) => {
                  setNewTodo(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                value={newTodo}
              />
              <button onClick={editTodo}>Edit</button>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default App;
