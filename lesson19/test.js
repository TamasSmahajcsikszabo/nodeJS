Subscriber.create({
  name: "Jon",
  email: "jon@jonwexler.com",
  zipCode: "12345"
})
  .then(subscriber => console.log(subscriber))
  .catch(error => console.log(error.message));

var subscriber;
Subscriber.findOne({
  name: "Jon"
}).then(result => {
  subscriber = result;
  console.log(subscriber.getInfo());
});


