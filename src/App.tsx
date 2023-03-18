import React, { useReducer, useContext, ChangeEvent, FormEvent } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type State = {
  todos: Todo[];
  nextId: number;
};

const initialState: State = {
  todos: [],
  nextId: 1,
};

type Action =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: number }
  | { type: 'REMOVE_TODO'; id: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: state.nextId, text: action.text, completed: false },
        ],
        nextId: state.nextId + 1,
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
    default:
      return state;
  }
};

const TodoContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      <div>
        <h1>ToDo App</h1>
        <TodoForm />
        <TodoList />
      </div>
    </TodoContext.Provider>
  );
};

const TodoForm: React.FC = () => {
  const { dispatch } = useContext(TodoContext);
  const [input, setInput] = React.useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({ type: 'ADD_TODO', text: input.trim() });
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

const TodoList: React.FC = () => {
  const { state, dispatch } = useContext(TodoContext);

  const toggleTodo = (id: number) => {
    dispatch({ type: 'TOGGLE_TODO', id });
  };

  const removeTodo = (id: number) => {
    dispatch({ type: 'REMOVE_TODO', id });
  };

  return (
    <ul>
      {state.todos.map((todo) => (
        <li key={todo.id}>
          <span
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};

export default App;
