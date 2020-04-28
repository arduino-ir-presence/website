var demoTree = new LinearSearchPrefixQueryer([
    ['Practice Room A', true],
    ['Practice Room B', false],
    ['Practice Room C', true]
]);

var vm = new Vue({
    el: '#app',
    data: {
        tree: null,
        query: '',
        sortByAvailability: false
    },
    computed: {
        filteredRoomsList: function () {
            var roomsAlphabetical = this.tree.searchPrefix(this.query);
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

const socket = io();


socket.on('initialData', function (roomsData) {
    //vm.tree = new Trie(roomsData);
    console.log("SocketIO works: ", roomsData);
});
/*
socket.on('update', function (roomData) {
    vm.tree.setValue(roomData[0], roomData[1]);
});
*/
