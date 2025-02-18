import { TodoItem } from "./TodoItem"


export function TodoList( { todos, toggleTodo, deleteTodo }){
  
  // short-circuiting example
  const noTodos = todos.length === 0 && "No Todos"
  
  return (
        <ul className="list">
    {noTodos}  
    {todos.map(todo => {
      return  (  
          <TodoItem 
          {...todo}
          key={todo.id}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          />
      )
    })}
  </ul>
    )
}