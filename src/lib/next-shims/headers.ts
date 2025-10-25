export const cookies = () => ({
  get: (name: string) => {
    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1];
    return value ? { value } : undefined;
  },
  set: (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/`;
  },
  delete: (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
});

export const headers = () => ({
  get: (name: string) => null,
});
