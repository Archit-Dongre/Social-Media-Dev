{let e=function(e,t){let o=$("#new-post-form");o.submit(function(e){e.preventDefault(),$.ajax({type:"POST",url:"/users/posts/createPost",data:o.serialize(),success:function(e){e=n(e.data.post);$("#post-display>ul").prepend(e),l("Successfully created Post");document.querySelectorAll(".delete-post-button");r(),s()},error:function(e){console.log(e.responseText)}})})},n=function(e){return $(`<li id='post-${e.id}'>
        <div class="post-container" id="post-container-${e.id}">
        <div style='border:2px dashed white'>
        <small>
            <a class='delete-post-button' id='delete-post-${e.id}' href="/users/posts/destroy/?id=${e.id}">Delete Post</a>
        </small>
        <p>${e.content}</p> 
        <small >${e.name}</small>           
        </div>
        <br>
        <div id='like-post-button-container'>
        <span id='post-like-display-${e.id}'> 0 Likes </span> &nbsp <form><button type="button"  value='${e.id}' class='like-post-button'>Like</button></form> 
        </div>
        <br>
        <h4>Comment Section</h4>
        <div id='comment-container-${e.id}'>
            
        
        </div>
        <form action="/users/comment/createComment" class='new-comment-form' id='new-comment-form-${e.id}' method="POST">
            <input type="hidden" name='post_id' value="${e.id}">
            <textarea class='ta' name='content' cols="20" rows="3" placeholder="Type comment..." required></textarea>
            <br>
            <input type="submit" value='Comment'>
        </form>
    </div>
    </li>
        `)},s=function(){for(a of document.querySelectorAll(".delete-post-button"))null==$._data(a,"events")?$(a).click(function(e){e.preventDefault(),$.ajax({type:"GET",url:$(this).prop("href"),success:function(e){$(`#post-${e.data.post_id}`).remove(),l("Successfuly deleted post and comments")},error:function(e){console.log(e.responseText)}})}):console.log($._data(a,"events").click.length)},l=function(e){return new Noty({text:e,theme:"mint",timeout:1500,progressBar:!0,closeWith:["click"],type:"success"}).show()},t=function(e){return new Noty({text:e,theme:"mint",timeout:1500,progressBar:!0,closeWith:["click"],type:"error"}).show()},o=function(e,t){for(a of $(".new-comment-form"))console.log($(a)),$(a).submit(function(e){e.preventDefault(),$.ajax({type:"POST",url:"/users/comment/createComment",data:$(this).serialize(),success:function(e){console.log("Success"),c(e.data),l("Comment Posted");for(a of document.querySelectorAll(".delete-comment-button"))i(a)},error:function(e){console.log(e.responseText)}})})},c=function(e){let t=$(`#comment-container-${e.post_id}`);t.prepend($(`
        <div  id='comment-${e.comment_id}' style="position:relative;border:2px solid black">
        ${e.content}
        <br>
       
        <small>
            <a class='delete-comment-button' href='/users/comment/destroy/${e.comment_id}'>Delete Comment</a>
        </small>
        <small style='position:relative;margin-left:93%;color:yellow'>${e.user_name}</small>
    </div>`))},i=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"GET",url:$(t).prop("href"),success:function(e){console.log("reached this  point atleast"),$(`#comment-${e.data.comment}`).remove(),l("Successfuly comment")},error:function(e){console.log(e.responseText)}})})},r=function(){var e=document.querySelectorAll(".like-post-button");console.log(e.length,"Length of for loop work");for(a of e)null==$._data(a,"events")?$(a).click(function(){console.log(a),$.ajax({type:"POST",url:"/users/like-post",data:{post_id:$(this).attr("value")},success:function(e){console.log("LIKE WAS REGISTERED IN DATABASE");let t=document.querySelector("#post-like-display-"+e.data.post_id);console.log(t),t.innerText=e.data.likeCount+" Likes",l(e.data.message)},error:function(e){console.log(e.responseText)}})}):console.log($._data(a,"events").click.length)};e(),o(),r(),s()}