import { useEffect, useState } from "react";

const useLocalStorage = (
  initialState: boolean,
  key: string
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [value, setValue] = useState<boolean>(() => {
    const storedValue: string | null = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;
