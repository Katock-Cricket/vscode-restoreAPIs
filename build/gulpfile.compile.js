/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

const gulp = require('gulp');
const util = require('./lib/util');
const date = require('./lib/date');
const task = require('./lib/task');
const compilation = require('./lib/compilation');

/**
 * @param {boolean} disableMangle
 */
function makeCompileBuildTask(disableMangle) {
	// return task.series(
	// 	// util.rimraf('out-build'),
	// 	// date.writeISODate('out-build'),
	// 	compilation.compileApiProposalNamesTask,
	// 	// compilation.compileTask('src', 'out-build', true, { disableMangle })
	// );

	// 如果报了生成js代码中出现null等问题，就这样：
	// 1. 先npm run watch，启动调试：例如./scripts/code.sh
	// 2. 然后./out中有了调试时生成的js代码，这个和打包时在out-build中生成的js代码不一样，不带混淆和压缩等，没有null等问题，但是可以直接拿来打包
	// 3. 把out中的所有文件拷贝覆盖到out-build中
	// 4. 将下面的代码注释掉，将上面的步骤取消注释，就是说把逻辑改成打包时直接使用out中的js代码，不用再编译了
	// 5. 然后执行npm run gulp vscode-darwin-arm64-min打包

	return task.series(
		util.rimraf('out-build'),
		date.writeISODate('out-build'),
		compilation.compileApiProposalNamesTask,
		compilation.compileTask('src', 'out-build', true, { disableMangle })
	);
}

// Full compile, including nls and inline sources in sourcemaps, mangling, minification, for build
const compileBuildTask = task.define('compile-build', makeCompileBuildTask(false));
gulp.task(compileBuildTask);
exports.compileBuildTask = compileBuildTask;

// Full compile for PR ci, e.g no mangling
const compileBuildTaskPullRequest = task.define('compile-build-pr', makeCompileBuildTask(true));
gulp.task(compileBuildTaskPullRequest);
exports.compileBuildTaskPullRequest = compileBuildTaskPullRequest;
