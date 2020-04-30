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
            var indexToInsertOccupied = 0;
            // Count the number of available rooms
            for (var i = 0; i < roomsAlphabetical.length; i++) {
                if (!roomsAlphabetical[i].isOccupied) {
                    indexToInsertOccupied++;
                }
            }
            var roomsAvailabeFirst = [];
            roomsAvailabeFirst.length = roomsAlphabetical.length;
            for (var i = 0; i < roomsAlphabetical.length; i++) {
                var roomToInsert = roomsAlphabetical[i];
                if (roomToInsert.isOccupied) {
                    roomsAvailabeFirst[indexToInsertOccupied++] = roomToInsert;
                }
                else {
                    roomsAvailabeFirst[indexToInsertAvailable++] = roomToInsert;
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
        var roomData = roomsData[i];
        var room = {"name": roomData[0], "isOccupied": roomData[1]};
        var key = sanitizeKey(room.name);
        tree.update(key, room, true);
    }
    vm.tree = tree;
    console.log("Done Loading");
}

const socket = io();

socket.on('initialData', loadData);

socket.on('update', function (inputData) {
    var [name, newIsOccupied] = inputData;
    var key = sanitizeKey(name)
    var room = vm.tree.getValue(key, false);
    room.isOccupied = newIsOccupied;
});
