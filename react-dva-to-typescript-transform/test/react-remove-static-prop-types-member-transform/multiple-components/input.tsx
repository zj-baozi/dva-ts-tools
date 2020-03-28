class SomeComponent extends React.Component<{
        foo: number;
    }, {
        bar: string;
    }> {
    static propTypes = {
        foo: React.PropTypes.string,
        baz: React.PropTypes.string.isRequired,
    };
}

class AnotherComponent extends React.Component<{
        foo: number;
    }, {
        bar: string;
    }> {
    static propTypes = {
        baz: React.PropTypes.string.isRequired,
    };
}
