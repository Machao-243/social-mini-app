package com.social.controller;

import com.social.dto.Response;
import com.social.entity.Comment;
import com.social.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping
    public Response<Comment> createComment(@RequestHeader("Authorization") String token, @RequestBody Comment comment) {
        Comment created = commentService.createComment(comment);
        return Response.success("Comment created", created);
    }

    @GetMapping("/post/{postId}")
    public Response<List<Comment>> getPostComments(@PathVariable Long postId,
                                                   @RequestParam(defaultValue = "1") Integer page,
                                                   @RequestParam(defaultValue = "10") Integer pageSize) {
        List<Comment> comments = commentService.getPostComments(postId, page, pageSize);
        return Response.success(comments);
    }

    @DeleteMapping("/{id}")
    public Response<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return Response.success("Comment deleted", null);
    }

    @PostMapping("/{id}/like")
    public Response<Void> likeComment(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        commentService.likeComment(id);
        return Response.success("Comment liked", null);
    }

    @DeleteMapping("/{id}/like")
    public Response<Void> unlikeComment(@PathVariable Long id) {
        commentService.unlikeComment(id);
        return Response.success("Like removed", null);
    }
}
