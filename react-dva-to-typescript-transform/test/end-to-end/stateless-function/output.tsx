type HelloPropsType = {
  message?: string
};
export const Hello: React.SFC<HelloPropsType> = ({ message }) => {
  return <div>hello {message}</div>;
};
