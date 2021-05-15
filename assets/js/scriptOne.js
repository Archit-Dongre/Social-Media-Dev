{
    //method to submit the form data using new post using ajax
    let createPost = function(req,res){
        let postForm = $("#new-post-form");
        postForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: "POST",
                url:"/users/posts/createPost",
                data: postForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $("#post-display>ul").prepend(newPost);
                    notySuccess("Successfully created Post")
                    let x = document.querySelectorAll(".delete-post-button");
                    likeFunctionality();
                    deletePost();
                },error:function(error){
                    console.log(error.responseText);
                }
              });
        })
    }
    //method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id='post-${post.id}'>
        <div class="post-container" id="post-container-${post.id}">
        <div style='border:2px dashed white'>
        <small>
            <a class='delete-post-button' id='delete-post-${post.id}' href="/users/posts/destroy/?id=${post.id}">Delete Post</a>
        </small>
        <p>${post.content}</p> 
        <small >${post.name}</small>           
        </div>
        <br>
        <div id='like-post-button-container'>
        <span id='post-like-display-${post.id}'> 0 Likes </span> &nbsp <form><button type="button"  value='${post.id}' class='like-post-button'>Like</button></form> 
        </div>
        <br>
        <h4>Comment Section</h4>
        <div id='comment-container-${post.id}'>
            
        
        </div>
        <form action="/users/comment/createComment" class='new-comment-form' id='new-comment-form-${post.id}' method="POST">
            <input type="hidden" name='post_id' value="${post.id}">
            <textarea class='ta' name='content' cols="20" rows="3" placeholder="Type comment..." required></textarea>
            <br>
            <input type="submit" value='Comment'>
        </form>
    </div>
    </li>
        `)
    }

    //method to delete a post from DOM

    let deletePost = function(){
        let x = document.querySelectorAll(".delete-post-button");
        for(a of x){
            var events = $._data(a, "events");
            if(events != null){
                console.log($._data(a, "events").click.length);
                continue;
            }else{
                $(a).click(function(e){
                    e.preventDefault();
                    $.ajax({
                        type: "GET",
                        url:$(this).prop('href'),
                        success: function(data){
                            $(`#post-${data.data.post_id}`).remove();
                            notySuccess("Successfuly deleted post and comments")
                        },error:function(error){
                            console.log(error.responseText);
                        }
                    });
                })
            }
        }
    }

    let notySuccess = function(text){
        return new Noty({
            text:text,
            theme:'mint',
            timeout:1500,
            progressBar:true,
            closeWith:['click'],
            type:'success'
        }).show();
    }

    let notyError = function(text){
        return new Noty({
            text:text,
            theme:'mint',
            timeout:1500,
            progressBar:true,
            closeWith:['click'],
            type:'error'
        }).show();
    }

    let createComment = function(req,res){
        let x =  $('.new-comment-form');
        for(a of x){
            console.log($(a));
            $(a).submit(function(e){
                e.preventDefault();
                $.ajax({
                    type:'POST',
                    url:"/users/comment/createComment",
                    data:$(this).serialize(),
                    success:function(data){
                        console.log("Success"); 
                        newCommentDom(data.data);
                        notySuccess("Comment Posted");
                        let x = document.querySelectorAll(".delete-comment-button");
                        for(a of x){
                         deleteComment(a);
                        }    
                    },error:function(error){
                        console.log(error.responseText);
                    }
                })
            });
        }  
    }

    let newCommentDom = function(d){
        let commentContainer = $(`#comment-container-${d.post_id}`);
        commentContainer.prepend($(`
        <div  id='comment-${d.comment_id}' style="position:relative;border:2px solid black">
        ${d.content}
        <br>
       
        <small>
            <a class='delete-comment-button' href='/users/comment/destroy/${d.comment_id}'>Delete Comment</a>
        </small>
        <small style='position:relative;margin-left:93%;color:yellow'>${d.user_name}</small>
    </div>`));
    return;
    }

    let deleteComment = function(deleteLink){
        
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'GET',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    console.log("reached this  point atleast")
                    $(`#comment-${data.data.comment}`).remove();
                    notySuccess("Successfuly comment")

                },error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }
    let likeFunctionality = function(){
        let value = 0;
        //myVar = !myVar;
        let allPostLikeButtons = document.querySelectorAll(".like-post-button");
        console.log(allPostLikeButtons.length , "Length of for loop work");
        for(a of allPostLikeButtons){
                var events = $._data(a, "events");
                if(events != null){
                    console.log($._data(a, "events").click.length);
                    continue;
                }else{
                $( a ).click(function() {
                    console.log(a);
                    $.ajax({
                        type:'POST',
                        url:'/users/like-post',
                        data:{"post_id":$(this).attr('value')},
                        success:function(data){  
                            console.log("LIKE WAS REGISTERED IN DATABASE");        
                            let likeDisplay = document.querySelector('#post-like-display-'+data.data.post_id);
                            console.log(likeDisplay);
                            likeDisplay.innerText = data.data.likeCount + " Likes";
                            notySuccess(data.data.message);
                        },error:function(error){
                            console.log(error.responseText);
                        }
                    })
                })
            }
        }
    }


    createPost();
    createComment();
    likeFunctionality();
    deletePost();
    
    
}