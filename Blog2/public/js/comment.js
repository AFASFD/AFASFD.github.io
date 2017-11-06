var limit = 10;
var page = 1;
var pages = 0;
var comments = [];
/**
 * 提交评论
 */
$('.pager'). delegate('a','click',function(){
    if($(this).parent().hasClass('previous')){
        page--;
    }
    else{
        page++;
    }
    renderComment();
});
$('#messageBtn').on('click',function(){
    $.ajax({
        type: 'POST',
        url:'/api/comment/post',
        data:{
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        dataType: 'json',
        success: function(result){
            $('#messageContent').val('');
            comments=result.data.comments.reverse();
            renderComment();
            
        }
    });
});
function renderComment(){
    $('#messageCount').html(comments.length);
    pages=Math.max(Math.ceil(comments.length/limit),1);
    //最大页数
    page=Math.min(pages,page);
    //最小页数
    page=Math.max(page,1);
    var start=Math.max(0,(page-1)*limit);
    var end=Math.min(start+limit,comments.length);
    var $lis = $('.pager li');
    $lis.eq(1).html( page + ' / ' +  pages);
    if(page<=1){
        page=1;
        $('.previous').html('<span>没有上一页了</span>');
    }else{
        $('.previous').html('<a href="javascript:;">上一页</a>');
    }
    if(page>=pages){
        page=pages;
        $('.next').html('<span>没有下一页了</span>');
    }else{
        $('.next').html('<a href="javascript:;">下一页</a>');
    }
    if(comments.length==0){
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
    }else{
        var html='';
        for(var i=start;i<end;i++){
            html+='<div class="messageBox"><p class="name clear"><span class="fl">'+comments[i].username+'</span><span class="fr">'+comments[i].postTime+'</span></p><p>'+comments[i].content+'</p></div>'
        }
        $('.messageList').html(html);
    }
}
$.ajax({
    type: 'get',
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function(result){
        comments=result.data.comments.reverse();
        renderComment();
    }
});
