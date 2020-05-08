// var courses = [
//     {
//         title: "Event Driven Cakes",
//         cost: 50
//     },
//     {
//         title: "Asychronous Artichoke",
//         cost: 25
//     },
//     {
//         title: "Object Oriented Orange Juice",
//         cost: 10
//     }
// ];


module.exports = {
    showCourses: (req, res)  => { 
    res.render("courses", {
        offeredCourses: courses
        });
    },
    index: (req, res) => {
        res.render("index");
    },
    getSubscriptionPage: (req, res) => {
    res.render("contact")
    },
    chat: (req, res) => {
        res.render("chat");
    } 
};
