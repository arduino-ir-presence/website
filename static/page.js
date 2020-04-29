var demoData = [
    ['Practice Room A', true],
    ['Practice Room B', false],
    ['Practice Room C', true]
];

var vm = new Vue({
    el: '#app',
    data: {
        tree: null,
        query: '',
        sortByAvailability: false
    },
    computed: {
        filteredRoomsList: function () {
            var roomsAlphabetical = this.tree.searchPrefix(sanitizeKey(this.query));
            if (!this.sortByAvailability) {
                return roomsAlphabetical;
            }

            var indexToInsertAvailable = 0;
            var indexToInsertUnavailable = 0;
            // Count the number of available rooms
            for (var i = 0; i < roomsAlphabetical.length; i++) {
                if (roomsAlphabetical[i][1]) {
                    indexToInsertUnavailable++;
                }
            }
            var roomsAvailabeFirst = [];
            roomsAvailabeFirst.length = roomsAlphabetical.length;
            for (var i = 0; i < roomsAlphabetical.length; i++) {
                var roomToInsert = roomsAlphabetical[i];
                if (roomToInsert[1]) {
                    roomsAvailabeFirst[indexToInsertAvailable++] = roomToInsert;
                }
                else {
                    roomsAvailabeFirst[indexToInsertUnavailable++] = roomToInsert;
                }
            }

            return roomsAvailabeFirst;
        }
    }
});

function sanitizeKey(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function loadData(roomsData) {
    console.log("Loading Data");
    var tree = new Trie();
    for (var i = 0; i < roomsData.length; i++) {
        var data = roomsData[i];
        var key = sanitizeKey(data[0]);
        tree.update(key, data, true);
    }
    vm.tree = tree;
    console.log("Done Loading");
}

const socket = io();

socket.on('initialData', loadData);

socket.on('update', function (roomData) {
    var data = vm.tree.getValue(sanitizeKey(roomData[0]), false);
    Vue.set(data, 1, roomData[1]);
});
