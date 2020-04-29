class _TrieNode {
    // parent: _TrieNode (optional)
    // childLabels: Array(String) (optional)
    // childNodes: Array(_TrieNode) (optional)
    // value: Any (optional)

    getChildForLabel(label, createIfNotExist) {
        if (this.childLabels == null) {
            if (!createIfNotExist) {
                return null;
            }
            else {
                this.childLabels = [];
                this.childNodes = [];
            }
        }

        var index = _binarySearch(label, this.childLabels, 0, this.childLabels.length-1);

        // If the label exists, return the corresponding node
        if (this.childLabels[index] == label) {
            return this.childNodes[index];
        }

        // If it doesn't exist, create a node for it if the caller wanted that
        else if (createIfNotExist) {
            var newChildNode = new _TrieNode();
            newChildNode.parent = this;

            // splice(index, howManyToReplace, insertData)
            this.childNodes.splice(index, 0, newChildNode);
            this.childLabels.splice(index, 0, label);
            return newChildNode;
        }

        else {
            return null;
        }
    }
}

class Trie {
    // root: _TrieNode
    // lastPrefixNode: _TrieNode
    // lastPrefixKey: String

    constructor() {
        this.root = new _TrieNode();
        this.lastPrefixNode = this.root;
        this.lastPrefixKey = "";
    }

    searchPrefix(prefix) {
        var list = [];
        var curr = this.root;
        var prefixNode = this._find(prefix, false, true);
        if (prefixNode != null)
            this._getSubtreeValues(prefixNode, list);

        return list;
    }

    getValue(key, optimize) {
        var node = this._find(key, false, optimize);
        return node.value;
    }

    update(key, value, optimize) {
        var node = this._find(key, true, optimize);
        node.value = value;
    }

    _find(targetKey, createIfNotExist, optimize) {
        if (!optimize) {
            var curNode = this.root;
            for (var i = 0; i < targetKey.length; i++) {
                curNode = curNode.getChildForLabel(targetKey[i], true);
            }
            return curNode;
        }

        // go up sufficiently
        var firstDifferingIndex = _getFirstDifferingIndex(targetKey, this.lastPrefixKey);
        if (firstDifferingIndex > this.lastPrefixKey.length / 2) {
            for (var i = this.lastPrefixKey.length; i > firstDifferingIndex; i--) {
                this.lastPrefixNode = this.lastPrefixNode.parent;
            }
            this.lastPrefixKey = this.lastPrefixKey.substring(0, firstDifferingIndex);
        }
        else {
            this.lastPrefixNode = this.root;
            this.lastPrefixKey = "";
        }
        // by this point, lastPrefixNode is an ancestor of the target node

        // go down sufficiently
        while (targetKey.length > this.lastPrefixKey.length) {
            var nextLetter = targetKey[this.lastPrefixKey.length];
            var nextChild = this.lastPrefixNode.getChildForLabel(nextLetter, createIfNotExist);

            if (nextChild === null)
                return null;

            this.lastPrefixNode = nextChild;
            this.lastPrefixKey += nextLetter;
        }

        return this.lastPrefixNode;
    }

    _getSubtreeValues(currNode, list) {
        if (currNode.value != null) // if node has a value
            list.push(currNode.value);

        if (currNode.childLabels === undefined) // leaf node
            return;

        for (var i = 0; i < currNode.childLabels.length; i++) { // recurse into each child
            this._getSubtreeValues(currNode.childNodes[i], list);
        }
    }
}

function _binarySearch(elem, arr, startIndex, endIndex) {
    if (arr == null)
        return null;

    if (arr.length == 0)
        return 0;

    var median = Math.floor((startIndex+endIndex) / 2);
    if (arr[median] == elem) {
        return median;
    }
    else if (arr[median] > elem) {
        if (startIndex == endIndex)
            return startIndex;
        else
            return _binarySearch(elem, arr, startIndex, median);
    }
    else {
        if (startIndex == endIndex)
            return endIndex+1;
        else
            return _binarySearch(elem, arr, median+1, endIndex);
    }
}

function _getFirstDifferingIndex(str1, str2) {
    var lastIndex = Math.min(str1.length, str2.length);
    for (var i = 0; i < lastIndex; i++) {
        if (str1[i] != str2[i])
            break;
    }
    return i;
}
