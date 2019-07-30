// Code to run socket.io on the html client side

(function($){

    let socket = io.connect('http://localhost:3000');

    // Upon the forms submission we need to emit
    $("form").submit(function(event){
        event.preventDefault();

        // Gets the values from the form
        let myObj = {
            username: $("#search-user").val(),
            query:  $("#search-images").val(),
            message:  $("#search-message").val()
        }

        // Emit the object over socket to the search socket
        console.log("Sending to server");
        socket.emit("receive", myObj);

        $("#search-user").prop("readonly", true);
        $("#search-images").val('')
        $("#search-message").val('')
    })

    socket.on('search', (obj) => {
        console.log("Reveived object from server");
        let output = $("#search-results"); // Creates a variable for output
        let myList = $('<ul>').attr("id", "image-list").addClass('list-group'); // Creates a variable for unordered list and adds id

        output.append(myList);  // Append the unordered list to the output

        myList.append($('<li>').text("User: " + obj.username).addClass('list-group-item'), $('<li>').text("Message: " + obj.message).addClass('list-group-item')); // Append list items to unordered list

        if(obj.results.length == 0){
            myList.append($('<li>').text("Results: None").addClass('list-group-item'))
        }
        else{
            obj.results.forEach(element => {
                //console.log(element.largeImageURL);
                myList.append($('<li>').text("Results").addClass('list-group-item'))
                // myList.append($("<li>").text(element.largeImageURL).addClass("list-group-item"));

                myList.append($('<li>').addClass('list-group-item').append('<img src=' + element.largeImageURL + ' style="width:400px;"/>'))
            });            
        }
    })
    
    
})(jQuery)