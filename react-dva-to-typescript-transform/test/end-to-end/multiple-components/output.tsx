type HelloPropsType = {
  message?: string
};
const Hello: React.SFC<HelloPropsType> = ({ message }) => {
  return <div>hello {message}</div>;
};
type HeyPropsType = {
  message?: string
};
const Hey: React.SFC<HeyPropsType> = ({ name }) => {
  return <div>hey, {name}</div>;
};
type MyComponentStateType = {
  foo: number,
  bar: number
};
export default class MyComponent extends React.Component<{}, MyComponentStateType> {
  render() {
    return <button onClick={this.onclick.bind(this)} />;
  }
  onclick() {
    this.setState({ foo: 1, bar: 2 });
  }
}
type AnotherComponentPropsType = {
  foo: string
};
export class AnotherComponent extends React.Component<AnotherComponentPropsType, {}> {
  render() {
    return <div />;
  }
}