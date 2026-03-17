import { TodoList } from './components/TodoList/TodoList';
import { useApp } from './useApp';

function App() {
  const { todoLists } = useApp();

  return (
    <>
      {todoLists.map((list) => (
        <TodoList key={list.id} todoListId={list.id} />
      ))}
    </>
  );
}

export default App;
