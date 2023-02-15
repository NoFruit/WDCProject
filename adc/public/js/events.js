/*
Until the server is set up, 
we will temporarily use static json to test 
if the filter functionality is available
*/

var events = new Vue({
    el: '#mainDiv',
    data: {
        isChecked: false,
        checkedStyle: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        radioStyle: [1, 0, 0, 0, 0, 0, 0],

        categories: [],
        allCategories: [
            { "id": 1, "value": "Art & Culture" },
            { "id": 2, "value": "Studies" },
            { "id": 3, "value": "Hobbies & Passions" },
            { "id": 4, "value": "Sports & Fitness" },
            { "id": 5, "value": "Games" },
        ],


        locations: [],
        allLocations: [
            { "id": 1, "value": "Adelaide City" },
            { "id": 2, "value": "Norwood" },
            { "id": 3, "value": "Prospect" },
            { "id": 4, "value": "Edwardstown" },
            { "id": 5, "value": "Blackwood" },
        ],
        times: "any day",
        allTimes: [
            { "id": 1, "value": "any day", "label": "Any Day" },
            { "id": 2, "value": "today", "label": "Today" },
            { "id": 3, "value": "tommorrow", "label": "Tommorrow" },
            { "id": 4, "value": "this week", "label": "This week" },
            { "id": 5, "value": "this weekend", "label": "This weekend" },
            { "id": 6, "value": "next week", "label": "Next week" },
            { "id": 7, "value": "custom", "label": "Custom" },
        ],


        events: [
            { "time": '2022-05-16T14:00:00.000Z', "category": "Art & Culture", "location": "Adelaide City", "title": 'Visit xxx art gallery' },
            { "time": '2022-06-12T16:00:00.000Z', "category": "Sports & Fitness", "location": "Adelaide City", "title": 'Play Tennis' },
            { "time": '2022-05-20T04:00:00.000Z', "category": "Games", "location": "Prospect", "title": 'Card Games' },
            { "time": '2022-05-30T12:00:00.000Z', "category": "Art & Culture", "location": "Prospect", "title": 'Test1' },
            { "time": '2022-05-26T07:00:00.000Z', "category": "Hobbies & Passions", "location": "Blackwood", "title": 'Test2' },
            { "time": '2022-05-13T07:00:00.000Z', "category": "Sports & Fitness", "location": "Edwardstown", "title": 'Test3' },
            { "time": '2022-05-14T04:00:00.000Z', "category": "Studies", "location": "Norwood", "title": 'Test4' },
            { "time": '2022-05-15T08:00:00.000Z', "category": "Games", "location": "Blackwood", "title": 'Test4' },
            { "time": '2022-05-21T02:00:00.000', "category": "Art & Culture", "location": "Adelaide City", "title": '[Adelaide] Concert "Superstar"', "img": "super start concert.png" },
            { "time": '2022-05-26T13:00:00.000', "category": "Sports & Fitness", "location": "Adelaide City", "title": 'Badminton Match', "img": "badminton.jpg" },
            { "time": '2022-05-20T20:00:00.000', "category": "Art & Culture", "location": "Adelaide City", "title": 'Music Festival', "img": "musicfestival.jpg" },
        ],

        hidden: []
    },

    mounted() {
        this.filtAll();
        this.sortEvents();
    },

    methods: {

        filtCate: function() {
            var temp = [];
            if (this.categories.length == 0) {
                temp = this.events;
            } else {
                for (var i = 0; i < this.categories.length; i++) {
                    categories = this.categories;
                    var t;
                    t = this.events.filter(function(x) {
                        return x.category === categories[i];
                    })

                    for (j = 0; j < t.length; j++) {
                        temp.push(t[j]);
                    }
                }
            }
            return temp;
        },


        filtLoca: function(cates) {
            var temp = [];
            if (this.locations.length == 0) {
                temp = cates;
            } else {
                for (var i = 0; i < this.locations.length; i++) {
                    locations = this.locations;
                    var t;
                    t = cates.filter(function(x) {
                        return x.location === locations[i];
                    })

                    for (j = 0; j < t.length; j++) {
                        temp.push(t[j]);
                    }
                }
            }
            return temp;
        },

        filtTime: function(locas) {
            var temp = locas;
            if (this.times == "any day") {
                return temp;
            }

            switch (this.times) {
                case "today":
                    now = new Date();
                    temp = locas.filter(function(x) {
                        var timeInside = new Date(x.time);
                        return timeInside.getDate() === now.getDate() && timeInside.getMonth() === now.getMonth() && timeInside.getFullYear() === now.getFullYear();
                    })
                    break;

                case "tommorrow":
                    now = new Date();
                    temp = locas.filter(function(x) {
                        var timeInside = new Date(x.time);
                        return timeInside.getDate() === now.getDate() + 1 && timeInside.getMonth() === now.getMonth() && timeInside.getFullYear() === now.getFullYear();
                    })
                    break;

                case "this week":
                    now = new Date();
                    var firstdayoffset = (now.getDay() == 0 ? 7 : now.getDay()) - 1
                    now.setDate(now.getDate() - firstdayoffset)
                    var firstday = now.toISOString().substring(0, 10)
                    firstday = new Date(firstday)
                    now.setDate(now.getDate() + 7)
                    var lastday = now.toISOString().substring(0, 10)
                    lastday = new Date(lastday)
                    temp = locas.filter(function(x) {
                        var timeInside = new Date(x.time);
                        return timeInside > firstday && timeInside < lastday;
                    })
                    break;

                case "this weekend":
                    now = new Date();
                    var firstdayoffset = (now.getDay() == 0 ? 7 : now.getDay()) - 1
                    now.setDate(now.getDate() - firstdayoffset + 5)
                    var firstday = now.toISOString().substring(0, 10)
                    firstday = new Date(firstday)
                    now.setDate(now.getDate() + 2)
                    var lastday = now.toISOString().substring(0, 10)
                    lastday = new Date(lastday)
                    temp = locas.filter(function(x) {
                        var timeInside = new Date(x.time);
                        return timeInside > firstday && timeInside < lastday;
                    })
                    break;

                case "next week":
                    now = new Date();
                    var firstdayoffset = (now.getDay() == 0 ? 7 : now.getDay()) - 1
                    now.setDate(now.getDate() - firstdayoffset + 7)
                    var firstday = now.toISOString().substring(0, 10)
                    firstday = new Date(firstday)
                    now.setDate(now.getDate() + 7)
                    var lastday = now.toISOString().substring(0, 10)
                    lastday = new Date(lastday)
                    temp = locas.filter(function(x) {
                        var timeInside = new Date(x.time);
                        return timeInside > firstday && timeInside < lastday;
                    })
                    break;
            }
            return temp;
        },

        filtAll: function() {
            var cates = []
            var locas = []
            var temp = []
            cates = this.filtCate();
            locas = this.filtLoca(cates);
            temp = this.filtTime(locas);
            this.hidden = temp;
            this.sortEvents();
        },

        sortEvents: function() {

            var arr1 = this.hidden;

            function ascend(a, b) {
                var x = new Date(a.time);
                var y = new Date(b.time);
                return x - y;
            }

            arr1.sort(ascend);
        },



        //buttons
        selectAllCate: function() {
            this.categories = ["Art & Culture", "Studies", "Hobbies & Passions", "Sports & Fitness", "Games"];
            this.filtAll();
            this.sortEvents();
            this.checkedStyle[0] = [1, 1, 1, 1, 1];
        },

        clearAllCate: function() {
            this.categories = [];
            this.filtAll();
            this.sortEvents();
            this.checkedStyle[0] = [0, 0, 0, 0, 0];
        },

        selectAllLoca: function() {
            this.locations = ["Adlaide City", "Norwood", "Prospect", "Edwardstown", "Blackwood"];
            this.filtAll();
            this.sortEvents();
            this.checkedStyle[1] = [1, 1, 1, 1, 1];
        },

        clearAllLoca: function() {
            this.locations = [];
            this.filtAll();
            this.sortEvents();
            this.checkedStyle[1] = [0, 0, 0, 0, 0];
        },


        //calc the attrs:
        findImage: function(hide) {
            console.log(hide)
            if ("img" in hide) {
                var imgName = hide.img;
                var str = "/icons/" + imgName;
                return str;
            } else {
                return "/icons/OIP-C.jpg"
            }
        }
    },
    delimiters: ['${', '}']
});