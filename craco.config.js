const nodeExternals = require('webpack-node-externals');

module.exports = {
	devServer: {
		port: 8080,
	},
	webpack: {
		configure: {
			target: 'electron-renderer',
			externals: [
				nodeExternals({
					allowlist: [/webpack(\/.*)?/, 'electron-devtools-installer'],
				}),
			],
		},
	},
};