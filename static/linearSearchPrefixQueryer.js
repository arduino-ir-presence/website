class LinearSearchPrefixQueryer {
    constructor(data) {
        this.data = data;
    }

    searchPrefix(key) {
        var result = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i][0].startsWith(key)) {
                result.push(this.data[i]);
            }
        }
        return result;
    }
}
