export function useDebounce(callback: Function, delay = 300) {
  let timeout: number;

  return (...args: any[]) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
