class ChatEngine{
    constructor(chatboxId,userEmail){
        this.chatBox = document.getElementById("#"+chatboxId);
        this.userEmail = userEmail;
        this.socket = io.connect('http://65.2.149.5:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        this.socket.on("connect" , function(){
            console.log('Connection established using sockets...!');

            self.socket.emit('join_room',{
                user_email : self.userEmail,
                chatroom : 'codeial'
            });
            self.socket.on('user_joined',function(data){
                console.log('A user has joined' , data);
            });
        });

    $('#b').click(function(){
        let msg = $('#a').val();
        if(msg!=''){
            self.socket.emit('send_message' , {
                message:msg,
                user_email:self.userEmail,
                chatroom:'codeial'
            })
        }
    });

    self.socket.on('receive_message',function(data){
        console.log('Message received', data.message);

        let newMessage = $('<li>');
        let messageType = 'other-message';
        if(data.user_email == self.userEmail){
            messageType = 'self-message';
        }
        newMessage.append($('<span>' ,{'html':data.message}));
        if(messageType == 'self-message'){
            newMessage.append($('<small>' ,{'html':'You'}));
        }else{
            newMessage.append($('<small>' ,{'html':data.user_email}));
        }

        newMessage.addClass(messageType);
        $("#chat-message-list").append(newMessage);
        $('#chat-message-display').scrollTop($('#chat-message-display')[0].scrollHeight);
    });



    }
}