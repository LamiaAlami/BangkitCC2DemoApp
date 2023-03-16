'use-strict'
const Hapi = require('@Hapi/hapi');
const contacts = require('./contacts')

(async () =>{

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    server.route(
        [
            {
                //POST /contacts
                path: '/contacts',
                method: "POST",
                //prep request and hapi
                handler: (request, hapi) =>{ //hapi or actually h is the response toolkit from hapi.
                    const {name, mail, phoneNumber} = request.payload; //new data properties from request object
                                                    //apparently payload is the form items
                                                    //Anytime you send request data to your API, 
                                                    //you will be able to access this data in the route handler with request.payload
                    const id = contacts[contacts.length -1].id +1; //last + 1
                    
                    //validation check
                    if(!name || !mail || !phoneNumber){ //cek for falsy (kosong)
                        let respond = hapi.respond({message: 'input error'})
                        respond.code(400)
                        return respond
                    }
                    
                    contacts.push({
                        id, name, mail, phoneNumber //insert data to contacts
                    });
                    const respond = hapi.respond({message: 'add success'}); //hapi response message and code
                    respond.code(201);
                    return respond;
                }
            },

            {
                //GET /contacts
                path: '/contacts',
                method: "GET",
                //return contacts
                handler: () =>{
                    return contacts;
                }
            },
            
            {
                //DELETE contacts based by id
                path: '/contacts/{id}',
                method: "DELETE",
                handler: (request, hapi) => {
                    const{id} = request.params; // parameters is on request.params from hapi reference
                    //find index
                    let index = contacts.findIndex(item => item.id === id)

                    //validation if gagal (-1)
                    if(index == -1){
                        let respond = hapi.respond({message: 'delete failed, id not found'})
                    respond.code(400)
                    return respond;
                    }

                    //delete contact
                    contacts.splice(index, 1);
                    let respond = hapi.respond({message: 'delete success'})
                    respond.code(200)
                    return respond;
                }
            },
        ]
    );
    await server.start();
}  
);