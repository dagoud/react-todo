
import { useEffect } from "react"
import { useState } from "react"
import { NewTodoForm } from "./NewTodoForm"
import "./styles.css"
import { TodoList } from "./TodoList"

export default function App(){
  
  const [todos, setTodos] = useState(() =>{
    const localValue = localStorage.getItem("ITEMS")
    if(localValue == null) return [] 
    
    return JSON.parse(localValue)
  })

  // does not return anything but takes function as an argument which runs every time the object in the 2nd argument ([todos]) changes
  useEffect(()=>{
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])

  function addTodo(title){
    setTodos( currentTodos => {
        return [
          ...currentTodos,
          {id: crypto.randomUUID(), title, completed: false},
        ]
      })
    }


  function toggleTodo(id, completed){
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if(todo.id === id){
          return {...todo, completed}
        }

        return todo
      })
    })
  }

  function deleteTodo(id){
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    })
  }

  return(
    <>
    <NewTodoForm onSubmit={addTodo} />
  <h1 className="header">Todo List</h1>
  <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo}/>
  </>
  )
}


