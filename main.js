const searchNotebookId = (collection, pieces) => {
	const { models } = collection;
	const name = pieces.shift();
	let matched = null;

	for (const model of models) {
		if (model.attributes.name === name) {
			matched = model;
			break;
		}
	}

	if (pieces.length === 0) {
		return matched.attributes.path.split('/').slice(-1)[0];
	}

	return searchNotebookId(matched.collection, pieces);
};

(() => {
	const updateCell = () => {
		const activeCell = document.querySelector('div.is-editing div.CodeMirror');

		if (activeCell && activeCell.CodeMirror) {
			const cm = activeCell.CodeMirror;

			cm.options.extraKeys['Ctrl-J'] = (cm) => {
				const path = cm.getValue();
				const pieces = path.split('/').filter((x) => x !== '');
				const notebookId = searchNotebookId(treeCollection, pieces);
				cm.setValue(notebookId);
			};
		}
	};

	document.addEventListener('mouseup', updateCell);
	document.addEventListener('keyup', updateCell);
})();
