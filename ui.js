"use strict";

const React = require("react");
const { Text } = require("ink");
class Counter extends React.Component {
	state = {
		counter: 0,
	};
	componentDidMount() {
		this.interval = setInterval(() => {
			this.setState({ counter: this.state.counter + 1 });
		}, 100);
	}
	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
			delete this.interval;
		}
	}
	render() {
		return <Text color="green">{this.state.counter} tests passed</Text>;
	}
}

module.exports = Counter;
