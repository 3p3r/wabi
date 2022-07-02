"use strict";

const React = require("react");
const { Text } = require("ink");
const { promises: fs } = require("fs");
const { parseStringPromise } = require("xml2js");
const { default: Spinner } = require("ink-spinner");

const INPUT = "/usr/local/include/uv.h";

class UI extends React.Component {
	state = { status: "loading xml" };

	log = (m) => this.setState({ status: m });

	componentDidMount() {
		fs.readFile("uv.xml", "utf8").then((xml) => {
			parseStringPromise(xml).then((result) => {
				this.log("parsed xml");
				this.generate(result)
					.then(() => process.exit(0))
					.catch(() => process.exit(1));
			});
		});
	}

	render() {
		return (
			<Text bold>
				<Text color="green">
					<Spinner type="dqpb" />
				</Text>{" "}
				{this.state.status}
			</Text>
		);
	}

	async generate({ GCC_XML }) {
		this.log("looking for input file's compiled ID");
		const [inputFile] = GCC_XML.File.filter(({ $ }) => $.name === INPUT);
		const inputFileId = inputFile.$.id;
		this.log(`found input file's compiled ID: ${inputFileId}`);
		const functions = GCC_XML.Function.filter(
			({ $ }) => $.file === inputFileId
		).map(({ $, Argument = [] }) => ({
			name: $.name,
			loc: $.location,
			returns: $.returns, // TBD.
			args: Argument.map(({ $ }) => ({
				name: $.name,
				loc: $.location,
				type: $.type, // TBD.
			})),
		}));
		this.log(`found ${functions.length} functions`);
	}
}

module.exports = UI;
